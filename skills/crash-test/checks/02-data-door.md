# Check 2: Data door

Plain words: "a rule at the data door: each user opens only their own rows. The rule is invisible, so we check that it works, not only that it exists."

This sheet uses Supabase words. For Firebase, the data door is the security rules: follow `stacks/firebase.md` and grade with the same rubric.

## List the tables the app uses
Search the code for every `.from('<table>')` call (and `supabase.from("<table>")`). These are the tables to check.

## From the repo
Read every SQL file under `supabase/migrations/` (and any `schema.sql`). For each table that stores users' data:
1. Is `alter table ... enable row level security` present?
2. Is there a policy for each action the app uses (select, insert, update, delete)?
3. Does each policy compare `auth.uid()` with the owner column (`user_id`, `owner_id`, `profile_id`)?
4. Flag `using (true)`, `with check (true)`, policies granted to `anon` on users' data, and tables without RLS.

If a table the app uses has no `create table` in the migrations, it was made in the dashboard: use the paste request below for it.
A grade based only on migrations must say "from repo files; the live database may differ".

## When the rules are not in the repo
The rules live only in the Supabase dashboard. Ask the user once:

"Open your Supabase project, go to SQL Editor, paste this, press Run, and paste the result here:"

```sql
select c.relname as table_name, c.relrowsecurity as rls_on, p.policyname, p.cmd, p.roles, p.qual, p.with_check
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
left join pg_policies p on p.schemaname = n.nspname and p.tablename = c.relname
where n.nspname = 'public' and c.relkind = 'r'
order by 1;
```

This single query lists every table, including tables with RLS off and no policy (the SQL Editor shows only the last result, so never split it in two).

Grade from the pasted result. If nothing is pasted, grade "?" and say the data door was not checked.

## Two-account test (recommended to the user)
Create two test accounts. Log in as the first and create a record. Log in as the second and try to open the first account's record. If it opens, the door is broken.

## Evidence
`file:line` of the table or policy, or "from pasted SQL".

## Fix prompt example
"Write a new migration for the notes table: enable row level security, drop the policy that uses `using (true)`, and add one policy per action (select, insert, update, delete) that only allows rows where auth.uid() equals user_id. Then tell me how to test it with two accounts."
