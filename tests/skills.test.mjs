import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { validateSkill } from '../scripts/validate-skills.mjs'
import { parseCertificate } from '../evals/lib/score.mjs'

test('seatbelt skill is valid and under 200 lines', () => {
  assert.deepEqual(validateSkill('skills/seatbelt', { maxLines: 200 }), [])
})

test('PROJECT.md template has every notebook section', () => {
  const t = fs.readFileSync('skills/seatbelt/templates/PROJECT.md', 'utf8')
  for (const h of ['In one sentence', 'What the app does', 'Later', 'Where things are', 'Decisions',
    'Services', 'Secrets', 'Accepted risks', 'crash-test', 'Remember']) {
    assert.match(t, new RegExp(`^## ${h}$`, 'm'), `missing section: ${h}`)
  }
})

test('pause card has a title line and exactly two options', () => {
  const t = fs.readFileSync('skills/seatbelt/templates/pause-card.md', 'utf8')
  const example = t.split('```')[1]
  assert.match(example, /^⏸️ Pause: /m)
  assert.equal((example.match(/^[12]️⃣/gm) || []).length, 2)
})

test('reference sheets are filled in and cover their moments', () => {
  const read = (f) => fs.readFileSync(`skills/seatbelt/references/${f}`, 'utf8')
  assert.match(read('build.md'), /save point/i)
  assert.match(read('build.md'), /second failed fix/i)
  assert.match(read('security.md'), /rotate/i)
  assert.match(read('tests.md'), /flip test/i)
  for (const f of ['build.md', 'security.md', 'tests.md']) {
    assert.ok(read(f).split('\n').length > 10, `${f} is still a stub`)
  }
})

test('crash-test skill is valid', () => {
  assert.deepEqual(validateSkill('skills/crash-test'), [])
})

test('certificate example parses with the eval scorer', () => {
  const t = fs.readFileSync('skills/crash-test/templates/certificate.md', 'utf8')
  const example = t.split('```')[1]
  const c = parseCertificate(example)
  assert.deepEqual(Object.keys(c.checks), ['1', '2'])
  assert.equal(c.doNotLaunch, true)
})

test('crash-test never promises security and badge says self-checked', () => {
  const all = ['SKILL.md', 'rubric.md', 'templates/certificate.md', 'templates/badge.md']
    .map((f) => fs.readFileSync(`skills/crash-test/${f}`, 'utf8')).join('\n')
  assert.match(fs.readFileSync('skills/crash-test/templates/badge.md', 'utf8'), /self--checked/)
  assert.match(all, /never (use|write) the word "secure"/i)
  assert.match(all, /"\?" (is|never) .*pass/i)
})

test('plugin manifests are valid JSON and bootstrap matches the runner', async () => {
  const plugin = JSON.parse(fs.readFileSync('.claude-plugin/plugin.json', 'utf8'))
  const market = JSON.parse(fs.readFileSync('.claude-plugin/marketplace.json', 'utf8'))
  assert.equal(plugin.name, 'seatbelt')
  assert.equal(market.plugins[0].name, 'seatbelt')
  const runner = fs.readFileSync('evals/run.mjs', 'utf8')
  const snippet = fs.readFileSync('bootstrap/KNOWLEDGE.md', 'utf8').replace(/\r\n/g, '\n')
  assert.ok(runner.includes(JSON.stringify(snippet).slice(1, -1)), 'bootstrap/KNOWLEDGE.md must equal BOOTSTRAP in evals/run.mjs')
})

test('structure sheet covers code shape in any language', () => {
  const s = fs.readFileSync('skills/seatbelt/references/structure.md', 'utf8')
  for (const pattern of [/boilerplate/i, /duplicate/i, /40 lines/, /400 lines/, /formatter/i, /linter/i,
    /type checker/i, /dead code/i, /dependenc/i, /one implementation/i]) {
    assert.match(s, pattern)
  }
})

test('coach routes moment 6 and checks its own diff before saying done', () => {
  const s = fs.readFileSync('skills/seatbelt/SKILL.md', 'utf8')
  assert.match(s, /\| 6 \|/)
  assert.match(s, /references\/structure\.md/)
  assert.match(s, /re-read your own diff/i)
})

test('tests sheet stops test bloat', () => {
  const s = fs.readFileSync('skills/seatbelt/references/tests.md', 'utf8')
  assert.match(s, /one test per behavior/i)
  assert.match(s, /not one test per function/i)
})

test('structure sheet covers robustness rules that AI code usually misses', () => {
  const s = fs.readFileSync('skills/seatbelt/references/structure.md', 'utf8')
  for (const pattern of [/fake default/i, /inside a loop/i, /pagination/i, /schema/i, /timeout/i, /lockfile/i,
    /loading, empty and error/i, /alt text/i, /cents/i, /UTC/, /migration/i, /one logger/i, /@ts-ignore/,
    /upload size/i, /one response shape/i]) {
    assert.match(s, pattern)
  }
})

test('notebook keeps a file map the agent reads before searching', () => {
  const t = fs.readFileSync('skills/seatbelt/templates/PROJECT.md', 'utf8')
  assert.match(t, /\| File or folder \| What it does \|/)
  assert.match(fs.readFileSync('skills/seatbelt/SKILL.md', 'utf8'), /read "Where things are" before searching/i)
})

test('flip test only runs on critical paths', () => {
  assert.match(fs.readFileSync('skills/seatbelt/references/tests.md', 'utf8'), /only for tests on login, payment and data/i)
})

test('the repo stays dependency-free', () => {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  assert.deepEqual(Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }), [])
})

test('CI runs tests and the validator with pinned actions and read-only rights', () => {
  const ci = fs.readFileSync('.github/workflows/ci.yml', 'utf8')
  assert.match(ci, /npm test/)
  assert.match(ci, /npm run validate/)
  assert.match(ci, /contents: read/)
  for (const uses of ci.match(/uses: .+/g)) assert.match(uses, /@[0-9a-f]{40}/, `${uses} must be pinned to a commit SHA`)
})
