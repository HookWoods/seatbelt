# Rubric

A check passes at A or B. C to F fail. "?" means could not verify and is never a pass.

When a finding matches more than one grade, give the lowest grade that matches. For example, an insert rule with `with check (true)` on users' data matches C, D and F: grade it F.

When you cannot see the value, treat it as live (for example when only the variable name is in the repo).

## Check 1: Secrets
- A: no secret found in code, in files sent to the browser, or in committed files; secrets are read only on the server; `.env` is in `.gitignore`.
- B: no live secret exposed, but a minor hygiene issue (for example no `.env.example`, or a test-mode key in a committed file that is not shipped to the browser).
- C: a test-mode secret is shipped to the browser.
- D: a live secret is in a committed file that is not shipped to the browser.
- F: a live secret is shipped to the browser (hardcoded in client code or behind `VITE_`, `NEXT_PUBLIC_`, `EXPO_PUBLIC_`, `REACT_APP_`), or a Supabase service_role key is anywhere in client code.
- ?: the project files are not available.

## Check 2: Data door
- A: every table with users' data has RLS on, with policies for each action that compare `auth.uid()` with the owner column; verified from migrations or pasted SQL.
- B: as A, but one non-sensitive table (public content) is readable by everyone on purpose, and the user confirmed it.
- C: RLS is on but one action (insert, update or delete) has no owner check on a table with users' data.
- D: a policy lets every logged-in user read or change other users' rows.
- F: RLS is off on a table with users' data, or a policy uses `using (true)` / `with check (true)` for users' data, or anonymous visitors can read users' data.
- ?: no migrations in the repo, or a table the app uses has no migration, and the user did not paste the SQL results.
