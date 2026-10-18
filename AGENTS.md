# Seatbelt repository

This repository contains two Agent Skills in `skills/`: `seatbelt` (coach) and `crash-test` (readiness grade). Everything under `skills/` is user-facing Markdown. `scripts/` and `evals/` are maintainer-only Node tools.

- Run `npm test` and `npm run validate` before every commit.
- Keep `skills/seatbelt/SKILL.md` under 200 lines and every skill description under 1024 characters.
- Never add a dependency or a user-side binary.
