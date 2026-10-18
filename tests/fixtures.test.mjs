import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const root = 'evals/fixtures/crash-test'
const apps = fs.existsSync(root) ? fs.readdirSync(root) : []

test('22 fixture apps exist, and every check from 3 to 7 has a flawed app and a clean twin', () => {
  assert.equal(apps.length, 22)
  for (const area of ['server', 'payments', 'backups', 'tests', 'privacy']) {
    assert.ok(apps.includes(area + '-flawed') && apps.includes(area + '-clean'), area)
  }
})

for (const app of apps) {
  test(`${app}: manifest evidence points at real lines`, () => {
    const m = JSON.parse(fs.readFileSync(path.join(root, app, 'manifest.json'), 'utf8'))
    assert.equal(m.app, app)
    for (const v of Object.values(m.expected)) assert.ok(['pass', 'fail', 'unknown'].includes(v))
    for (const e of m.evidence) {
      const lines = fs.readFileSync(path.join(root, app, e.file), 'utf8').split(/\r?\n/)
      assert.ok(lines[e.line - 1]?.includes(e.contains), `${app} ${e.file}:${e.line} should contain "${e.contains}"`)
    }
  })
}

test('fixture secrets stay below real provider formats', () => {
  for (const app of apps) {
    for (const f of fs.readdirSync(path.join(root, app), { recursive: true })) {
      const p = path.join(root, app, f)
      if (!fs.statSync(p).isFile()) continue
      for (const m of fs.readFileSync(p, 'utf8').matchAll(/sk_(?:live|test)_([A-Za-z0-9]+)/g)) {
        assert.ok(m[1].length < 24 && m[1].includes('EXAMPLE'), `${p}: fake key must be short and contain EXAMPLE`)
      }
    }
  }
})
