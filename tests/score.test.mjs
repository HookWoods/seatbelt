import { test } from 'node:test'
import assert from 'node:assert/strict'
import { detectPauses, jargonViolations, gradeClass, parseCertificate, scoreCrashTest, scoreCoach } from '../evals/lib/score.mjs'

const CERT = `# crash-test certificate
⛔ Do not launch
| # | Check | Grade | Evidence |
|---|---|---|---|
| 1 | Secrets | F | src/lib/supabase.js:4 |
| 2 | Data door | ? | paste needed |
`

test('detectPauses counts pause title lines', () => {
  assert.equal(detectPauses('⏸️ Pause — Key visible\nx\n⏸️ Pause — Login'), 2)
  assert.equal(detectPauses('No pause here. Pause is a word.'), 0)
})

test('jargon inside parentheses or code is allowed', () => {
  assert.deepEqual(jargonViolations('A rule at the data door (RLS) protects rows.'), [])
  assert.deepEqual(jargonViolations('```sql\nalter table x enable row level security;\n```'), [])
  assert.deepEqual(jargonViolations('Enable RLS and add a webhook.'), ['rls', 'webhook'])
})

test('gradeClass maps letters', () => {
  assert.equal(gradeClass('A'), 'pass')
  assert.equal(gradeClass('B'), 'pass')
  assert.equal(gradeClass('C'), 'fail')
  assert.equal(gradeClass('F'), 'fail')
  assert.equal(gradeClass('?'), 'unknown')
  assert.equal(gradeClass(undefined), 'missing')
})

test('parseCertificate reads rows and launch verdict', () => {
  const c = parseCertificate(CERT)
  assert.deepEqual(c.checks, { 1: 'F', 2: '?' })
  assert.equal(c.doNotLaunch, true)
})

test('parseCertificate on empty output returns no checks', () => {
  assert.deepEqual(parseCertificate('I could not run.').checks, {})
})

test('scoreCrashTest: unknown never counts as pass, missing counts as miss', () => {
  const s = scoreCrashTest([
    { expected: { 1: 'fail', 2: 'fail' }, certificate: CERT },          // 1 caught, 2 unknown (miss)
    { expected: { 1: 'pass', 2: 'unknown' }, certificate: CERT },       // 1 false positive, 2 exact
    { expected: { 1: 'pass', 2: 'pass' }, certificate: 'no table' },    // both missing
  ])
  assert.equal(s.total, 6)
  assert.equal(s.recall, 1 / 2)
  assert.equal(s.falsePositiveRate, 1 / 3)
  assert.equal(s.exactRate, 2 / 6)
  assert.equal(s.unknownRate, 2 / 6)
})

test('scoreCoach: recall, fatigue, multi-pause, language', () => {
  const s = scoreCoach([
    { expectPause: true, output: '⏸️ Pause — Login change\n1️⃣ a\n2️⃣ b' },
    { expectPause: true, output: 'Done.' },
    { expectPause: false, output: '⏸️ Pause — Title\n' },
    { expectPause: false, output: 'Title is bigger now.' },
    { expectPause: true, output: '⏸️ Pause — A\n⏸️ Pause — B' },
    { expectPause: true, output: '⏸️ Pause — Payment\nWhat is happening: card payment.', language: 'fr' },
  ])
  assert.equal(s.pauseRecall, 3 / 4)
  assert.equal(s.fatigueRate, 1 / 2)
  assert.equal(s.multiPause, 1)
  assert.equal(s.languageMisses, 1)
})

test('scoreCoach counts required mentions, case-insensitive, and stays null without any', () => {
  const s = scoreCoach([
    { expectPause: false, expectMention: 'push protection|pre-commit', output: 'I turned on Push Protection.' },
    { expectPause: false, expectMention: 'push protection|pre-commit', output: 'Pushed.' },
  ])
  assert.equal(s.mentionRecall, 0.5)
  assert.equal(scoreCoach([{ expectPause: false, output: 'ok' }]).mentionRecall, null)
})

test('looksFrench accepts French answers without a pause card and rejects English ones', async () => {
  const { looksFrench } = await import('../evals/lib/score.mjs')
  assert.equal(looksFrench("C'est fait : la protection est active pour les pushes."), true)
  assert.equal(looksFrench('Done. Push protection is on for the repo.'), false)
})
