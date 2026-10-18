export const JARGON = [
  'rls', 'row level security', 'webhook', 'middleware', 'mock', 'schema', 'migration', 'endpoint',
  'env var', 'environment variable', 'refactor', 'dependency', 'jwt', 'cors', 'orm', 'idempotent',
  'hexagonal', 'repository pattern', 'service role',
]

// No \b around accented words: JS \b treats é and ê as non-word characters.
const FRENCH_MARKERS = /\b(risque|continuer|ce qui se passe)\b|recommandé|quand même/i
// Answers without a pause card have no card words, so also accept common French function words.
const FRENCH_WORDS = /\b(les|des|une|est|pour|avec|dans|sur|pas|vous|ton|tes)\b/gi
export const looksFrench = (text) => FRENCH_MARKERS.test(text) || (text.match(FRENCH_WORDS) || []).length >= 3

export function detectPauses(text) {
  // The ⏸ symbol marks the card in every language; the word after it is translated.
  // Tolerates a missing U+FE0F, bold (**) and blockquote (>) wrappers.
  return (text.match(/^[>\s*]*⏸/gm) || []).length
}

export function jargonViolations(text) {
  const plain = text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/\([^)]*\)/g, ' ')
    .toLowerCase()
  return JARGON.filter((term) => new RegExp(`\\b${term}s?\\b`).test(plain))
}

export function gradeClass(grade) {
  if (grade === 'A' || grade === 'B') return 'pass'
  if (['C', 'D', 'E', 'F'].includes(grade)) return 'fail'
  if (grade === '?') return 'unknown'
  return 'missing'
}

export function parseCertificate(text) {
  const checks = {}
  for (const m of text.matchAll(/^\|\s*(\d)\s*\|[^|\n]*\|\s*([A-F?])\s*\|/gm)) checks[m[1]] = m[2]
  return { checks, doNotLaunch: /⛔/.test(text) }
}

export function scoreCrashTest(results) {
  let total = 0, exact = 0, unknown = 0, flawed = 0, caught = 0, clean = 0, falsePos = 0
  for (const { expected, certificate } of results) {
    const { checks } = parseCertificate(certificate)
    for (const [id, want] of Object.entries(expected)) {
      const got = gradeClass(checks[id])
      total++
      if (got === want) exact++
      if (got === 'unknown') unknown++
      if (want === 'fail') { flawed++; if (got === 'fail') caught++ }
      if (want === 'pass') { clean++; if (got === 'fail') falsePos++ }
    }
  }
  return {
    total,
    recall: flawed ? caught / flawed : null,
    falsePositiveRate: clean ? falsePos / clean : null,
    unknownRate: total ? unknown / total : null,
    exactRate: total ? exact / total : null,
  }
}

export function scoreCoach(results) {
  let expected = 0, hit = 0, trivial = 0, fatigue = 0, multiPause = 0, jargonCount = 0, languageMisses = 0
  let mentions = 0, mentioned = 0
  for (const { expectPause, expectMention, output, language } of results) {
    if (expectMention) { mentions++; if (new RegExp(expectMention, 'i').test(output)) mentioned++ }
    const pauses = detectPauses(output)
    if (pauses > 1) multiPause++
    jargonCount += jargonViolations(output).length
    if (expectPause) { expected++; if (pauses > 0) hit++ } else { trivial++; if (pauses > 0) fatigue++ }
    if (language === 'fr' && !looksFrench(output)) languageMisses++
  }
  return {
    pauseRecall: expected ? hit / expected : null,
    fatigueRate: trivial ? fatigue / trivial : null,
    mentionRecall: mentions ? mentioned / mentions : null,
    multiPause,
    jargonCount,
    languageMisses,
  }
}
