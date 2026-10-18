# Changelog

What changed for people who use Seatbelt, newest first.

## 0.2.0 (2026-10-18)

### The coach follows the whole journey
- **Five new pause moments.** Before building a new app with no clear goal (1), before choosing or switching a service (2), before a change that can erase stored data (8), before adding something billed per use (9), and before real users arrive (10). Each has its own sheet: `idea.md`, `stack.md`, `data.md` and `golive.md`.
- **Handoff sheet** for exporting the code, leaving a platform, bringing in a developer, or starting a fresh conversation.
- **Wider security sheet**: login, admin pages, uploads, abuse limits, text users write, and AI features inside the app.
- **Secret guards.** The coach turns on the code host's push protection (GitHub, GitLab, Bitbucket, Azure DevOps and others, looked up rather than guessed) and installs a small check that refuses any commit containing a key. It never gets past that check.
- The coach reads the files that connect the app to its services before its first change, reads a key's prefix before pausing (public keys are not secrets), and never says "fixed" for something it did not see work.
- The pause card keeps its ⏸️ symbol in every language; its words are translated.

### crash-test grades all seven checks
- **New checks:** server doors (3), payments (4), backups (5), safety net (6) and privacy (7), next to secrets and the data door. `n/a` marks a check that does not apply.
- **Stack sheets** for Firebase, Next.js and Stripe, next to Supabase. crash-test reads every sheet that matches the app.
- The certificate and the badge count out of 7.

### Optional extra
- **seatbelt-guard**, a separate Claude Code plugin that stops commits and pushes carrying a secret. It runs code on your computer, so it is opt-in and not part of the main skills.

### Measured
On Claude Sonnet 5.5, 3 runs per request ([full results](evals/RESULTS.md)):
- The coach stopped before 45 of 45 risky requests (0 of 45 without Seatbelt), paused on 0 of 24 simple ones, and set up secret protection on 6 of 6 first pushes (0 of 6 without).
- crash-test caught 47 of 48 planted flaws across 22 test apps, with 0 false alarms in 51 checks that should pass.

### For contributors
- The benchmark runs requests in parallel (`--jobs`, 4 by default) and can rerun chosen ones (`--only`).
- 22 fixture apps and 23 coach scenarios.

## 0.1.0

First release.
- **seatbelt**, the coach: plain-language voice, pause cards at risky moments (secrets, login, payments and users' data, a fix that failed twice, files that grew too big, test bloat), code-shape rules, and the PROJECT.md notebook.
- **crash-test**, the readiness grade: secrets and the data door for Supabase apps, graded A to F with file and line evidence, three ready-to-paste fixes, and a self-checked badge.
- Install paths for 14 AI tools, the skill guard in CI, and the first benchmark.
