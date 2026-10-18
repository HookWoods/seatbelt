# Check 5: Backups

Plain words: "a copy of your data, and proof that you can bring it back. A backup you never restored is only hope."

## From the repo
1. **Anything that can wipe the live data.** Search scripts and config (`package.json` scripts, deploy files, CI workflows, seed files) for commands that reset, truncate or drop tables and that point at the live database: `db reset --linked`, `truncate`, `drop table`, `delete from` without `where`, a seed script that uses the production URL. This is the most serious finding of this check.
2. **Automatic copies.** A scheduled job that exports the database (a CI workflow with a schedule running a dump, a backup service, a script on a timer), and where the copy goes.
3. **Proof of restore.** A note, document or PROJECT.md line that says when a backup was last restored into a test project, and whether it worked.
4. **Schema in the repo.** Migrations let the structure be rebuilt. They do not contain the data, so they are not a backup.

## From the dashboard
Backups often live only in the hosting dashboard, and some free plans have none. Ask the user once: "Open your database provider's backups page and tell me what it shows: scheduled backups with their dates, or a message that your plan has none." Do not guess menu names.

If nothing in the repo proves a backup and nothing is pasted, grade "?".

## Evidence
`file:line` of the dangerous command, the backup job or the restore note; or "from what you pasted".

## Fix prompt example
"Remove `db reset --linked` from the deploy script in package.json so deploys only apply new migrations. Then add a scheduled workflow that exports the database every night and keeps the last 14 copies, and write in PROJECT.md how to restore one into a test project."
