# Check 3: Server doors

Plain words: "the kitchen must check every order. Hiding a button in the dining room does not stop anyone from walking into the kitchen."

## List the server code
Server code is code the browser never receives: Supabase Edge Functions (`supabase/functions/*/index.ts`), API routes (`api/`, `app/api/`, `pages/api/`, `server/`), and database functions called with `.rpc(`. List each one and what it does: read data, change data, send email, spend money, or act as an admin.

If the app has no server code at all, write `n/a` with "no server functions: the data door (check 2) is the only door". `n/a` counts as passed.

## For each server function that reads or changes users' data
1. **Who is calling?** It reads the caller's login from the request (Supabase: `supabase.auth.getUser(token)` with the `Authorization` header) and refuses when there is none. A function that only checks that a key is present is not enough: the public anon key passes that test.
2. **May they do this?** It checks that the caller owns the record, or has the role the action needs. The role comes from the database or the login provider, never from the request body, a header the browser sets, or an email address written in the code.
3. **Is the input checked?** Required fields, types and sizes are checked before use. An id from the request is checked against the caller's own records.
4. **What comes back on error?** A plain message, never a stack trace, an SQL error or another user's data.

Watch for these:
- A function that builds a client with the service_role key and acts on an id taken from the request without steps 1 and 2: anyone can act on anyone.
- An admin page protected only in the browser (`if (user.email === ...)`, `isAdmin` in local storage) while the server function it calls checks nothing.
- `verify_jwt = false` in `supabase/config.toml` for a function that touches users' data.

## Evidence
`file:line` of the function and of the missing or present check.

## Fix prompt example
"In supabase/functions/admin-delete-user/index.ts, read the caller's login from the Authorization header with supabase.auth.getUser, look up is_admin for that user in the profiles table, and return 403 unless it is true. Check that userId is a uuid. Remove the email check from src/pages/Admin.jsx and rely on the server answer instead."
