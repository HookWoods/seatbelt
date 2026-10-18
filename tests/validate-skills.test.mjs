import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { validateSkill } from '../scripts/validate-skills.mjs'

const fx = (name) => path.join('tests', 'fixtures', 'skills', name)

test('valid skill has no errors', () => {
  assert.deepEqual(validateSkill(fx('good-skill')), [])
})

test('reports name, description and missing reference', () => {
  const errors = validateSkill(fx('bad-skill')).join('\n')
  assert.match(errors, /name/)
  assert.match(errors, /description/)
  assert.match(errors, /references\/missing\.md/)
})

test('enforces maxLines', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sb-'))
  const body = Array.from({ length: 10 }, (_, i) => `line ${i}`).join('\n')
  fs.writeFileSync(path.join(dir, 'SKILL.md'), `---\nname: ${path.basename(dir).toLowerCase()}\ndescription: x\n---\n${body}`)
  assert.match(validateSkill(dir, { maxLines: 5 }).join('\n'), /lines/)
})

test('rejects description over 1024 chars', () => {
  const dir = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sb-')), 'long-desc')
  fs.mkdirSync(dir)
  fs.writeFileSync(path.join(dir, 'SKILL.md'), `---\nname: long-desc\ndescription: ${'x'.repeat(1025)}\n---\nbody`)
  assert.match(validateSkill(dir).join('\n'), /1024/)
})

test('rejects a file over 256 KB', () => {
  const dir = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sb-')), 'big-file')
  fs.mkdirSync(dir)
  fs.writeFileSync(path.join(dir, 'SKILL.md'), '---\nname: big-file\ndescription: x\n---\nbody')
  fs.writeFileSync(path.join(dir, 'huge.md'), 'x'.repeat(256 * 1024 + 1))
  assert.match(validateSkill(dir).join('\n'), /256 KB/)
})
