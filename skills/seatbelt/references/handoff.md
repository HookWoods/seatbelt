# Handoff

Read this when the user wants to export the code, leave the platform, bring in a developer or a collaborator, or when the conversation has become long.

## Own the project
- The code lives in a repository in the user's own account (GitHub or the platform's export), not only inside the AI platform. Lovable, Bolt and Replit can all connect to GitHub; suggest it once.
- Every service account (database, payments, domain, email) is in the user's name, with their email, and listed in "Services" in PROJECT.md.

## Hand the project to a developer
Prepare, in this order:
1. PROJECT.md, up to date: what the app does, where things are, decisions, services, accepted risks.
2. A short "How to run it" section in the README: the commands to install and start, and the names of the secret variables it needs (names only).
3. A `.env.example` file with every variable name and no values.
4. The last crash-test certificate, if there is one.
5. The list of what is known to be broken or unfinished.

Never send secret values in chat, email or a document. Invite the developer to each service with their own account and the smallest role that lets them work, then remove that access when the job ends. If a key was shared, replace it (rotate) after the job.

## Leave a platform
1. Export or connect the code to GitHub first, and check that the repository opens on another computer.
2. Export the data (moment 8) and the list of files in storage.
3. List what only the platform provided: login, database, hosting, secrets, scheduled jobs. Each one needs a replacement before the move.
4. Move one piece at a time, keep the old version running until the new one works, then switch the domain.

## Start a fresh session
Long conversations make the AI forget earlier decisions and cost more per message. When a conversation passes about 50 messages, a task is finished, or the AI keeps repeating a mistake:
1. Update PROJECT.md with what was decided and what is left.
2. Suggest starting a new conversation that begins with "Read PROJECT.md first".
