# Benchmark results

Run on 2026-10-18 with Claude Code 2.1.299 in print mode (`claude -p`), model Sonnet, a clean configuration folder (no personal plugins, hooks or memory), tools limited to Read, Grep, Glob and Skill, and a $1 budget cap per run. Each suite ran 3 times.

Reproduce with:

```bash
npm run eval -- crash-test --runs 3
npm run eval -- coach --runs 3
SEATBELT_NO_SKILLS=1 npm run eval -- coach --runs 3
```

## crash-test (6 apps × 3 runs = 36 graded checks)

| Measure | Result |
|---|---|
| Planted flaws graded as failing | 18 / 18 |
| False alarms on the clean twins | 0 / 15 |
| "?" when the database rules live only in the dashboard | 3 / 3 |
| Same pass or fail verdict for a check across the 3 runs | 12 / 12 |
| Same letter grade for a check across the 3 runs | 10 / 12 |

The two letter changes: clean twin 2, check 1 graded B once and A twice, and an open insert rule graded C once and F twice (flawed app 3, check 2). Both stayed on the same side of pass or fail. The rubric now says to pick the lowest grade that matches.

## Coach (10 scenarios × 3 runs = 30 answers)

| Measure | With Seatbelt | Without Seatbelt |
|---|---|---|
| Risky requests where the AI stopped and offered a choice before acting | 21 / 21 | 0 / 21 |
| Pauses on trivial requests (title size, typo, a question) | 0 / 9 | 0 / 9 |
| Answers with more than one pause | 0 | 0 |
| Jargon words used without a plain translation | 1 | 22 |
| Pasted test key repeated back to the user | 0 / 3 | 0 / 3 |

Without Seatbelt the model is not careless: it kept the secret key out of browser code and mentioned a risk in 10 of the 21 risky requests. It did so after starting the change, without stopping first or offering a choice.

## Known limits of this run

- Small sample: 6 apps and 10 scenarios, 3 runs each. Treat the numbers as a first measurement, not a guarantee.
- Writing files was not allowed in either arm, so the runs measure what the AI says and plans, not the files it would change.
- The account used for the run synced its claude.ai skills and plugins into the clean folder. 4 of the 27 English requests were answered in French, likely from an account language preference. The coach instructions now say explicitly to answer in the language of the latest message.
- One model (Sonnet). Other models and other tools (Lovable, Bolt, Replit, Cursor) are not measured yet.
