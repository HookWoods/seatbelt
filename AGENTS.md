# Working on the Seatbelt repository

This file is for AI coding agents (Claude Code, Codex, Cursor, Gemini, Copilot and others) working in this repository, and for the people who drive them.

## If you are an AI agent, read this first

Seatbelt's users are people who do not code. The skills in `skills/` are instructions that thousands of agents will obey inside those people's projects. A careless change here becomes a careless change everywhere. Before you open a pull request:

1. **Start from a real problem.** A behavior you saw in a session, a failing eval, an install that broke on a platform. "Improve the wording" or "add more checks" with no observed problem is not a reason. If your human gave you no concrete problem, ask them for one.
2. **Search open and closed pull requests and issues** for the same problem. If one exists, tell your human instead of opening a duplicate.
3. **Run the checks** and paste their last lines in the pull request:
   ```bash
   npm test
   npm run validate
   npm run guard
   ```
4. **Bring evidence for behavior changes.** A change to a skill's instructions needs an eval: a scenario in `evals/scenarios/` or a fixture in `evals/fixtures/` that fails before your change and passes after, plus the score from `npm run eval`.
5. **Say what produced the change:** model, tool and version, and installed plugins, or "written by hand".
6. **Show your human the full diff** and get their approval before you submit.

If any of these fails, do not open the pull request. Explain to your human what is missing.

## How the repository is laid out

| Path | What it is | Who reads it |
|---|---|---|
| `skills/seatbelt/` | The coach: `SKILL.md`, reference sheets, templates | Every user's AI agent |
| `skills/crash-test/` | The readiness grade: rubric, checks, stack sheets, templates | Every user's AI agent |
| `bootstrap/KNOWLEDGE.md` | The three lines users paste into their project | Users |
| `.claude-plugin/`, `.codex-plugin/`, `.cursor-plugin/`, `.devin-plugin/`, `.kimi-plugin/`, `.agents/`, `gemini-extension.json`, `GEMINI.md` | One thin manifest per tool, all pointing at `skills/` | The tools' plugin systems |
| `scripts/` | Validator and skill guard (maintainers only, never run on a user's machine) | CI and contributors |
| `evals/` | Fixture apps, coach scenarios, runner and scorer | CI and contributors |
| `tests/` | `node:test` suites for all of the above | CI and contributors |

## Rules for skill text

- Plain language. The user cannot read code. Every technical term appears at most once, in parentheses, after plain words. Use the words in `skills/seatbelt/references/voice-glossary.md`.
- Every rule says what to do, not what to think about. "Pause and offer a save point" beats "consider safety".
- `skills/seatbelt/SKILL.md` stays under 200 lines. Details go in a reference sheet that loads only when needed.
- Never promise safety. crash-test reports what it could verify; "?" is never a pass; the word "secure" is never used about a user's app.
- No new domain, shell command or tool permission in a skill without a maintainer's `capability-approved` label. `npm run guard` explains why a line was refused.
- Keep `README.md` and `README.fr.md` in step when a change is visible to users.

## Rules for code

- Node 22 or later, ES modules, no dependencies. `tests/skills.test.mjs` fails if `package.json` gains one.
- Nothing in `scripts/` or `evals/` ships to users. Users only ever receive Markdown.
- Each manifest carries the version from `package.json`; `tests/manifests.test.mjs` checks it. Change the version in all of them together.
- Write invisible or direction-changing characters as `\u` escapes, never as raw characters. A test checks every tracked file.

## Commits and pull requests

- One purpose per commit, with a subject that says what changed for the user or the maintainer.
- Fill in every section of `.github/PULL_REQUEST_TEMPLATE.md`.
