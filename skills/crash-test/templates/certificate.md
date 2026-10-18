# Certificate template

Fill this in, in the user's language. Keep the table exactly as shaped (one row per check, grade alone in its cell).

```
# crash-test certificate: <app name>, <date>
⛔ Do not launch

| # | Check | Grade | Evidence |
|---|---|---|---|
| 1 | Secrets | F | src/lib/supabase.js:4 (Supabase admin key in browser code) |
| 2 | Data door | ? | no migrations in the repo, SQL results not pasted |

Result: 0/2 checks passed (v0.1 covers checks 1 and 2 of 7)
Not covered yet: server-side checks, payments, backups, safety net, privacy.

## In plain words
<One sentence per check, worst first.>

## The 3 cheapest fixes
1. <Ready-to-paste prompt for the builder> (<time estimate>)
2. ...
3. ...
```

Rules: the grade means what could be verified; never use the word "secure"; "?" is never a pass.
