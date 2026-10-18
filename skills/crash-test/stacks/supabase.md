# Supabase footguns

- RLS off on a table: anyone with the public anon key can read and write it.
- RLS on with zero policies: the app cannot read the table (the data is blocked, not leaked); the AI often "fixes" this with `using (true)`, which opens it to everyone.
- `using (true)` or `with check (true)` on users' data: every visitor or every logged-in user can read or write all rows.
- The service_role key in the browser: it bypasses every rule. It must only be used in server code (Edge Functions).
- Public storage buckets holding users' files.
- Views and `security definer` functions run with the owner's rights and can bypass RLS.
- Update policies that check `using` but not `with check`: a user can move a row to another user.
- Edge Functions read secrets with `Deno.env.get('NAME')`; client code must never see them.
- `verify_jwt` (on by default for Edge Functions) accepts the public anon key, so it does not prove that a user is logged in. A function that touches users' data must call `supabase.auth.getUser(token)` with the request's `Authorization` header. `verify_jwt = false` in `supabase/config.toml` removes even that.
- A function that creates its client with the service_role key skips every data door rule, so it must do its own login and permission checks.
- `supabase db reset --linked` wipes the linked live database; it belongs nowhere in deploy or seed scripts.
- Backups depend on the plan: check what the project's backups page shows rather than assuming. Migrations rebuild the structure, not the data.
- Deleting a user from Authentication does not delete their rows or their files in Storage unless foreign keys use `on delete cascade` and the files are removed too.
