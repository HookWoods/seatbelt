# Certificate template

Fill this in, in the user's language. Keep the table exactly as shaped (one row per check, grade alone in its cell).

```
# crash-test certificate: <app name>, <date>
⛔ Do not launch

| # | Check | Grade | Evidence |
|---|---|---|---|
| 1 | Secrets | F | src/lib/supabase.js:4 (Supabase admin key in browser code) |
| 2 | Data door | ? | no migrations in the repo, SQL results not pasted |
| 3 | Server doors | D | supabase/functions/export/index.ts:12 (any logged-in user can export anyone's notes) |
| 4 | Payments | n/a | no payment code found |
| 5 | Backups | ? | no backup job in the repo, dashboard not pasted |
| 6 | Safety net | D | no test covers login or access to notes |
| 7 | Privacy | C | src/pages/Privacy.jsx exists; account deletion leaves files in storage |

Result: 1/7 checks passed (n/a counts as passed; "?" does not)
Not checked: what lives only in the dashboard (data door rules, backups).

## In plain words
<One sentence per check, worst first.>

## The 3 cheapest fixes
1. <Ready-to-paste prompt for the builder> (<time estimate>)
2. ...
3. ...
```

Rules: the grade means what could be verified; never use the word "secure"; "?" is never a pass.
