# Rubric

A check passes at A or B. C to F fail. "?" means could not verify and is never a pass.

When a finding matches more than one grade, give the lowest grade that matches. For example, an insert rule with `with check (true)` on users' data matches C, D and F: grade it F.

When you cannot see the value, treat it as live (for example when only the variable name is in the repo).

`n/a` means the check does not apply because the app has nothing of that kind (no server functions, no payments). Say why in the evidence. `n/a` counts as passed.

## Check 1: Secrets
- A: no secret found in code, in files sent to the browser, or in committed files; secrets are read only on the server; `.env` is in `.gitignore`.
- B: no live secret exposed, but a minor hygiene issue (for example no `.env.example`, or a test-mode key in a committed file that is not shipped to the browser).
- C: a test-mode secret is shipped to the browser.
- D: a live secret is in a committed file that is not shipped to the browser. An env file that `.gitignore` does not list is committed: if it holds a secret variable, grade D at best, even when the value looks empty or fake.
- F: a live secret is shipped to the browser (hardcoded in client code or behind `VITE_`, `NEXT_PUBLIC_`, `EXPO_PUBLIC_`, `REACT_APP_`), or a Supabase service_role key is anywhere in client code.
- ?: the project files are not available.

## Check 2: Data door
- A: every table with users' data has RLS on, with policies for each action that compare `auth.uid()` with the owner column; verified from migrations or pasted SQL.
- B: as A, but one non-sensitive table (public content) is readable by everyone on purpose, and the user confirmed it.
- C: RLS is on but one action (insert, update or delete) has no owner check on a table with users' data.
- D: a policy lets every logged-in user read or change other users' rows (Firebase: `if request.auth != null` on users' data).
- F: RLS is off on a table with users' data, or a policy uses `using (true)` / `with check (true)` for users' data, or anonymous visitors can read users' data (Firebase: `if true`, or test-mode rules that open the data until a date).
- ?: no migrations in the repo, or a table the app uses has no migration, and the user did not paste the SQL results.

## Check 3: Server doors
- A: every server function that reads or changes users' data checks the caller's login, checks that they may act on that record (role from the database or login provider), validates its input, and returns plain errors.
- B: as A, with one minor gap that exposes no data (for example a costly function with no limit per user, or a vague error message).
- C: login and permission are checked, but input is not (no type or size checks on data that gets written), or errors return internal details (stack traces, SQL errors).
- D: the function checks that someone is logged in but not that they may act on that record, so any logged-in user can act on others' records.
- F: a function that reads or changes users' data or performs an admin action does not check the caller's login, or trusts a role, user id or email sent by the browser, or an admin action is protected only in the browser.
- n/a: no server functions; the data door (check 2) is the only door.
- ?: server code is referenced but not in the repo.

## Check 4: Payments
- A: price from the server, webhook signature verified, access granted only by the server after payment, the same event cannot credit twice, and cancel or refund removes what it unlocked.
- B: as A, with a gap that cannot unlock anything without paying: the same-event or cancel and refund handling written down as a known limit, or a robustness issue such as an event marked handled before the update finishes.
- C: as A, but the same-event or cancel and refund handling is missing and not written down.
- D: the webhook is verified, but access is also granted before the server confirms payment (for example on the success page).
- F: the price, amount or plan comes from the browser, or the webhook is trusted without verifying its signature, or access is granted only by the browser or a URL parameter.
- n/a: the app takes no payments.
- ?: payment code is referenced but not in the repo.

## Check 5: Backups
- A: automatic backups exist, and a restore was tested and recorded in the last 3 months.
- B: automatic backups exist and a restore was tested once, longer ago or without a date.
- C: automatic backups exist, but no restore was ever tested.
- D: the user confirmed there are no backups, or the plan has none and nothing exports the data.
- F: a script, deploy step or seed file can reset, truncate or drop the live database in normal use.
- ?: no backup evidence in the repo and nothing pasted.

## Check 6: Safety net
- A: tests that can fail cover login, payment (if any) and access to users' data; they run automatically on every change; errors in the live app reach a person.
- B: as A, but no error alerts were found.
- C: tests that can fail cover those paths, but nothing runs them automatically.
- D: no test covers login, payment or access to users' data.
- F: the tests that claim to cover those paths cannot fail (they check nothing), or the workflow hides test failures.
- ?: never; the files are always available to this check.

## Check 7: Privacy
- A: a privacy page says what is kept, why, for how long and who it is shared with; account deletion removes rows and files; logs carry no personal data; no non-essential trackers load before consent.
- B: as A, with one gap that exposes no data (for example no retention period on the privacy page).
- C: the privacy page and account deletion exist, but deletion leaves data behind, or trackers load before consent.
- D: the app collects personal data and has no privacy page, or no way to delete an account.
- F: passwords, tokens, card numbers or health data are written to logs or sent to analytics, or users' data is sent to another service that the privacy page does not mention.
- ?: never for code; say which parts were not visible.
