# Check 7: Privacy

Plain words: "say what you keep about people, keep no more than you need, and let them leave with their data gone."

This check looks for common problems in the files. It is not legal advice and does not prove the app follows any law.

## What to check
1. **What the app collects.** From the tables, forms and sign-up code: names, emails, photos, location, payments, health or children's data.
2. **Nothing sensitive in logs or analytics.** Search for `console.log`, `logger`, analytics and error-reporting calls that include a password, a token, a card number, or a whole user object. Logging a user's id is fine; logging their password never is.
3. **A privacy page.** A page or document that says what is kept, why, for how long, who it is shared with (hosting, payments, analytics, AI providers), and how to contact the owner.
4. **A way to leave.** Account deletion that removes the user's rows and files (storage), not only the login. What is kept on purpose (for example invoices) is listed on the privacy page.
5. **Trackers.** Analytics or ad scripts that load before the visitor agrees. If the app has visitors in Europe and these trackers are not strictly needed, that needs consent first.
6. **Data sent to other services.** Users' data sent to an AI provider, an email tool or analytics is named on the privacy page.

## Evidence
`file:line` of the sensitive log, the tracker, the privacy page and the deletion code (or "not found").

## Fix prompt example
"Remove the console.log in src/pages/Signup.jsx that prints the email and password. Add a privacy page that lists what the app keeps, why, for how long and how to ask for deletion, and link it in the footer. Add a delete-account server function that removes the user's notes, their files in storage, and then their login."
