// Checks the lines a branch adds under skills/. The skills are instructions that AI agents obey,
// so hidden instructions are always refused, and new outbound reach (a new domain, a shell
// command, a tool permission) needs a maintainer's approval.
// Usage: node scripts/skill-guard.mjs [base-ref]   (default origin/main; SKILL_GUARD_APPROVED=1 to approve)
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const INJECTION = [
  [/<!--/, 'hidden HTML comment'],
  [/[​-‏‪-‮⁠-⁤⁦-⁩﻿]/, 'invisible or direction-changing character'],
  [/[A-Za-z0-9+/=_-]{120,}/, 'long encoded blob'],
  [/\b(ignore|disregard|forget|override)\b[^.\n]{0,30}\b(previous|prior|above|earlier|all)\b[^.\n]{0,20}\b(instructions|rules|messages)\b/i,
    'instruction to drop earlier instructions'],
  [/\b(without (telling|informing|asking)|do not (tell|inform)) the user\b/i, 'instruction to hide something from the user'],
  [/\bsecretly\b|\bsilently (send|upload|post|delete|remove)\b/i, 'instruction to act in secret'],
]

const SHELL = /\b(curl|wget|npx|pip3? install|npm (install|i)|rm -rf|chmod|bash -c|sh -c|Invoke-WebRequest|iwr|powershell)\b/i
const TOOL_KEY = /^\s*(allowed-tools|permissions|tools|hooks|mcp|model)\s*:/i
const URL = /https?:\/\/([^/\s)>"'`]+)/gi

export function parseDiff(diff) {
  const added = {}
  let file = null
  let line = 0
  for (const raw of diff.split(/\r?\n/)) {
    if (raw.startsWith('+++ ')) {
      file = raw.startsWith('+++ b/') ? raw.slice(6) : null
      if (file) added[file] ??= []
    } else if (raw.startsWith('@@')) {
      line = Number(raw.match(/\+(\d+)/)[1])
    } else if (file && raw.startsWith('+')) {
      added[file].push({ line: line++, text: raw.slice(1) })
    }
  }
  return added
}

export function injectionReasons(text) {
  return INJECTION.filter(([pattern]) => pattern.test(text)).map(([, reason]) => reason)
}

export function capabilityReasons(text, baseText) {
  const reasons = []
  for (const [, host] of text.matchAll(URL)) {
    if (!baseText.includes(host.toLowerCase())) reasons.push(`new domain ${host}`)
  }
  if (SHELL.test(text)) reasons.push('shell command')
  if (TOOL_KEY.test(text)) reasons.push('tool permission key')
  return reasons
}

export function guard({ added, baseText, approved }) {
  const errors = []
  const approvals = []
  const base = baseText.toLowerCase()
  for (const [file, lines] of Object.entries(added)) {
    for (const { line, text } of lines) {
      for (const reason of injectionReasons(text)) errors.push(`${file}:${line}: ${reason}`)
      for (const reason of capabilityReasons(text, base)) (approved ? approvals : errors).push(`${file}:${line}: ${reason}`)
    }
  }
  return { errors, approvals }
}

function git(...args) {
  return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  const base = process.argv[2] ?? 'origin/main'
  const files = git('ls-tree', '-r', '--name-only', base, '--', 'skills').split('\n').filter(Boolean)
  const baseText = files.map((f) => git('show', `${base}:${f}`)).join('\n')
  const added = parseDiff(git('diff', '-U0', '--no-color', `${base}...HEAD`, '--', 'skills'))
  const { errors, approvals } = guard({ added, baseText, approved: process.env.SKILL_GUARD_APPROVED === '1' })
  for (const a of approvals) console.log(`approved: ${a}`)
  for (const e of errors) console.log(e)
  if (errors.length) {
    console.log('\nNew outbound reach needs the "capability-approved" label; hidden instructions are never accepted.')
    process.exit(1)
  }
  console.log('Skill guard: clean.')
}
