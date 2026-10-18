// Seatbelt guard: a Claude Code hook that runs before every shell command the AI starts.
// It stops `git commit` and `git push` when they would save or send a secret key or a secret
// file, and stops attempts to skip or move git's own checks. It never prints a key.
// Keep the patterns in step with skills/seatbelt/templates/pre-commit.
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { readFileSync, statSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

// Keys that give access. Public keys (Stripe pk_, Supabase anon or publishable, Firebase web config) are not listed.
const KEYS = new RegExp([
  'sk_live_[0-9A-Za-z]{8,}', 'rk_live_[0-9A-Za-z]{8,}', 'sb_secret_[0-9A-Za-z_-]{8,}', '(^|[^0-9A-Za-z_-])sk-[0-9A-Za-z_-]{20,}',
  '-----BEGIN [A-Z ]*PRIVATE KEY-----', 'AKIA[0-9A-Z]{16}', 'gh[pousr]_[0-9A-Za-z]{30,}', 'glpat-[0-9A-Za-z_-]{20,}',
  'xox[abprs]-[0-9A-Za-z-]{10,}', 'postgres(ql)?://[^:/\\s]+:[^@\\s]+@',
  // A Supabase key whose role is service_role, in any of its three encodings.
  'eyJ[0-9A-Za-z_-]*\\.eyJ[0-9A-Za-z_-]*(c2VydmljZV9yb2xl|NlcnZpY2Vfcm9sZ|zZXJ2aWNlX3JvbG)',
].join('|'))

const exampleFile = (f) => /\.(example|sample|template)$/.test(f)
function secretFile(f) {
  const base = path.posix.basename(f)
  return base === '.env' || base.startsWith('.env.') || base.startsWith('id_rsa') || /\.(pem|p12|pfx|key)$/.test(base)
}

// Splits a shell command into simple commands, each a list of words, keeping quoted text whole.
export function split(cmd) {
  const segs = [[]]
  let word = null
  let quote = null
  const end = () => { if (word !== null) segs.at(-1).push(word); word = null }
  for (let i = 0; i < cmd.length; i++) {
    const c = cmd[i]
    if (quote) { if (c === quote) quote = null; else word += c; continue }
    if (c === '"' || c === "'") { quote = c; word ??= ''; continue }
    if (c === '\\') { word = (word ?? '') + (cmd[++i] ?? ''); continue }
    if (c === ' ' || c === '\t') { end(); continue }
    if (';&|\n()'.includes(c)) { end(); segs.push([]); continue }
    word = (word ?? '') + c
  }
  end()
  return segs.filter((s) => s.length)
}

function toPath(dir, p) {
  if (process.platform === 'win32' && /^\/[a-z](\/|$)/i.test(p)) p = `${p[1]}:/${p.slice(3)}` // Git Bash style /c/Users
  return path.resolve(dir, p)
}

// Returns the git commands in a shell command: { dir, sub, args, globals }.
export function gitCommands(cmd, cwd) {
  const found = []
  let dir = cwd
  for (const seg of split(cmd)) {
    let i = 0
    while (/^[A-Za-z_][A-Za-z0-9_]*=/.test(seg[i] ?? '')) i++
    const prog = path.basename(seg[i] ?? '').replace(/\.exe$/i, '')
    if (prog === 'cd' && seg[i + 1]) dir = toPath(dir, seg[i + 1])
    // Commands handed to another shell: sh -c "...", eval "...".
    if (['sh', 'bash', 'zsh', 'dash'].includes(prog) && seg.includes('-c')) found.push(...gitCommands(seg[seg.indexOf('-c') + 1] ?? '', dir))
    if (prog === 'eval') found.push(...gitCommands(seg.slice(i + 1).join(' '), dir))
    if (prog !== 'git') continue
    let gitDir = dir
    const globals = []
    for (i++; i < seg.length && seg[i].startsWith('-'); i++) {
      if (seg[i] === '-C') gitDir = toPath(gitDir, seg[++i] ?? '.')
      else if (['-c', '--git-dir', '--work-tree', '--namespace'].includes(seg[i])) globals.push(seg[i], seg[++i] ?? '')
      else globals.push(seg[i])
    }
    found.push({ dir: gitDir, sub: seg[i], args: seg.slice(i + 1), globals })
  }
  return found
}

const git = (dir, ...args) => execFileSync('git', ['-C', dir, '-c', 'core.quotePath=false', ...args],
  { encoding: 'utf8', maxBuffer: 512 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] })
const names = (out) => out.split('\0').filter(Boolean)

// Files whose added lines contain a key, from a unified diff.
function filesWithKeys(diff) {
  const hits = new Set()
  let file = null
  for (const line of diff.split('\n')) {
    if (line.startsWith('+++ ')) file = line.startsWith('+++ b/') ? line.slice(6) : null
    else if (file && line.startsWith('+') && !exampleFile(file) && KEYS.test(line)) hits.add(file)
  }
  return hits
}

function verdict(files, keyFiles) {
  const problems = []
  for (const f of new Set(files)) if (secretFile(f) && !exampleFile(f)) problems.push(`${f} is a secret file. Add it to .gitignore and keep it out of save points.`)
  for (const f of keyFiles) if (!secretFile(f)) problems.push(`${f} adds what looks like a secret key. Move it to your secret variables.`)
  return problems
}

// What a commit could save: staged changes and changes not staged yet (commit -a and
// commit <file> take those too). New files count only when the same command adds them.
function commitProblems(dir, withNewFiles) {
  const files = []
  const keyFiles = new Set()
  for (const staged of [['--cached'], []]) {
    files.push(...names(git(dir, 'diff', ...staged, '--name-only', '--diff-filter=ACMR', '-z')))
    for (const f of filesWithKeys(git(dir, 'diff', ...staged, '-U0', '--no-color', '--no-ext-diff', '--diff-filter=ACMR'))) keyFiles.add(f)
  }
  if (withNewFiles) {
    const top = git(dir, 'rev-parse', '--show-toplevel').trim()
    for (const f of names(git(dir, 'ls-files', '--others', '--exclude-standard', '-z', '--full-name', ':/'))) {
      files.push(f)
      try {
        const full = path.join(top, f)
        // ponytail: skips untracked files over 1 MB; the push scan still sees them once committed.
        if (statSync(full).size <= 1024 * 1024 && readFileSync(full, 'utf8').split('\n').some((l) => KEYS.test(l))) keyFiles.add(f)
      } catch {}
    }
  }
  return verdict(files, keyFiles)
}

// What a push would send: every local commit that no remote has yet, on any branch.
function pushProblems(dir) {
  const range = ['--branches', '--not', '--remotes']
  const files = names(git(dir, 'log', ...range, '--name-only', '--diff-filter=ACMR', '--format=', '-z'))
  const diff = git(dir, 'log', ...range, '-p', '-U0', '--no-color', '--no-ext-diff', '--diff-filter=ACMR', '--format=')
  return verdict(files, filesWithKeys(diff))
}

const SKIP = 'It would skip the checks that look for secret keys before saving (--no-verify). Run it again without that option.'
const MOVE = 'It would change where git looks for its safety checks (core.hooksPath), which can turn off the secret check. Leave that setting as it is.'

// Returns a plain-language reason to refuse the command, or null to let it run.
export function review(command, cwd) {
  const cmds = gitCommands(command, cwd)
  const staging = cmds.some((c) => c.sub === 'add' || c.sub === 'stage')
  for (const c of cmds) {
    const hooksPath = /core\.hookspath/i
    if (c.globals.some((g) => hooksPath.test(g))) return MOVE
    // Turning the Seatbelt check on (git config core.hooksPath .githooks) is allowed.
    if (c.sub === 'config' && c.args.some((a) => hooksPath.test(a))) {
      const values = c.args.filter((a) => !a.startsWith('-') && !hooksPath.test(a))
      if (!(values.length === 1 && values[0].replace(/\/$/, '') === '.githooks' && !c.args.some((a) => /^--(unset|remove|rename)/.test(a)))) return MOVE
    }
    if (c.sub !== 'commit' && c.sub !== 'push') continue
    const opts = c.args.slice(0, c.args.includes('--') ? c.args.indexOf('--') : undefined)
    if (opts.some((a) => a.length > 5 && '--no-verify'.startsWith(a))) return SKIP
    if (c.sub === 'commit' && opts.some((a) => /^-[A-Za-z]*n/.test(a) && !a.startsWith('--'))) return SKIP
    let problems
    try {
      problems = c.sub === 'commit' ? commitProblems(c.dir, staging) : pushProblems(c.dir)
    } catch {
      continue // Not a git folder, or git is missing: git itself will refuse the command.
    }
    if (problems.length) {
      const what = c.sub === 'commit' ? 'this save point (commit)' : 'this push'
      return `Seatbelt stopped ${what}. ${problems.join(' ')} Nothing was saved or sent.`
    }
  }
  return null
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  let raw = ''
  for await (const chunk of process.stdin) raw += chunk
  let input
  try { input = JSON.parse(raw) } catch { process.exit(0) }
  const command = input?.tool_input?.command
  if (typeof command !== 'string') process.exit(0)
  const reason = review(command, input.cwd || process.cwd())
  if (reason) {
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny', permissionDecisionReason: reason },
    }))
  }
}
