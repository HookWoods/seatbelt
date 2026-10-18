# Security while building

## A secret appears (moment 3)
A secret is anything that gives access: API keys, passwords, tokens, private keys, database URLs with a password.
1. Do not repeat the value. Refer to it by name ("your Stripe secret key").
2. Move it to the platform's secret variables (Lovable: Cloud > Secrets; Bolt: project settings > environment variables; Replit: Secrets tool; local projects: a `.env` file listed in `.gitignore`).
3. Code reads it only on the server side. A secret behind a browser-visible prefix (`VITE_`, `NEXT_PUBLIC_`, `EXPO_PUBLIC_`, `REACT_APP_`) is public, even if `.env` is not committed.
4. If the secret was ever pasted in chat, committed, or shipped to the browser, tell the user to rotate it: create a new key in the provider's dashboard, put it in the secret variables, then delete the old one. Do not guess menu names or click-paths: if you are not sure of the exact path, say "open your <provider> dashboard and look for API keys", and link the provider's official docs page on key rotation if you know it.
   - Supabase: rotating a legacy JWT secret also changes the anon key, which logs everyone out and breaks the app until the new anon key is in place. Warn the user before they do it; with the new `sb_secret_` keys, only the secret key changes.
5. Add its name and storage place under "Secrets" in PROJECT.md.

Public by design (not secrets): the Supabase anon or publishable key, the Stripe publishable key (`pk_...`), the Firebase web config. They are safe in the browser only if the data door rules are correct.

## Every new table
- Turn on the data door rules (RLS) when the table is created, and add rules that compare the logged-in user with the row's owner. Never use a rule that lets everyone through (`using (true)` or `with check (true)`) on users' data.

## Every permission check
- Check permissions on the server. Hiding a button on the screen does not stop anyone.

## Payments
- Never trust a price, amount or plan sent by the browser. Look it up on the server.
- Verify the payment provider's signature on incoming payment notifications (webhooks).

## Login
- Use the login of the platform or the database provider. Never write your own password storage.
- Turn on email confirmation for sign-ups, and check that the "forgot password" link works and expires.
- Give the same message for "wrong password" and "no account with this email", so nobody can test which emails have accounts.
- Pages for logged-in users check the login on the server too, not only by hiding the page.

## Admin pages
- An admin page checks on the server that the person is an admin, on every action, not only when the page opens.
- Store who is an admin in the database or the login provider, never in the browser (local storage, a cookie the page can change, or a hidden field).
- Never decide "admin" from an email address typed in the code.

## Files users upload
- Accept only the types the app needs (for example images: jpg, png, webp) and cap the size (for example 10 MB).
- Store uploads in private storage by default. Make a file public only when everyone is meant to see it, like a profile photo.
- Give stored files a new random name. Never use the name the user sent.

## Abuse
- Limit how often one person can sign up, log in, send a form, or use a paid feature (a rate limit). Start with about 5 tries a minute for login and 20 uses a day for a paid feature, then adjust.
- Add a bot check (captcha) to public forms if spam arrives.

## Text users write
- Show what users write as text, never as page code. Avoid inserting raw HTML (`innerHTML`, `dangerouslySetInnerHTML`, `v-html`); if formatting is needed, use a library that cleans it.
- Never put user text straight into a database query. Use the provider's query functions or parameters.
- After login or a form, only send people to pages of your own app, never to an address taken from the link.

## AI features inside the app
- Treat what users write, and documents they upload, as data for the model, not as instructions. A user can write text that tries to change what the model does.
- Never put a secret or another user's data in the model's instructions.
- If the model can act (send an email, change data, spend money), make the server check each action against the user's permissions, and ask the user to confirm actions that cannot be undone.

## Stop secrets before they leave the computer
Two guards. Set up both where they apply, and tell the user in one line what you turned on.

**1. The code host's secret protection.** Most places that store code can refuse a push that contains a known key. The feature has a different name on each host: "push protection" on GitHub, "secret push protection" on GitLab, "secret scanning" on Bitbucket, "push protection" in Azure DevOps Advanced Security. Other hosts may have their own, or none.
- If you can search the web, look up the host's current documentation for the exact steps, and check whether the user's plan includes it and whether it blocks the push or only warns. Give the user those steps with the source.
- If you cannot search, tell the user the feature's name and ask them to look for it in the repository's security settings. Do not guess menu names.
- If the host has no such feature, or the user's plan does not include it, say so. The local check below still works.
- This also covers Lovable, Bolt and Replit when they sync to a code host, because the push is checked on the host's side.

**2. A local check before each commit.** When the project is a git folder on a computer where you can run commands:
1. Look for an existing hook setup first: a `.husky/` or `.githooks/` folder, `lefthook.yml`, `.pre-commit-config.yaml`, or a `core.hooksPath` already set. If there is one, add the check to it and do not replace it.
2. Otherwise copy `templates/pre-commit` to `.githooks/pre-commit` in the project, make it executable (`chmod +x .githooks/pre-commit` on Mac and Linux), and run `git config core.hooksPath .githooks`.
3. Commit the hook so it travels with the project, and add a line under "Decisions" in PROJECT.md.

If the check stops a commit, move the secret to the secret variables (moment 3). Never get past the check with `--no-verify`, by deleting the hook or by changing `core.hooksPath`. If the user wants it off, they decide, and you note it under "Accepted risks".
