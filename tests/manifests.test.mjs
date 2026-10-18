import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

const read = (f) => JSON.parse(fs.readFileSync(f, 'utf8'))
const { version } = read('package.json')

const PLUGINS = [
  '.claude-plugin/plugin.json',
  '.codex-plugin/plugin.json',
  '.cursor-plugin/plugin.json',
  '.devin-plugin/plugin.json',
  '.kimi-plugin/plugin.json',
  'gemini-extension.json',
]

for (const file of PLUGINS) {
  test(`${file} is named seatbelt and carries the package version`, () => {
    const m = read(file)
    assert.equal(m.name, 'seatbelt')
    assert.equal(m.version, version)
    assert.ok(m.description && m.description.length <= 300, 'short description')
    if (m.skills) assert.equal(m.skills, './skills/')
  })
}

test('marketplaces list seatbelt at the package version', () => {
  const claude = read('.claude-plugin/marketplace.json')
  assert.equal(claude.plugins[0].name, 'seatbelt')
  assert.equal(claude.plugins[0].version, version)
  const agents = read('.agents/plugins/marketplace.json')
  assert.equal(agents.plugins[0].name, 'seatbelt')
})

test('the optional guard plugin is listed second and carries the package version', () => {
  const entry = read('.claude-plugin/marketplace.json').plugins[1]
  assert.equal(entry.name, 'seatbelt-guard')
  assert.equal(entry.version, version)
  const m = read(`${entry.source}/.claude-plugin/plugin.json`)
  assert.equal(m.name, 'seatbelt-guard')
  assert.equal(m.version, version)
})

test('Kimi starts every session with the coach skill', () => {
  const kimi = read('.kimi-plugin/plugin.json')
  assert.equal(kimi.sessionStart.skill, 'seatbelt')
  assert.ok(fs.existsSync('skills/seatbelt/SKILL.md'))
})

test('Gemini loads a context file that imports the coach', () => {
  const gemini = read('gemini-extension.json')
  const context = fs.readFileSync(gemini.contextFileName, 'utf8')
  assert.match(context, /@\.\/skills\/seatbelt\/SKILL\.md/)
})

test('Codex shows a display name, brand color and starter prompts', () => {
  const { interface: ui } = read('.codex-plugin/plugin.json')
  assert.equal(ui.displayName, 'Seatbelt')
  assert.match(ui.brandColor, /^#[0-9A-F]{6}$/i)
  assert.ok(ui.defaultPrompt.length >= 2)
})
