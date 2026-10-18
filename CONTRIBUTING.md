# Contributing to Seatbelt

Thank you for helping people who build with AI ship safer apps. The most valuable contributions are often not code: a report that Seatbelt behaved badly on your platform, a clearer sentence in a skill, or a new fixture app that shows a flaw the crash test misses.

## Ways to help

| You have | Do this |
|---|---|
| Seatbelt did something wrong in Lovable, Bolt, Replit, Claude, Cursor... | Open a **platform report** issue with the prompt you used and what the AI answered. Reports become new eval scenarios. |
| A sentence in a skill that confused you or your AI | Open a pull request that changes it, with the scenario that shows the problem. |
| A flaw AI-built apps often have that crash-test misses | Add a check sheet in `skills/crash-test/checks/` and a fixture app in `evals/fixtures/crash-test/` (one with the flaw, one clean twin). |
| A stack crash-test does not know (Firebase, Next.js, Stripe...) | Add a stack sheet in `skills/crash-test/stacks/` and a fixture app. |
| A translation | Translate `README.md` into `README.<lang>.md` and the SVGs in `docs/assets/` (they are generated with French and English text side by side). |

## Before you open a pull request

```bash
npm test          # Node 22+, no dependencies to install
npm run validate  # platform limits for every skill
npm run guard     # refuses hidden instructions; new domains, commands or tool permissions need approval
```

For changes to how a skill behaves, run the benchmark before and after and put both numbers in the pull request:

```bash
npm run eval -- coach --runs 3
npm run eval -- crash-test --runs 3
```

The runner drives `claude -p` by default. Point `SEATBELT_AGENT_CMD` at another agent command to measure it, and set `SEATBELT_NO_SKILLS=1` for the baseline without Seatbelt.

## What we will not merge

- Dependencies, or anything that runs code on a user's machine. Seatbelt is Markdown that the user's AI reads.
- Wording changes without an observed problem or an eval that shows the difference.
- Claims about safety, compliance or certification.
- Jargon in user-facing text. If a non-developer would not understand a sentence, it needs plain words first.

## Using an AI agent to contribute

That is welcome, with the rules in [AGENTS.md](AGENTS.md): a real problem, the checks run, evidence for behavior changes, the producing model and tool disclosed, and a human who reviewed the whole diff.

## Code of conduct

Everyone taking part follows the [Code of Conduct](CODE_OF_CONDUCT.md).
