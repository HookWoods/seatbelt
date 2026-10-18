# Security

Seatbelt is plain Markdown that AI agents read and follow. It runs no code on users' machines. The security risks are in what the instructions make an agent do.

## What to report privately

- Skill text that could make an agent leak, print or store a secret, weaken a database rule, or act without telling the user.
- A way to slip hidden instructions or new outbound reach past `npm run guard`.
- A crash-test check that grades a known-dangerous setup as passing.

Use GitHub's **Report a vulnerability** button on the repository's **Security** tab, which keeps the report private until a fix is published. Please do not open a public issue for these.

## What to report in public

Wrong advice that is not dangerous, confusing wording, or a platform where Seatbelt does not install. Use the issue templates.

## If you found a leaked key in someone's report

Do not copy it anywhere. Tell the maintainers privately so the post can be edited, and the person can replace the key.
