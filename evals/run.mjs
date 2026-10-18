import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { scoreCrashTest, scoreCoach } from './lib/score.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const FIXTURES = path.join(ROOT, 'evals', 'fixtures', 'crash-test')
const DEFAULT_CMD = 'claude -p --allowedTools Read,Grep,Glob,Skill'
const BOOTSTRAP = 'This project uses Seatbelt.\nUse the seatbelt skill for every request in this project.\nRead PROJECT.md first if it exists.\n'
const CRASH_PROMPT = 'Run crash-test on this project. I cannot paste anything from dashboards right now.'

export function workspace(base, skill, bootstrap) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'seatbelt-eval-'))
  // No base: an empty folder, for requests that start a new app.
  if (base) fs.cpSync(path.join(FIXTURES, base), dir, { recursive: true })
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
  return new Promise((resolve) => {
    const child = spawn(agentCmd, { cwd, shell: true, timeout: 10 * 60 * 1000 })
    let out = '', err = ''
    child.stdout.on('data', (d) => { out += d })
    child.stderr.on('data', (d) => { err += d })
    child.on('close', (code) => resolve(out + (code === 0 ? '' : `\n[agent exited ${code}] ${err}`)))
    child.stdin.end(prompt)
  })
}

// Runs fn on every item, at most `jobs` at a time, and keeps the input order.
async function pool(items, jobs, fn) {
  const out = new Array(items.length)
  let next = 0
  const worker = async () => { while (next < items.length) { const i = next++; out[i] = await fn(items[i]) } }
  await Promise.all(Array.from({ length: Math.min(jobs, items.length) }, worker))
  return out
}

const repeat = (list, runs) => list.flatMap((item) => Array.from({ length: runs }, (_, i) => ({ item, run: i + 1 })))

export async function runCrashTest({ agentCmd = process.env.SEATBELT_AGENT_CMD ?? DEFAULT_CMD, runs = 1, jobs = 1, only } = {}) {
  const apps = fs.readdirSync(FIXTURES).filter((app) => !only || only.includes(app))
  const results = await pool(repeat(apps, runs), jobs, async ({ item: app, run }) => {
    const { expected } = JSON.parse(fs.readFileSync(path.join(FIXTURES, app, 'manifest.json'), 'utf8'))
    const dir = workspace(app, 'crash-test', false)
    const certificate = await ask(agentCmd, dir, CRASH_PROMPT)
    fs.rmSync(dir, { recursive: true, force: true })
    return { app, run, expected, certificate }
  })
  return { results, score: scoreCrashTest(results) }
}

export async function runCoach({ agentCmd = process.env.SEATBELT_AGENT_CMD ?? DEFAULT_CMD, runs = 1, jobs = 1, only } = {}) {
  const scenarios = JSON.parse(fs.readFileSync(path.join(ROOT, 'evals', 'scenarios', 'coach.json'), 'utf8'))
    .filter((s) => !only || only.includes(s.id))
  const results = await pool(repeat(scenarios, runs), jobs, async ({ item: s, run }) => {
    const dir = workspace(s.base, 'seatbelt', true)
    const output = await ask(agentCmd, dir, s.prompt)
    fs.rmSync(dir, { recursive: true, force: true })
    return { id: s.id, run, expectPause: s.expectPause, expectMention: s.expectMention, language: s.language, output }
  })
  return { results, score: scoreCoach(results) }
}

function intFlag(argv, flag, fallback) {
  const i = argv.indexOf(flag)
  if (i < 0) return fallback
  const n = Number(argv[i + 1])
  if (!Number.isInteger(n) || n < 1) throw new Error(`${flag} must be a positive integer`)
  return n
}

export const parseRuns = (argv) => intFlag(argv, '--runs', 1)
export const parseJobs = (argv) => intFlag(argv, '--jobs', 4)

export function parseOnly(argv) {
  const i = argv.indexOf('--only')
  if (i < 0) return undefined
  if (!argv[i + 1]) throw new Error('--only needs a comma-separated list of ids')
  return argv[i + 1].split(',')
}

// A run with --only is saved apart, so it never replaces a full run.
export function resultFile(suite, date, baseline, partial) {
  return path.join(ROOT, 'evals', 'results', `${date}-${suite}${baseline ? '-baseline' : ''}${partial ? '-partial' : ''}.json`)
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  const suite = process.argv[2]
  const runs = parseRuns(process.argv)
  const fn = { 'crash-test': runCrashTest, coach: runCoach }[suite]
  if (!fn) { console.error('usage: node evals/run.mjs crash-test|coach [--runs N] [--jobs N] [--only id,id]'); process.exit(1) }
  const only = parseOnly(process.argv)
  const out = await fn({ runs, jobs: parseJobs(process.argv), only })
  const file = resultFile(suite, new Date().toISOString().slice(0, 10), process.env.SEATBELT_NO_SKILLS === '1', Boolean(only))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(out, null, 2))
  console.log(JSON.stringify(out.score, null, 2))
  console.log(`Saved ${file}`)
}
