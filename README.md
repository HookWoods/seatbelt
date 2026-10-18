<div align="center">

# Seatbelt

**Vibe coder should no longer be an insult.**

A patient senior developer inside the AI you already build with.
Seatbelt keeps your app safe and clean while you build, explains every risky choice in plain words, and tells you how ready your app is before you launch.

<a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-1F6F78?style=flat-square" alt="MIT license"></a>
<img src="https://img.shields.io/badge/works%20with-Lovable%20%C2%B7%20Bolt%20%C2%B7%20Replit%20%C2%B7%20Claude%20%C2%B7%20Cursor%20%C2%B7%20Codex-1F6F78?style=flat-square" alt="Works with Lovable, Bolt, Replit, Claude, Cursor, Codex">
<img src="https://img.shields.io/badge/no%20install%20to%20run-just%20Markdown-1F6F78?style=flat-square" alt="Nothing to install: plain Markdown skills">

[English](README.md) · [Français](README.fr.md)

</div>

<table>
<tr>
<th width="50%">Your project today</th>
<th width="50%">With Seatbelt</th>
</tr>
<tr>
<td align="center"><img src="docs/assets/before-frankencar.png" alt="A sports car bolted together from mismatched parts" width="100%"></td>
<td align="center"><img src="docs/assets/after-clean-car.png" alt="The same car built to one clean design" width="100%"></td>
</tr>
<tr>
<td>Parts from different makers, taped together. It drives, until it doesn't. Every prompt adds a part that does not match the others.</td>
<td>One design. The parts fit, the brakes work, and you know what is under the hood.</td>
</tr>
</table>

> "Try to fix 1 thing and break 3 others." (r/lovable)
>
> "You don't have backups, you have hope." (r/vibecoding)

## See it

You ask your builder for a feature and paste a key in the chat. Without Seatbelt, the AI puts the key in the page and moves on. With Seatbelt, it stops first:

```
You: Add a Stripe checkout button. Here is my key: sk_live_...

⏸️ Pause: Secret key visible
What is happening: this key gives full access to your Stripe account, and the page you asked for is code anyone can read.
Risk if we continue: someone can copy the key and make payments or refunds as you.
1️⃣ I keep the key in your project's secret variables and use it only on the server, then show you how to replace it (2 min, recommended)
2️⃣ Continue anyway, and I note the risk in your notebook
```

Before you launch, ask for a crash test:

```
# crash-test certificate: notes-app, 2026-10-18
⛔ Do not launch

| # | Check     | Grade | Evidence                                              |
|---|-----------|-------|-------------------------------------------------------|
| 1 | Secrets   | F     | src/lib/ai.js:1 (OpenAI key readable in the browser)  |
| 2 | Data door | F     | supabase/migrations/001_notes.sql:10 (anyone can read every note) |

Result: 0/2 checks passed (this version covers checks 1 and 2 of 7)

The 3 cheapest fixes
1. "Move the OpenAI call into a server function that reads OPENAI_API_KEY from the project secrets..." (5 min)
2. "Replace the 'anyone can read' rule on notes with one that lets each user read only their own notes..." (2 min)
3. ...
```

## Why this exists

AI builders let anyone ship an app in a weekend, and the apps work. Under the hood they stay prototypes:

- 170 of 1,645 Lovable apps scanned in 2025 left users' data readable by anyone (CVE-2025-48757).
- A developer who cleans up AI-built apps for a living lists the same seven problems in almost every project: keys in the code, security only on the screen, users who can read each other's data, no error tracking, backups never tested, prices trusted from the browser, and features that silently rewrite each other.
- Developers refuse to take over these projects, and a paid "vibe code cleanup" market has appeared.

Most tools that try to fix this are scanners for developers: they run at the end and speak jargon. Seatbelt works while you build, in the tool you already use, in words you understand.

## What you get

| Skill | What it does |
|---|---|
| `seatbelt` | The coach. Applies good practice by default, pauses at risky moments with two clear choices, explains every choice by cost, risk or time, and keeps `PROJECT.md`, a plain-language notebook of your app. |
| `crash-test` | The readiness grade. Checks your app one area at a time, grades each from A to F with the file and line as proof, gives the 3 cheapest fixes as prompts you can paste, and keeps a history so you can watch the grade rise. |

### When the coach pauses

| Moment | What happens |
|---|---|
| A key or password appears in the chat or in the code | It moves the key to a safe place and tells you how to replace it. |
| A change touches login, payment or your users' data | It makes a save point first, changes one thing, then checks it still works. |
| The same problem failed to fix twice | It stops guessing, says what it thinks is wrong, and goes back to the last save point. |
| A file gets too big, or the same thing exists twice | It offers to split the file or keep one version. |
| You ask for "tests for everything" | It writes the few tests that matter instead of hundreds that check nothing. |

Small changes (text, colors, layout) never trigger a pause. If you say "continue anyway", it does, and writes the risk in your notebook so you can review it before launch.

### What it does without asking

- Keeps functions and files small, and writes no code "for later".
- Reuses what already exists instead of creating a second version.
- Checks input where it enters the app, and never hides an error behind a fake value.
- Gives every screen a loading, empty and error state.
- Runs the standard formatter, linter and type checker for your language.
- Re-reads its own changes before saying "done", and tells you what it removed.

### The notebook

`PROJECT.md` sits at the root of your project. The AI reads it first at every session, so it stops forgetting what you decided yesterday. It holds what the app does, where things are, the decisions you made, the services you pay for, the names of your secrets (never their values), the risks you accepted and your crash-test history. Hand it to a developer and they understand your project in five minutes.

## Install

Each skill is one folder. Install `seatbelt` first; add `crash-test` when you want the grade.

### Lovable
1. Open your workspace settings, then **Skills**, then **Add from GitHub** (workspace admins only).
2. Paste `https://github.com/HookWoods/seatbelt/tree/main/skills/seatbelt`, then repeat with `.../skills/crash-test`.
3. Open your project's **Knowledge** and paste the three lines below.

### Bolt
1. Open **Knowledge**, then **Skills**, then **Import from GitHub**.
2. Import `https://github.com/HookWoods/seatbelt/tree/main/skills/seatbelt`, then `.../skills/crash-test` (Bolt imports one skill at a time).
3. Paste the three lines below into your project Knowledge.

### Replit
1. Click **Use a skill** and paste `https://github.com/HookWoods/seatbelt/tree/main/skills/seatbelt`.
2. Repeat with `.../skills/crash-test`.

### Claude Code
```bash
/plugin marketplace add HookWoods/seatbelt
/plugin install seatbelt@seatbelt
```

### Claude.ai and Claude Desktop
Download this repository as a ZIP, zip the `skills/seatbelt` folder on its own, then upload it in **Settings**, **Capabilities**, **Skills**. Do the same for `skills/crash-test`.

### Cursor, GitHub Copilot, Codex, Gemini CLI, OpenCode
```bash
npx skills add HookWoods/seatbelt
```
Or copy the two folders from `skills/` into `.agents/skills/` in your project.

### The three lines
Paste this into your project Knowledge (Lovable, Bolt) or into `AGENTS.md` / `CLAUDE.md`, so the coach is used on every request:

```
This project uses Seatbelt.
Use the seatbelt skill for every request in this project.
Read PROJECT.md first if it exists.
```

## Use it

You do not need to learn commands. Build as usual; the coach steps in when it matters. A few things you can ask:

- "Run crash-test on my app."
- "Explain what you just changed, in plain words."
- "Update my notebook."
- "What did I accept as a risk so far?"
- "I want to hand this project to a developer. Prepare it."

Seatbelt answers in the language you write in.

## Honest limits

- Skills are instructions the AI follows. They make good behavior the default; they cannot force it.
- crash-test reports what the AI could verify in your files and in what you pasted. It is not a security audit or a certification, and the badge always says "self-checked".
- Some settings live only in your dashboards (for example Supabase rules and backups). crash-test gives you the exact clicks or query to run and grades "?" until you paste the result. "?" never counts as a pass.
- This first version grades secrets and the data door for Supabase apps. Server-side checks, payments, backups, a test safety net and privacy come next.

## Benchmark

Both skills are measured, not just described. `evals/` holds six small Supabase apps (three with planted flaws, three clean twins) and ten coach scenarios, including requests in French and requests that must not trigger a pause. The runner drives a real agent with and without Seatbelt and reports flaws caught, false alarms, pauses at the right moment and pauses on trivial requests.

```bash
npm run eval -- crash-test --runs 3
npm run eval -- coach --runs 3
SEATBELT_NO_SKILLS=1 npm run eval -- coach --runs 3   # same run without Seatbelt
```

## FAQ

**Do I need to know how to code?** No. That is the point. Seatbelt explains every choice by what it costs, what can go wrong or how long it takes.

**Will it slow me down?** It pauses only at the moments listed above, at most once per message, and never twice for the same thing in a session. Small changes go straight through.

**Does it cost more tokens?** Only the short main file is loaded on every request; the detailed sheets load only when a moment needs them. The notebook also saves the AI from exploring your whole project at each session.

**Can I use it on an existing project?** Yes. The coach creates the notebook after its first real change, and crash-test works on any project with files it can read.

**Is my data sent anywhere?** No. Seatbelt is plain text read by the AI tool you already use. There is no server and nothing to run.

## Contributing

Improvements to the wording of the skills are as valuable as code. Before opening a pull request:

```bash
npm test          # content, scorer and runner tests (Node 22+, no dependencies)
npm run validate  # platform limits: name, description length, file sizes
npm run guard     # no hidden instructions; new domains or commands need a maintainer's approval
```

New crash-test checks go in `skills/crash-test/checks/`, new stacks in `skills/crash-test/stacks/`, each with a fixture app in `evals/fixtures/` that proves the check catches the flaw and stays quiet on a clean twin.

## License

MIT
