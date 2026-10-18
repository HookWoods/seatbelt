import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseFrontmatter } from './lib/frontmatter.mjs'

const MAX_FILE = 256 * 1024
const MAX_DIR = 2 * 1024 * 1024
const MAX_SKILL_CHARS = 100_000
const REF = /\b((?:references|templates|checks|stacks)\/[\w.-]+\.md|rubric\.md)\b/g

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name)
    return e.isDirectory() ? walk(p) : [p]
  })
}

export function validateSkill(dir, opts = {}) {
  const errors = []
  const folder = path.basename(dir)
  const skillPath = path.join(dir, 'SKILL.md')
  if (!fs.existsSync(skillPath)) return [`${folder}: missing SKILL.md`]
  const text = fs.readFileSync(skillPath, 'utf8')
  const fm = parseFrontmatter(text)
  if (!fm) return [`${folder}: SKILL.md has no frontmatter`]
  const { name = '', description = '' } = fm.data
  if (name !== folder || !/^[a-z0-9-]+$/.test(name)) errors.push(`${folder}: name "${name}" must equal folder name and match ^[a-z0-9-]+$`)
  if (description.length < 1 || description.length > 1024) errors.push(`${folder}: description must be 1-1024 chars (got ${description.length})`)
  if (text.length > MAX_SKILL_CHARS) errors.push(`${folder}: SKILL.md over ${MAX_SKILL_CHARS} chars`)
  const lines = text.split(/\r?\n/).length
  if (opts.maxLines && lines > opts.maxLines) errors.push(`${folder}: SKILL.md has ${lines} lines (max ${opts.maxLines})`)
  for (const ref of new Set([...text.matchAll(REF)].map((m) => m[1]))) {
    if (!fs.existsSync(path.join(dir, ref))) errors.push(`${folder}: SKILL.md references ${ref}, which does not exist`)
  }
  let total = 0
  for (const file of walk(dir)) {
    const size = fs.statSync(file).size
    total += size
    if (size > MAX_FILE) errors.push(`${folder}: ${path.relative(dir, file)} is over 256 KB`)
  }
  if (total > MAX_DIR) errors.push(`${folder}: skill folder is over 2 MB`)
  return errors
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  const root = process.argv[2] ?? 'skills'
  const errors = fs.readdirSync(root, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .flatMap((e) => validateSkill(path.join(root, e.name), e.name === 'seatbelt' ? { maxLines: 200 } : {}))
  for (const e of errors) console.error(e)
  if (errors.length) process.exit(1)
  console.log('All skills valid.')
}
