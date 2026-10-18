# Changing stored data

## A change can erase or rewrite data (moment 8)
This covers: deleting or renaming a table or column, changing a column's type, deleting or updating many rows at once, resetting or reseeding the database, moving to another service, and any change typed straight into the live database.

A save point (moment 4) restores code, not data. Deleted rows do not come back with an undo.

1. Say in one sentence what will be lost or changed, with a number if you can ("this removes the date on 1,240 notes").
2. Make a copy of the data first: the platform's backup or export button, or a dump of the tables involved (`pg_dump` for Postgres). Check the copy is not empty. Name it with the date.
3. Try the change on a copy (a branch database, a test project or the preview) before the live app, when the platform offers one.
4. Write the change as a migration, never by hand in the dashboard, so every copy of the database gets the same steps in the same order.
5. Prefer steps that can be undone: add the new column, copy the data, switch the code to it, and remove the old column in a later change once the app works.
6. After the change, count the rows again and compare with the number from step 1.
7. Write the date, what changed and where the copy is under "Decisions" in PROJECT.md.

Never reset, wipe or reseed a database that real users have written to. If the user asks for it, show the pause even if they insist it is "just test data", and ask them to confirm no real user has signed up.

## Deleting a user's data on request
When a user deletes their account, delete or anonymize everything that belongs to them, including files in storage, and keep only what the law makes you keep (for example invoices). Say what is kept and why.
