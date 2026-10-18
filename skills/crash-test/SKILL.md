---
name: crash-test
description: Use when the user wants to know if an AI-built app is ready to launch, asks for a security or readiness check, or is about to publish. Runs seven plain-language readiness checks (secrets, data door, server doors, payments, backups, safety net, privacy), grades each A-F with file:line evidence, gives the three cheapest fixes as prompts to paste into the builder, and keeps a grade history.
---

# crash-test

You grade how ready an AI-built app is for real users, for someone who does not code. Plain language only (one sentence first, technical term at most once in parentheses).

## Honesty rules (read first)
- The grade means "this is what I could verify in the files and in what you pasted". It is not a security audit and not a certification.
- Never use the word "secure" about the app. Say what was checked and what was not.
- "?" means "could not verify". "?" is never a pass.
- Cite evidence for every grade: `file:line`, or "from what you pasted".
- Never print a secret value. Name it ("a Stripe secret key") and give its location.

## Workflow
1. Detect the stack, and read every stack sheet that matches (an app often uses several):
   - Supabase (`supabase/` folder, `@supabase/supabase-js`, `supabase.co` URLs): `stacks/supabase.md`
   - Firebase (`firebase` or `firebase-admin` in `package.json`, `firestore.rules`, `firebase.json`): `stacks/firebase.md`
   - Next.js (`next` in `package.json`, `next.config.*`): `stacks/nextjs.md`
   - Stripe (`stripe` or `@stripe/stripe-js` in `package.json`): `stacks/stripe.md`
   For a stack with no sheet, use the check sheets as they are and say in the certificate that no stack sheet exists for it yet. If no database is found, say so and grade check 2 as "?".
2. Run the checks in order, following each sheet:
   - Check 1, Secrets: `checks/01-secrets.md`
   - Check 2, Data door: `checks/02-data-door.md`
   - Check 3, Server doors: `checks/03-server-doors.md`
   - Check 4, Payments: `checks/04-payments.md`
   - Check 5, Backups: `checks/05-backups.md`
   - Check 6, Safety net: `checks/06-safety-net.md`
   - Check 7, Privacy: `checks/07-privacy.md`
3. Grade each check with `rubric.md`.
4. Ask for missing evidence once, in one message for all checks. If a check needs dashboard information, give the exact click-path or SQL from the sheet and ask the user to paste the result. If they cannot or do not answer, grade "?" and continue.
5. Write the certificate with `templates/certificate.md`, worst result first in the summary. If `PROJECT.md` has "Accepted risks", list each one on the certificate under "Risks you accepted earlier" so the user reviews them before launch.
6. Give the three cheapest fixes that would raise the grade, each as a ready-to-paste prompt for the user's builder (Lovable, Bolt, Replit, Cursor or Claude). Offer to apply them yourself if you can edit the project.
7. Record history. Add a row to the "crash-test" section of `PROJECT.md` if it exists, otherwise to `CRASH-TEST.md` at the project root: date, `<passed>/7`, launch verdict.
8. Offer the badge from `templates/badge.md`.

## Launch verdict
- Any F, or any live secret visible in code, the browser bundle or a committed file: write `⛔ Do not launch` at the top.
- Otherwise: `✅ No blocker found in what I could check`, followed by what was not checked.
- Keep the ⛔ / ✅ symbols; the words are translated into the user's language.

## Scope
All seven checks run on every app. Stack sheets exist for Supabase, Firebase, Next.js and Stripe; other stacks are graded from the general sheets, with a note in the certificate.
