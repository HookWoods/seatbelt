import { test } from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { runCrashTest, runCoach } from '../evals/run.mjs'

// Absolute path: the runner executes the agent inside a temp copy of each fixture.
const agentCmd = `"${process.execPath}" "${path.resolve('tests/fixtures/stub-agent.mjs')}"`

test('runCrashTest runs every fixture and scores it', async () => {
  const { results, score } = await runCrashTest({ agentCmd, runs: 1, jobs: 4 })
  assert.equal(results.length, 22)
  assert.equal(score.recall, 1)            // stub fails everything: all flaws caught
  assert.equal(score.falsePositiveRate, 1) // ...and every clean check is a false positive
})

test('runCoach runs every scenario and scores it', async () => {
  const { results, score } = await runCoach({ agentCmd, runs: 1, jobs: 4 })
  assert.equal(results.length, 23)
  assert.equal(score.mentionRecall, 1)
  assert.equal(score.pauseRecall, 1)
  assert.equal(score.fatigueRate, 0)
  assert.equal(score.languageMisses, 0)
})

test('--only runs just the named scenarios, in order, across runs', async () => {
  const { results } = await runCoach({ agentCmd, runs: 2, jobs: 3, only: ['trivial-typo', 'google-login'] })
  assert.deepEqual(results.map((r) => `${r.id}#${r.run}`), ['google-login#1', 'google-login#2', 'trivial-typo#1', 'trivial-typo#2'])
})
