import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { review, gitCommands } from '../plugins/seatbelt-guard/hooks/guard.mjs'

const HOOK = path.resolve('plugins/seatbelt-guard/hooks/guard.mjs')

// Keys are built from parts so this file never contains one.
const fake = {
  stripe: 'sk_' + 'live_' + 'A1b2C3d4E5f6G7h8I9j0K1l2',
  openai: 'sk-' + 'proj-' + 'A1b2C3d4E5f6G7h8I9j0K1l2M3',
  aws: 'AK' + 'IA' + 'ABCDEFGHIJKLMNOP',
  serviceRole: 'eyJhbGciOiJIUzI1NiJ9.' + Buffer.from('{"role":"service_role"}').toString('base64url') + '.sig',
  anon: 'eyJhbGciOiJIUzI1NiJ9.' + Buffer.from('{"role":"anon"}').toString('base64url') + '.sig',
  dbUrl: 'postgres' + 'ql://postgres:' + 'hunter2' + '@db.example.co:5432/postgres',
}

function repo(files = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'seatbelt-guard-'))
  const git = (...args) => spawnSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...args], { cwd: dir, encoding: 'utf8' })
  git('init', '-q')
  write(dir, { 'README.md': 'hi\n' })
  git('add', '-A')
  git('commit', '-qm', 'start')
  write(dir, files)
  return { dir, git, done: () => fs.rmSync(dir, { recursive: true, force: true }) }
}

function write(dir, files) {
  for (const [name, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true })
    fs.writeFileSync(path.join(dir, name), content)
  }
}

test('commit with a staged key is refused and the key is never shown', () => {
  for (const [name, key] of Object.entries({ stripe: fake.stripe, openai: fake.openai, aws: fake.aws, serviceRole: fake.serviceRole, dbUrl: fake.dbUrl })) {
    const r = repo({ 'src/lib/client.js': `const key = '${key}'\n` })
    r.git('add', '-A')
    const reason = review('git commit -m "add client"', r.dir)
    r.done()
    assert.match(reason ?? '', /src\/lib\/client\.js adds what looks like a secret key/, `${name} should be refused`)
    assert.ok(!reason.includes(key), `${name} must not be shown`)
  }
})

test('commit of a secret file is refused, examples are not', () => {
  const r = repo({ 'app/.env.local': 'A=1\n', '.env.example': 'STRIPE_SECRET_KEY=\n' })
  r.git('add', '-A')
  const reason = review('git commit -m wip', r.dir)
  r.done()
  assert.match(reason, /app\/\.env\.local is a secret file/)
  assert.doesNotMatch(reason, /\.env\.example/)
})

test('commit that adds files in the same command is checked before they are added', () => {
  const r = repo({ 'src/pay.js': `const k = '${fake.stripe}'\n` })
  const reason = review('git add . && git commit -m "pay"', r.dir)
  const plain = review('git commit -m "pay"', r.dir)
  r.done()
  assert.match(reason, /src\/pay\.js adds what looks like a secret key/)
  assert.equal(plain, null, 'an untracked file that nobody adds is not part of the commit')
})

test('public keys, examples and ordinary code pass', () => {
  const r = repo({
    'src/lib/supabase.js': `const anon = '${fake.anon}'\n`,
    'src/lib/stripe.js': "const pk = 'pk_test_EXAMPLEONLY000'\n",
    '.env.example': 'STRIPE_SECRET_KEY=\n',
    'src/ui.css': '.task-list-item-checkbox-wrapper-outer { color: red }\n',
  })
  r.git('add', '-A')
  assert.equal(review('git commit -m "ui"', r.dir), null)
  r.done()
})

test('push is refused when an outgoing commit added a key, even if a later commit removed it', () => {
  const r = repo({ 'server.js': `const k = '${fake.openai}'\n` })
  r.git('add', '-A')
  r.git('commit', '-qm', 'oops')
  write(r.dir, { 'server.js': 'const k = process.env.OPENAI_API_KEY\n' })
  r.git('commit', '-qam', 'fix')
  const reason = review('git push origin main', r.dir)
  r.done()
  assert.match(reason, /Seatbelt stopped this push\. server\.js adds what looks like a secret key/)
  assert.ok(!reason.includes(fake.openai))
})

test('push of clean commits passes', () => {
  const r = repo({ 'a.js': 'export const a = 1\n' })
  r.git('add', '-A')
  r.git('commit', '-qm', 'a')
  assert.equal(review('git push', r.dir), null)
  r.done()
})

test('skipping the checks or moving them is refused', () => {
  const dir = os.tmpdir()
  for (const cmd of ['git commit --no-verify -m x', 'git commit -nm x', 'git commit -n -m x', 'git push --no-verify',
    'git push --no-ver', 'cd app && git commit -am "x" --no-verify', 'bash -c "git commit --no-verify -m x"']) {
    assert.match(review(cmd, dir) ?? '', /--no-verify/, cmd)
  }
  for (const cmd of ['git config core.hooksPath /dev/null', 'git config --unset core.hooksPath', 'git -c core.hooksPath=x commit -m y',
    'git config --global core.hookspath ~/hooks']) {
    assert.match(review(cmd, dir) ?? '', /core\.hooksPath/, cmd)
  }
  assert.equal(review('git config core.hooksPath .githooks', dir), null, 'turning the Seatbelt check on is allowed')
  assert.equal(review('git commit -m "explain --no-verify and core.hooksPath in the docs"', fs.mkdtempSync(path.join(dir, 'x-'))), null)
  assert.equal(review('git push -n', fs.mkdtempSync(path.join(dir, 'x-'))), null, 'push -n is a dry run')
})

test('finds git commands behind cd, git -C and environment settings', () => {
  const base = path.resolve('/work')
  const [c] = gitCommands('cd app && GIT_PAGER=cat git -C sub commit -m "a; b"', base)
  assert.equal(c.dir, path.resolve(base, 'app', 'sub'))
  assert.equal(c.sub, 'commit')
  assert.deepEqual(c.args, ['-m', 'a; b'])
})

test('the hook answers Claude Code with a deny decision and stays silent otherwise', () => {
  const r = repo({ '.env': 'A=1\n' })
  r.git('add', '-A')
  const run = (command) => spawnSync(process.execPath, [HOOK], {
    input: JSON.stringify({ tool_name: 'Bash', tool_input: { command }, cwd: r.dir }), encoding: 'utf8',
  })
  const denied = run('git commit -m env')
  const other = run('ls -la')
  r.done()
  const out = JSON.parse(denied.stdout).hookSpecificOutput
  assert.equal(out.permissionDecision, 'deny')
  assert.match(out.permissionDecisionReason, /\.env is a secret file/)
  assert.equal(other.stdout, '')
  assert.equal(other.status, 0)
})

test('plugin hooks point at the guard script', () => {
  const hooks = JSON.parse(fs.readFileSync('plugins/seatbelt-guard/hooks/hooks.json', 'utf8')).hooks.PreToolUse[0]
  assert.equal(hooks.matcher, 'Bash')
  assert.match(hooks.hooks[0].command, /\$\{CLAUDE_PLUGIN_ROOT\}\/hooks\/guard\.mjs/)
})
