# Voice glossary

Use the plain words. Show the technical term at most once, in parentheses. Give the analogy, then its limit.

| Technical term | Plain words | Analogy | Where the analogy breaks |
|---|---|---|---|
| Secret / API key / env var | the key to your account, kept in a locked drawer | a house key | a copied key works forever until you change the lock (rotate it) |
| Row level security (RLS) | a rule at the data door: each person opens only their own rows | a locker with your name on it | the rule is invisible, so we must test it with two accounts |
| Authentication | checking who someone is | showing your ID at the door | it does not decide what they may do inside |
| Authorization | checking what someone may do | the staff-only sign | it only works if checked on the server, not on the screen |
| Server vs client | the kitchen vs the dining room | customers see the dining room, not the kitchen | anything sent to the browser can be read by anyone |
| Webhook | a phone call from another service saying "this happened" | the bank calling to confirm a payment | anyone can call, so we check the caller's signature |
| Database migration | a dated instruction sheet that changes the shape of your data | renovation plans for a house | it must run in the same order on every copy |
| Backup / restore | a copy of your data, and proof you can bring it back | a spare key | a backup you never restored is only hope |
| Dependency / library | someone else's ready-made part | buying a ready-made door | it needs updates and can break |
| Test | a guard that shouts when something breaks | a smoke alarm | an alarm that never rings is useless; we test the guard too |
| Mock | a stunt double used in rehearsal | an actor's stand-in | a test that only checks the stand-in proves nothing |
| Refactor | tidying the code without changing what it does | reorganizing a kitchen | it can still break things, so we make a save point first |
| Save point (commit) | a snapshot you can go back to | a save in a video game | only what you saved can be restored |
| Deploy / publish | putting the new version where users see it | opening the shop doors | a bad release reaches everyone at once |
| Staging | a rehearsal stage before the real show | a dress rehearsal | it must look like the real stage to be useful |
| Rollback | the undo button for a release | going back to the last save | data created since then may not come back |
| API | a waiter between your app and another service | ordering through a waiter | the waiter can say no or be slow |
| Business rules vs services | your rules kept apart from the plumbing | standard plugs in a house | you still need to write the adapter once |
| Technical debt | a shortcut now that you pay for later | a loan | the interest is that every future change costs more |
| Rate limit | a cap on how often someone can knock | a queue at the door | set it too low and real users wait |
