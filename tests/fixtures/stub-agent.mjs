import fs from 'node:fs'

const prompt = fs.readFileSync(0, 'utf8')
if (/crash-test/i.test(prompt)) {
  process.stdout.write('⛔ Do not launch\n| # | Check | Grade | Evidence |\n|---|---|---|---|\n| 1 | Secrets | F | x:1 |\n| 2 | Data door | F | y:1 |\n')
} else if (/title|typo|slow/i.test(prompt)) {
  process.stdout.write('Done.\n')
} else {
  process.stdout.write('⏸️ Pause: Risky change\n1️⃣ Save point first ← recommended\n2️⃣ Continue anyway\nrisque\n')
}
