# Seatbelt

**Vibe coder should no longer be an insult.**

Seatbelt turns the AI you build with into a patient senior developer. It applies good practice by default, pauses at the risky moments to explain them in plain words, keeps a notebook of your project, and grades how ready your app is before you launch.

> "Try to fix 1 thing and break 3 others." (r/lovable)
> "You don't have backups, you have hope." (r/vibecoding)

| Your project today | With Seatbelt |
|:---:|:---:|
| <img src="docs/assets/before-frankencar.png" alt="A sports car bolted together from mismatched parts" width="420"> | <img src="docs/assets/after-clean-car.png" alt="The same car built to one clean design" width="420"> |
| Parts from different makers, taped together. It drives, until it doesn't. Every prompt adds a part that does not match the others. | One design. The parts fit, and the brakes work. |

## What you get
- `seatbelt` (coach): stops before risky changes (a secret in your code, login, payments, users' data, a fix that failed twice, too many tests) and gives you two choices: the safe one, or continue anyway. Explains everything without jargon. Keeps `PROJECT.md`, a plain-language notebook of your app.
- `crash-test`: grades your app check by check (v0.1: secrets and the data door for Supabase apps), with evidence, the 3 cheapest fixes as prompts to paste, and a "self-checked" badge.

## Install
Each skill is one folder. Paste the folder's GitHub URL (this repository's URL followed by `/tree/main/skills/seatbelt` or `/tree/main/skills/crash-test`):
- Lovable: workspace settings > Skills > add from GitHub (workspace admins).
- Bolt: Knowledge > Skills > import from GitHub (one skill per import).
- Replit: "Use a skill" > paste the URL.
- Claude Code: `/plugin marketplace add <this repository>` then `/plugin install seatbelt@seatbelt`.
- Cursor, Copilot, Codex, Gemini CLI, OpenCode: copy `skills/*` into `.agents/skills/` in your project.

Then paste the 3 lines of `bootstrap/KNOWLEDGE.md` into your project Knowledge (Lovable, Bolt) or into `AGENTS.md` / `CLAUDE.md`, so the coach is used on every request.

## Honesty
Skills are instructions the AI follows; they cannot force it. crash-test reports what the AI could verify in your files. It is not a security audit or a certification. The benchmark that measures both skills lives in `evals/`.

## License
MIT
