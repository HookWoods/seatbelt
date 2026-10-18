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
