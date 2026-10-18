<div align="center">

<img src="docs/assets/banner.svg" alt="Seatbelt: a patient senior developer inside the AI you build with. Works with Lovable, Bolt, Replit, Claude, Cursor and Codex." width="880">

### "Vibe coder" should no longer be an insult.

Build with AI like you do today. Seatbelt makes the AI stop at the risky moments, explain them in plain words, and keep your app clean and safe until launch day.

<a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-1F6F78?style=for-the-badge" alt="MIT license"></a>
<img src="https://img.shields.io/badge/runs%20on-14%20AI%20tools-0F3D43?style=for-the-badge" alt="Runs on 14 AI tools">
<a href="evals/RESULTS.md"><img src="https://img.shields.io/badge/risky%20moments%20caught-45%2F45-2EA043?style=for-the-badge&labelColor=111111" alt="Risky moments caught: 45 out of 45"></a>

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

## Watch it brake

You paste a payment key in the chat. Without Seatbelt, the AI drops it into a page anyone can read and moves on. With Seatbelt, it pulls over first:

<img src="docs/assets/demo-coach.gif" alt="Live recording in Claude Code. The user pastes a Stripe test key and asks for a checkout button. Seatbelt loads, reads two files, and shows a pause card titled Secret key in chat: what is happening, the risk, option 1 recommended (the code reads the key by name from a git-ignored .env slot that the user fills in, about 2 minutes), and option 2 continue anyway." width="880">

Before you launch, you ask for a crash test. You get a grade per area, the file and line as proof, and the three cheapest fixes, ready to paste:

<img src="docs/assets/demo-crash-test.gif" alt="Live recording in Claude Code, about 30 seconds of analysis cut. The user runs crash-test on a notes app. The certificate says Do not launch: Secrets F (an admin key hardcoded in browser code), Data door F (no row-level security), Server doors n/a, Payments n/a, Backups ? (not in the repo), Safety net D, Privacy D. 2 out of 7 passed, followed by the three cheapest fixes as prompts to paste." width="880">

## How it works

<img src="docs/assets/how-it-works.svg" alt="Four steps on a road: build as usual in Lovable, Bolt or Claude; Seatbelt pauses at risky moments with two clear choices; the notebook PROJECT.md keeps track in plain words; crash-test grades the app before launch with proof and fixes." width="880">

1. **You build as usual.** Same tool, same prompts. Seatbelt is a set of instructions the AI reads, so there is nothing new to learn.
2. **It brakes at the risky moments,** and only there: a new app with no clear goal, a new service to sign up for, a secret in the code, a change to login, payments or users' data, a fix that failed twice, a file that grew too big, a pile of useless tests, a change that could erase your data, a feature that bills you per use, and launch day. You get two choices and the cost of each.
3. **The notebook keeps track.** `PROJECT.md` lists what your app does, where things are, your decisions, your services and the risks you accepted. The AI reads it first, so it stops forgetting yesterday.
4. **The crash test grades your app** before real users touch it, with proof for every grade.

> [!NOTE]
> Small changes (a color, a text, a layout tweak) never trigger a pause. If you choose "continue anyway", it does exactly that and writes the risk in your notebook so you can review it before launch.

## What it protects you from

| | Without Seatbelt | With Seatbelt |
|---|---|---|
| 🔑 Keys and passwords | Pasted into code anyone can read | Kept in your secret variables, a check that refuses any commit or push containing one, and how to replace a leaked one |
| 🚪 Your users' data | One user can read everyone else's data | A rule at the data door, tested with two accounts |
| 💳 Payments | The price comes from the browser, so it can be changed | The price is checked on the server |
| 🔁 Fix loops | "Fix one thing, break three others" | A save point before every risky change, and a stop after two failed fixes |
| 🧱 Messy code | Copies of the same thing, giant files, code "for later" | Small files, one version of each thing, nothing unused |
| 🧪 Tests | None, or hundreds that check nothing | The few tests that guard login, payment and data |
| 🗑️ Your stored data | "Delete that column" wipes months of data, and undo does not bring it back | A checked copy of the data first, then changes in steps you can undo |
| 💸 Surprise bills | An AI button with no limit runs up the bill overnight | The price per use up front, a spending cap and a limit per user |
| 🚀 Launch day | Live with test keys, no backups and no privacy page | A go-live list: blockers first, then what to fix before you tell many people |
| 🧭 Understanding | "I'm paying to not understand my own app" | A plain-language notebook you can hand to a developer |

## Install

Each skill is one folder: `seatbelt` is the coach, `crash-test` is the grade. Pick your tool.

<details open>
<summary><b>Lovable</b></summary>

1. Workspace settings, **Skills**, **Add from GitHub** (workspace admins).
2. Paste `https://github.com/HookWoods/seatbelt/tree/main/skills/seatbelt`, then the same link ending in `crash-test`.
3. Paste the three lines below into your project **Knowledge**.
</details>

<details open>
<summary><b>Bolt</b></summary>

1. **Knowledge**, **Skills**, **Import from GitHub**.
2. Import `https://github.com/HookWoods/seatbelt/tree/main/skills/seatbelt`, then the `crash-test` link (Bolt imports one skill at a time).
3. Paste the three lines below into your project Knowledge.
</details>

<details>
<summary><b>Replit</b></summary>

Click **Use a skill**, paste `https://github.com/HookWoods/seatbelt/tree/main/skills/seatbelt`, then do the same with the `crash-test` link.
</details>

<details>
<summary><b>Claude Code, Claude Desktop and Claude.ai</b></summary>

In **Plugins**, click **Add**, then **Add a marketplace**, and enter `HookWoods/seatbelt`. Install **seatbelt** from it. In Claude Code you can also type:

```bash
/plugin marketplace add HookWoods/seatbelt
/plugin install seatbelt@seatbelt
```

**Optional extra for Claude Code: seatbelt-guard.** The skills ask the AI not to save or send a secret key; this extra makes sure of it. Before the AI runs `git commit` or `git push`, it looks at what would be saved or sent and stops the command if it finds a secret key or a secret file such as `.env`, without ever showing the key. It also refuses `--no-verify` and any change to `core.hooksPath`, the two ways to skip git's safety checks. Unlike the skills, which are plain text, **seatbelt-guard is a small program that runs on your computer** before every command the AI starts. It needs Node.js 22 or later, works in Claude Code only, and is off unless you install it:

```bash
/plugin install seatbelt-guard@seatbelt
```
</details>

<details>
<summary><b>Gemini CLI</b></summary>

```bash
gemini extensions install https://github.com/HookWoods/seatbelt
```
The extension loads the coach in every session; no need for the three lines.
</details>

<details>
<summary><b>GitHub Copilot CLI</b></summary>

```bash
copilot plugin marketplace add HookWoods/seatbelt
copilot plugin install seatbelt@seatbelt
```
</details>

<details>
<summary><b>Kimi Code, Devin, Factory Droid, Qwen Code</b></summary>

```bash
/plugins install https://github.com/HookWoods/seatbelt                                  # Kimi Code (starts every session with the coach)
devin plugins install HookWoods/seatbelt                                                  # Devin CLI
droid plugin marketplace add https://github.com/HookWoods/seatbelt && droid plugin install seatbelt@seatbelt   # Factory Droid
qwen extensions install HookWoods/seatbelt                                                # Qwen Code
```
</details>

<details>
<summary><b>Cursor, Codex, OpenCode and any tool that reads skill folders</b></summary>

```bash
npx skills add HookWoods/seatbelt
```
Or copy the two folders from `skills/` into `.agents/skills/` in your project, then paste the three lines below into `AGENTS.md`.
</details>

**The three lines.** Paste them into your project Knowledge (Lovable, Bolt) or into `AGENTS.md` / `CLAUDE.md`, so the coach rides along on every request:

```
This project uses Seatbelt.
Use the seatbelt skill for every request in this project.
Read PROJECT.md first if it exists.
```

## Talk to it

No commands to learn. Build as usual, and ask in your own words when you want something:

| You say | You get |
|---|---|
| "Run crash-test on my app." | The dashboard above, with the 3 cheapest fixes |
| "Explain what you just changed, in plain words." | One sentence, then the why, details only if you ask |
| "What risks did I accept so far?" | The list from your notebook, with dates |
| "I want to hand this to a developer. Prepare it." | A brief from your notebook: what the app does, where things are, secrets by name, accepted risks |

Seatbelt answers in the language you write in.

> [!IMPORTANT]
> **Honest limits.** Skills are instructions the AI follows: they make good behavior the default, they cannot force it. crash-test reports what the AI could verify in your files and in what you pasted. It is not a security audit or a certification, and its badge always says "self-checked". Settings that live only in a dashboard (Supabase rules, backups) are graded "?" until you paste them, and "?" never counts as a pass. crash-test runs seven checks on any app it can read; it knows the traps specific to Supabase, Firebase, Next.js and Stripe, and other stacks get the general checks only.

## Measured, not just described

We sent the same requests to the same AI (Claude Sonnet 5.5 in Claude Code, medium effort, the default), once with Seatbelt installed and once without, and counted the answers. Each request ran 3 times on both sides, because an AI does not answer the same way twice, so the numbers below count answers. Latest run: 2026-10-18 ([full results and limits](evals/RESULTS.md)).

| What we checked | With Seatbelt | Without |
|---|:---:|:---:|
| **🛑 It stops before a risky change**<br>15 risky requests, like "add Google login", "wipe the database", "publish it on my domain", or a message with a secret key pasted in. Did the AI stop and offer a safe option **before** touching anything? | **45 / 45**<br>answers stopped | 0 / 45 |
| **🤫 It stays quiet on simple requests**<br>8 harmless requests, like "make the title bigger", "fix a typo" or "add a search box". A good coach does not interrupt for these. *Lower is better.* | **0 / 24**<br>needless stops | 0 / 24 |
| **🔐 It guards your keys when you upload your code**<br>"Put my project on GitHub" and the same in French for GitLab. Did the AI set up a check that refuses to upload a secret key? | **6 / 6**<br>answers set it up | 0 / 6 |
| **💬 It speaks your language, not jargon**<br>Technical words like "RLS", "webhook" or "migration" used without plain words to explain them. *Lower is better.* | **12**<br>in 69 answers | 52<br>in 69 answers |
| **🔎 crash-test finds real problems**<br>11 small test apps with planted problems, at least one for each of the 7 checks and for Firebase, Next.js and Stripe: an admin key left in the code, a database anyone can read, a price the buyer can change, a deploy that wipes the data, tests that check nothing, a password written to the logs... Did the grade catch every one? | **47 / 48**<br>problems caught | no equivalent |
| **🐺 crash-test does not cry wolf**<br>11 clean copies of the same apps, with the problems fixed. Did it wrongly fail any of them? *Lower is better.* | **0 / 51**<br>false alarms | no equivalent |

The test apps and requests live in `evals/`: 22 small apps (Supabase, Firebase, Next.js, Stripe) and 23 requests that cover every pause moment, three of them in French. Anyone can run them again with the commands below.

```bash
npm run eval -- crash-test --runs 3 --jobs 12
npm run eval -- coach --runs 3 --jobs 12   # about 2 minutes
SEATBELT_NO_SKILLS=1 npm run eval -- coach --runs 3   # the same run without Seatbelt
```

## FAQ

<details>
<summary><b>Do I need to know how to code?</b></summary>

No. That is the point. Every choice is explained by what it costs, what can go wrong or how long it takes.
</details>

<details>
<summary><b>Will it slow me down?</b></summary>

It pauses only at the risky moments, at most once per message, and never twice for the same thing in a session.
</details>

<details>
<summary><b>Does it cost more tokens?</b></summary>

Only a short main file is loaded on every request; the detailed sheets load when a moment needs them. The notebook also saves the AI from exploring your whole project at every session.
</details>

<details>
<summary><b>Can I add it to a project I already started?</b></summary>

Yes. The coach writes the notebook after its first real change, and crash-test works on any project whose files it can read.
</details>

<details>
<summary><b>Is my code or data sent anywhere?</b></summary>

No. Seatbelt is plain text read by the AI tool you already use. No server, nothing to run. The one exception is the optional seatbelt-guard extra for Claude Code, a small program that runs on your computer if you install it; it reads your project's git history and sends nothing anywhere.
</details>

## Contributing

Better wording in the skills is worth as much as code. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

MIT
