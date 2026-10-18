import { test } from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { runCrashTest, runCoach } from '../evals/run.mjs'

// Absolute path: the runner executes the agent inside a temp copy of each fixture.
const agentCmd = `"${process.execPath}" "${path.resolve('tests/fixtures/stub-agent.mjs')}"`

test('runCrashTest runs every fixture and scores it', () => {
  const { results, score } = runCrashTest({ agentCmd, runs: 1 })
  assert.equal(results.length, 6)
  assert.equal(score.recall, 1)            // stub fails everything: all flaws caught
  assert.equal(score.falsePositiveRate, 1) // ...and every clean check is a false positive
})

test('runCoach runs every scenario and scores it', () => {
  const { results, score } = runCoach({ agentCmd, runs: 1 })
  assert.equal(results.length, 10)
  assert.equal(score.pauseRecall, 1)
  assert.equal(score.fatigueRate, 0)
  assert.equal(score.languageMisses, 0)
})
