# Check 1: Secrets

Plain words: "the keys to your accounts must stay in a locked drawer, never in the code that anyone can see".

## Where to look
1. Search every committed file (client and server code, config, env files) for the patterns below. Then decide where each hit ends up.
2. Client code is what the browser receives: `src/`, `app/`, `pages/`, `components/`, `public/`, and any file imported by the browser.
3. Environment variables with a browser-visible prefix: `VITE_`, `NEXT_PUBLIC_`, `EXPO_PUBLIC_`, `REACT_APP_`. A secret behind these prefixes is public even if `.env` is not committed.
4. Committed env files: `.env`, `.env.local`, `.env.production`. Check whether `.gitignore` lists them. A file that is not ignored is committed; a file that is ignored is not a leak.

## Patterns that are secrets
- `sk_live_`, `sk_test_` (Stripe secret keys), `rk_live_`
- `sk-` followed by letters or digits (OpenAI and similar)
- `sb_secret_` (new Supabase secret key)
- `service_role` (Supabase admin key), or a JWT whose payload has the role `service_role`. Supabase keys starting with `eyJ` are JWTs: decode the middle part (between the two dots, base64) and read `role`. `anon` is public; `service_role` is a secret. Never decide from a comment or a variable name alone.
- `AKIA` (AWS), `ghp_` / `github_pat_` (GitHub), `xoxb-` (Slack), `-----BEGIN PRIVATE KEY-----`
- Database URLs with a password: `postgres://user:password@`
- Variable names containing `SECRET`, `PRIVATE`, `PASSWORD`, `TOKEN` or `API_KEY` used in client code

## Public by design (do not flag)
- Supabase anon key (a JWT whose role is `anon`), publishable key (`sb_publishable_`) and project URL; Lovable often hardcodes them in `src/integrations/supabase/client.ts`, which is fine
- Stripe publishable key `pk_live_` / `pk_test_`
- Firebase web config (`apiKey`, `authDomain`, `projectId`)
Say that these are public by design and that they are safe only if check 2 passes.

## Evidence
`file:line` and the kind of secret. Never the value.

## Fix prompt example
"Move the OpenAI call from src/lib/ai.js into a server function that reads OPENAI_API_KEY from the project secrets, call that function from the page instead, and remove VITE_OPENAI_API_KEY. Then remind me to create a new OpenAI key and delete the old one."
