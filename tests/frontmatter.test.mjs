import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseFrontmatter } from '../scripts/lib/frontmatter.mjs'

test('parses name and description', () => {
  const r = parseFrontmatter('---\nname: demo\ndescription: Use when testing: colons stay.\n---\n# Body\n')
  assert.equal(r.data.name, 'demo')
  assert.equal(r.data.description, 'Use when testing: colons stay.')
  assert.equal(r.body, '# Body\n')
})

test('returns null without frontmatter', () => {
  assert.equal(parseFrontmatter('# No frontmatter'), null)
})

test('handles CRLF line endings', () => {
  const r = parseFrontmatter('---\r\nname: demo\r\ndescription: x\r\n---\r\nbody')
  assert.equal(r.data.name, 'demo')
})
