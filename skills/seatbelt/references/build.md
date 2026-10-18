# Build

## Before a risky change (moment 4)
A risky change touches login, payment, or users' data.
1. Make a save point: `git commit` if the project uses git; otherwise use the platform's version history (Lovable, Bolt and Replit all keep versions). Tell the user the name of the save point.
2. Change one thing at a time. One feature per session when possible.
3. After the change, run the short checks below and report each one as checked or not checked.

Short checks after a change to login:
- A new user can sign up and log in.
- A logged-out visitor cannot see pages meant for logged-in users.
- Logging out really logs out.

Short checks after a change to payment:
- The price comes from the server, not from the page.
- A test payment succeeds, and a cancelled payment does not unlock anything.

Short checks after a change to users' data:
- User A cannot see or change user B's data (use two test accounts).

## Second failed fix (moment 5)
When the same problem is still there after two attempts:
1. Stop. Do not try a third variation of the same idea.
2. Tell the user, in one sentence, your current guess about the cause and what you are unsure of.
3. Go back to the last save point if the attempts changed working code.
4. Offer the next step: a smaller change that tests the guess, or a fresh session that starts from PROJECT.md (long conversations make the AI forget earlier decisions).
5. Write what you learned under "Remember" in PROJECT.md.

## Keep changes small
- Do not rewrite a working file to change one part of it.
- If a fix needs changes in more than three files, say so before starting and explain why.
See https://new.example.org for more.
