# Benchmark results

Run on 2026-10-18 with Claude Code 2.1.299 in print mode (`claude -p`), model Sonnet, a clean configuration folder (no personal plugins, hooks or memory, claude.ai skill sync turned off), tools limited to Read, Grep, Glob and Skill, and a $1 budget cap per run.

Reproduce with:

```bash
npm run eval -- crash-test --runs 3
npm run eval -- coach --runs 2 --jobs 12
SEATBELT_NO_SKILLS=1 npm run eval -- coach --runs 3
```

With `--jobs 12` the 46 coach answers take about 2 minutes.

## crash-test (6 apps × 3 runs = 36 graded checks)

| Measure | Result |
|---|---|
| Planted flaws graded as failing | 18 / 18 |
| False alarms on the clean twins | 0 / 15 |
| "?" when the database rules live only in the dashboard | 3 / 3 |
| Same pass or fail verdict for a check across the 3 runs | 12 / 12 |
| Same letter grade for a check across the 3 runs | 10 / 12 |

The two letter changes: clean twin 2, check 1 graded B once and A twice, and an open insert rule graded C once and F twice (flawed app 3, check 2). Both stayed on the same side of pass or fail. The rubric now says to pick the lowest grade that matches.

## Coach (23 scenarios)

The current instructions ran each scenario twice (46 answers). The run without Seatbelt ran the 21 earlier scenarios three times (63 answers) and the two push scenarios three times (6 answers).

| Measure | With Seatbelt | Without Seatbelt |
|---|---|---|
| Risky requests where the AI stopped and offered a choice before acting | 30 / 30 | 0 / 45 |
| Pauses on requests that did not need one (title size, typo, a question, a clear one-page site, a search box, hiring a developer, a first push) | 0 / 16 | 0 / 24 |
| First push to GitHub or GitLab: the answer sets up secret protection (host push protection or a pre-commit check) | 4 / 4 | 0 / 6 |
| Answers with more than one pause | 0 | 0 |
| Jargon words used without a plain translation | 6 in 46 answers | 52 in 63 answers |
| Pasted test key repeated back to the user | 0 / 2 | 1 / 3 |

Every pause moment has at least one scenario: a vague new app (1), switching a database service (2), secrets (3), login, payment and account deletion (4), a second failed fix (5), "test everything" (7), dropping a column and wiping the database (8), an AI button billed per use (9), and launch (10). Three are in French.

### What the first run of the new moments caught

The first run of the new instructions scored 41 / 45. Reading the answers showed three faults, all fixed before the run above:
- A service-role key hidden in a client file was missed 3 times out of 3: the AI never opened the file. The coach now reads the files that connect the app to its services before its first change.
- The public Supabase key and the public Stripe key were each flagged as secrets once. The coach now reads a key's prefix before pausing.
- Two answers stopped and offered the right two choices but without the pause card. The card is now required even inside a long answer, with its title in the user's language.

## Known limits of this run

- Small sample: 6 apps, 23 scenarios, 2 or 3 runs each. Treat the numbers as a measurement, not a guarantee.
- Writing files was not allowed in either arm, so the runs measure what the AI says and plans, not the files it would change.
- The first crash-test and coach runs synced the account's claude.ai skills and plugins into the clean folder, and some English requests were answered in French. Sync is now off for benchmark runs, and the coach is told to answer in the language of the latest message. A few English requests were still answered in French in the tuning runs; the account's language preference is the likely cause.
- The crash-test numbers come from the 0.1 run; crash-test did not change since.
- One model (Sonnet). Other models and other tools (Lovable, Bolt, Replit, Cursor) are not measured yet.
