# Going live

## Before real users arrive (moment 10)
Real users arrive at the first publish to a public link, when a custom domain is connected, when the link is shared beyond friends who test, when payments switch from test mode to live mode, and when an app that was private opens sign-ups.

Run this list with the user. Report each line as done, not done, or not checked yet. Offer to run `crash-test` first if it is installed.

**Blockers (fix before launch)**
- No secret in the code, in the browser or in a committed file (moment 3).
- The code host's secret protection is on, and the local check before each commit is installed if the project uses git on a computer (`references/security.md`, "Stop secrets before they leave the computer").
- Every table with users' data has rules at the data door, tested with two accounts.
- Payments: prices come from the server, payment notifications are verified, and a test payment and a cancelled payment both behave correctly. Live keys are in the secret variables, test keys are gone.
- Every paid service has a spending cap or alert, and a limit per user (moment 9).
- Data that matters has an automatic backup, and someone has tried restoring it once.

**Before you tell many people**
- Sign-up checks the email address, and "forgot password" works.
- Error pages say what to do next, in plain words, and never show code or database messages.
- Someone is told when the app breaks: the platform's logs or an error alert that reaches the user's email.
- A privacy page says what the app keeps, why, for how long, and how to ask for deletion. If the app has users in Europe and uses cookies or trackers that are not strictly needed, it needs a consent banner. Say this as information, not legal advice.
- A way for users to contact a human.
- Test it on a phone, not only a computer.

**Domain**
- Connect the domain from the platform's own domain settings, and keep the domain in the user's name.
- Turn on HTTPS (most platforms do it by themselves; check the padlock).

## After launch
- Change one thing at a time, with a save point before each risky change.
- Keep a short changelog under "Decisions" in PROJECT.md: date and what changed.
- If a release breaks something, go back to the last working version first (rollback), then look for the cause.
- Run `crash-test` again after any change to login, payment or users' data.
