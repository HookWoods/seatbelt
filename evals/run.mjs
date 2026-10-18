import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { scoreCrashTest, scoreCoach } from './lib/score.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const FIXTURES = path.join(ROOT, 'evals', 'fixtures', 'crash-test')
const DEFAULT_CMD = 'claude -p --allowedTools Read,Grep,Glob,Skill'
const BOOTSTRAP = 'This project uses Seatbelt.\nUse the seatbelt skill for every request in this project.\nRead PROJECT.md first if it exists.\n'
const CRASH_PROMPT = 'Run crash-test on this project. I cannot paste anything from dashboards right now.'

export function workspace(base, skill, bootstrap) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'seatbelt-eval-'))
  fs.cpSync(path.join(FIXTURES, base), dir, { recursive: true })
  const manifestPath = path.join(dir, 'manifest.json')
  const { runtimeFiles = {} } = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {}
  fs.rmSync(manifestPath, { force: true })
  // Files a fixture's own .gitignore keeps out of this repo (e.g. an ignored .env) are written at run time.
  for (const [file, content] of Object.entries(runtimeFiles)) fs.writeFileSync(path.join(dir, file), content)
  if (process.env.SEATBELT_NO_SKILLS === '1') return dir
  for (const target of ['.claude/skills', '.agents/skills']) {
    fs.cpSync(path.join(ROOT, 'skills', skill), path.join(dir, target, skill), { recursive: true })
  }
  if (bootstrap) {
    fs.writeFileSync(path.join(dir, 'CLAUDE.md'), BOOTSTRAP)
    fs.writeFileSync(path.join(dir, 'AGENTS.md'), BOOTSTRAP)
  }
  return dir
}

function ask(agentCmd, cwd, prompt) {
  const r = spawnSync(agentCmd, { cwd, input: prompt, shell: true, encoding: 'utf8', timeout: 10 * 60 * 1000 })
  return (r.stdout ?? '') + (r.status === 0 ? '' : `\n[agent exited ${r.status}] ${r.stderr ?? ''}`)
}

export function runCrashTest({ agentCmd = process.env.SEATBELT_AGENT_CMD ?? DEFAULT_CMD, runs = 1 } = {}) {
  const results = []
  for (const app of fs.readdirSync(FIXTURES)) {
    const { expected } = JSON.parse(fs.readFileSync(path.join(FIXTURES, app, 'manifest.json'), 'utf8'))
    for (let run = 1; run <= runs; run++) {
      const dir = workspace(app, 'crash-test', false)
      results.push({ app, run, expected, certificate: ask(agentCmd, dir, CRASH_PROMPT) })
      fs.rmSync(dir, { recursive: true, force: true })
    }
  }
  return { results, score: scoreCrashTest(results) }
}

export function runCoach({ agentCmd = process.env.SEATBELT_AGENT_CMD ?? DEFAULT_CMD, runs = 1 } = {}) {
  const scenarios = JSON.parse(fs.readFileSync(path.join(ROOT, 'evals', 'scenarios', 'coach.json'), 'utf8'))
  const results = []
  for (const s of scenarios) {
    for (let run = 1; run <= runs; run++) {
      const dir = workspace(s.base, 'seatbelt', true)
      results.push({ id: s.id, run, expectPause: s.expectPause, language: s.language, output: ask(agentCmd, dir, s.prompt) })
      fs.rmSync(dir, { recursive: true, force: true })
    }
  }
  return { results, score: scoreCoach(results) }
}

export function parseRuns(argv) {
  const i = argv.indexOf('--runs')
  if (i < 0) return 1
  const runs = Number(argv[i + 1])
  if (!Number.isInteger(runs) || runs < 1) throw new Error('--runs must be a positive integer')
  return runs
}

export function resultFile(suite, date, baseline) {
  return path.join(ROOT, 'evals', 'results', `${date}-${suite}${baseline ? '-baseline' : ''}.json`)
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  const suite = process.argv[2]
  const runs = parseRuns(process.argv)
  const fn = { 'crash-test': runCrashTest, coach: runCoach }[suite]
  if (!fn) { console.error('usage: node evals/run.mjs crash-test|coach [--runs N]'); process.exit(1) }
  const out = fn({ runs })
  const file = resultFile(suite, new Date().toISOString().slice(0, 10), process.env.SEATBELT_NO_SKILLS === '1')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(out, null, 2))
  console.log(JSON.stringify(out.score, null, 2))
  console.log(`Saved ${file}`)
}
