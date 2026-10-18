import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const HOOK = path.resolve('skills/seatbelt/templates/pre-commit')
const hasSh = spawnSync('sh', ['-c', 'exit 0']).status === 0

// Keys are built from parts so this file never contains one.
const fake = {
  stripe: 'sk_' + 'live_' + 'A1b2C3d4E5f6G7h8I9j0K1l2',
  openai: 'sk-' + 'proj-' + 'A1b2C3d4E5f6G7h8I9j0K1l2M3',
  serviceRole: 'eyJhbGciOiJIUzI1NiJ9.' + Buffer.from('{"role":"service_role"}').toString('base64url') + '.sig',
  anon: 'eyJhbGciOiJIUzI1NiJ9.' + Buffer.from('{"role":"anon"}').toString('base64url') + '.sig',
  dbUrl: 'postgres' + 'ql://postgres:' + 'hunter2' + '@db.example.co:5432/postgres',
}

function commitAttempt(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'seatbelt-hook-'))
  const git = (...args) => spawnSync('git', args, { cwd: dir, encoding: 'utf8' })
  git('init', '-q')
  for (const [name, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true })
    fs.writeFileSync(path.join(dir, name), content)
  }
  git('add', '-A')
  const r = spawnSync('sh', [HOOK], { cwd: dir, encoding: 'utf8' })
  fs.rmSync(dir, { recursive: true, force: true })
  return r
}

test('pre-commit stops secret keys and secret files without printing them', { skip: !hasSh }, () => {
  for (const [name, key] of Object.entries({ stripe: fake.stripe, openai: fake.openai, serviceRole: fake.serviceRole, dbUrl: fake.dbUrl })) {
    const r = commitAttempt({ 'src/lib/client.js': `const key = '${key}'\n` })
    assert.equal(r.status, 1, `${name} should be refused`)
    assert.match(r.stdout, /src\/lib\/client\.js adds what looks like a secret key/)
    assert.ok(!r.stdout.includes(key), `${name} must not be printed`)
  }
  assert.equal(commitAttempt({ '.env': 'A=1\n' }).status, 1)
  assert.equal(commitAttempt({ 'app/.env.local': 'A=1\n' }).status, 1)
})

test('pre-commit lets public keys, examples and ordinary code through', { skip: !hasSh }, () => {
  const r = commitAttempt({
    'src/lib/supabase.js': `const anon = '${fake.anon}'\n`,
    'src/lib/stripe.js': "const pk = 'pk_test_EXAMPLEONLY000'\n",
    '.env.example': 'STRIPE_SECRET_KEY=\n',
    'src/ui.css': '.task-list-item-checkbox-wrapper-outer { color: red }\n',
  })
  assert.equal(r.status, 0, r.stdout)
})
