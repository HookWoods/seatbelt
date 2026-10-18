import fs from 'node:fs'

const prompt = fs.readFileSync(0, 'utf8')
if (/crash-test/i.test(prompt)) {
  process.stdout.write('⛔ Do not launch\n| # | Check | Grade | Evidence |\n|---|---|---|---|\n| 1 | Secrets | F | x:1 |\n| 2 | Data door | F | y:1 |\n'
    + '| 3 | Server doors | F | z:1 |\n| 4 | Payments | F | z:2 |\n| 5 | Backups | F | z:3 |\n| 6 | Safety net | F | z:4 |\n| 7 | Privacy | F | z:5 |\n')
} else if (/GitHub|GitLab/.test(prompt)) {
  process.stdout.write(/GitLab/.test(prompt)
    ? "C'est fait : la protection est active pour les pushes, avec un pre-commit dans le projet.\n"
    : 'Done. Push protection is on and the pre-commit check is installed.\n')
} else if (/title bigger|typo|slow|bakery|search box|hire a developer/i.test(prompt)) {
  process.stdout.write('Done.\n')
} else {
  process.stdout.write('⏸️ Pause: Risky change\n1️⃣ Save point first ← recommended\n2️⃣ Continue anyway\nrisque\n')
}
