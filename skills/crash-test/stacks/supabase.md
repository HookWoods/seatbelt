# Supabase footguns

- RLS off on a table: anyone with the public anon key can read and write it.
- RLS on with zero policies: the app cannot read the table (the data is blocked, not leaked); the AI often "fixes" this with `using (true)`, which opens it to everyone.
- `using (true)` or `with check (true)` on users' data: every visitor or every logged-in user can read or write all rows.
- The service_role key in the browser: it bypasses every rule. It must only be used in server code (Edge Functions).
- Public storage buckets holding users' files.
- Views and `security definer` functions run with the owner's rights and can bypass RLS.
- Update policies that check `using` but not `with check`: a user can move a row to another user.
- Edge Functions read secrets with `Deno.env.get('NAME')`; client code must never see them.
