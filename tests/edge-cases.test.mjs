// Edge cases real users hit: dashboard-only tables, hardcoded public keys, ignored .env files, French users, malformed eval input.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { detectPauses, parseCertificate, scoreCoach, scoreCrashTest } from '../evals/lib/score.mjs'
import { workspace, parseRuns, resultFile } from '../evals/run.mjs'

const read = (f) => fs.readFileSync(f, 'utf8')
const FX = 'evals/fixtures/crash-test'

test('data door asks for ONE query that also lists tables without policies', () => {
  const sql = read('skills/crash-test/checks/02-data-door.md').split('```sql')[1].split('```')[0]
  assert.equal((sql.match(/\bselect\b/gi) || []).length, 1)
  assert.match(sql, /left join pg_policies/i)
  assert.match(sql, /relrowsecurity/i)
})

test('data door compares every table the app uses with the migrations', () => {
  assert.match(read('skills/crash-test/checks/02-data-door.md'), /\.from\('<table>'\)/)
  assert.match(read('skills/crash-test/rubric.md'), /table the app uses has no migration/i)
})

test('secrets sheet knows new Supabase keys and decodes JWT roles', () => {
  const s = read('skills/crash-test/checks/01-secrets.md')
  assert.match(s, /sb_secret_/)
  assert.match(s, /sb_publishable_/)
  assert.match(s, /decode the middle part/i)
})

test('flawed-1 admin key is only detectable by decoding, clean-1 hardcodes public keys', () => {
  assert.ok(!read(`${FX}/notes-flawed-1/src/lib/supabase.js`).includes('service_role'))
  const clean = read(`${FX}/notes-clean-1/src/lib/supabase.js`) + read(`${FX}/notes-clean-1/src/lib/stripe.js`)
  assert.match(clean, /pk_test_EXAMPLE/)
  assert.match(clean, /eyJ/)
})

test('unknown secret values are treated as live and every committed file is searched', () => {
  assert.match(read('skills/crash-test/rubric.md'), /cannot see the value, treat it as live/i)
  assert.match(read('skills/crash-test/checks/01-secrets.md'), /every committed file/i)
})

test('runtime files are written into the eval workspace (gitignored .env case)', () => {
  const dir = workspace('notes-clean-3', 'crash-test', false)
  assert.match(read(path.join(dir, '.env')), /sk_live_EXAMPLE/)
  assert.ok(!fs.existsSync(path.join(dir, 'manifest.json')))
  fs.rmSync(dir, { recursive: true, force: true })
})

test('coach treats a visible secret as never small', () => {
  assert.match(read('skills/seatbelt/SKILL.md'), /A visible secret is never a small change/)
})

test('crash-test lists accepted risks on the certificate', () => {
  assert.match(read('skills/crash-test/SKILL.md'), /Accepted risks/)
})

test('badge counts out of 7 and "?" is orange', () => {
  const b = read('skills/crash-test/templates/badge.md')
  assert.match(b, /%2F7/)
  assert.ok(!b.includes('<covered>'))
  assert.match(b, /"\?".*orange/)
})

test('fixed strings are translated, and the scorer reads a French verdict', () => {
  assert.match(read('skills/seatbelt/templates/pause-card.md'), /translated/)
  assert.match(read('skills/crash-test/SKILL.md'), /translated/)
  assert.equal(parseCertificate('⛔ Ne pas mettre en ligne').doNotLaunch, true)
})

test('detectPauses accepts bare symbol, bold and blockquote titles', () => {
  assert.equal(detectPauses('⏸ Pause — A'), 1)
  assert.equal(detectPauses('**⏸️ Pause — A**'), 1)
  assert.equal(detectPauses('> ⏸️ Pause — A'), 1)
  assert.equal(detectPauses('No Pause here'), 0)
})

test('--runs must be a positive integer', () => {
  assert.equal(parseRuns(['node', 'run.mjs', 'coach']), 1)
  assert.equal(parseRuns(['node', 'run.mjs', 'coach', '--runs', '3']), 3)
  assert.throws(() => parseRuns(['node', 'run.mjs', 'coach', '--runs']))
  assert.throws(() => parseRuns(['node', 'run.mjs', 'coach', '--runs', 'x']))
})

test('empty runs do not score as perfect', () => {
  assert.equal(scoreCoach([]).pauseRecall, null)
  assert.equal(scoreCrashTest([]).recall, null)
})

test('baseline results get their own file name', () => {
  assert.notEqual(resultFile('coach', '2026-10-18', true), resultFile('coach', '2026-10-18', false))
  assert.match(resultFile('coach', '2026-10-18', true), /baseline/)
})

test('engines match the glob test runner (Node 22+)', () => {
  assert.equal(JSON.parse(read('package.json')).engines.node, '>=22')
})

test('rotation advice never invents click-paths and warns about Supabase legacy keys', () => {
  const s = read('skills/seatbelt/references/security.md')
  assert.match(s, /do not guess/i)
  assert.match(s, /legacy.*anon key/i)
})

test('runner flags: jobs default to 4, --only splits ids, partial runs never overwrite full ones', async () => {
  const { parseJobs, parseOnly } = await import('../evals/run.mjs')
  assert.equal(parseJobs(['node', 'run.mjs', 'coach']), 4)
  assert.throws(() => parseJobs(['node', 'run.mjs', 'coach', '--jobs', '0']))
  assert.deepEqual(parseOnly(['node', 'run.mjs', 'coach', '--only', 'a,b']), ['a', 'b'])
  assert.equal(parseOnly(['node', 'run.mjs', 'coach']), undefined)
  assert.throws(() => parseOnly(['node', 'run.mjs', 'coach', '--only']))
  assert.notEqual(resultFile('coach', '2026-10-18', false, true), resultFile('coach', '2026-10-18', false, false))
})

test('detectPauses finds cards in any language and needs the symbol', () => {
  assert.equal(detectPauses('⏸️ Pausa: Clave visible'), 1)
  assert.equal(detectPauses('⏸️ Pause : clé visible'), 1)
  assert.equal(detectPauses('**Pause: key in code**'), 0)
})
