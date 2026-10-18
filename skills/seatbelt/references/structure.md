# Code shape

These rules apply to every language and framework. Follow them without asking. Only moment 6 (a file that grows too big, or a duplicate) gets a pause.

When you explain a rule to the user, use the plain reason given after each one, not the rule's technical name.

## Size
- A function stays under about 40 lines. Longer means it does more than one thing; split it. *Plain reason: small pieces are easier to fix without breaking the rest.*
- A file stays under about 400 lines. When a file passes that, pause (moment 6) and offer to split it by job (for example "the payment page" and "the payment rules"). *Plain reason: the AI loses track of very long files and starts deleting things by accident.*
- One file, one job. A class or module has one reason to change.
- No more than three levels of nesting (an `if` inside a loop inside an `if` is the limit). Return early instead.
- A function takes four parameters at most. More than that, pass one object with named fields.

## No boilerplate
Write only what this feature needs today.
- No interface or base class with one implementation, no factory that builds one thing, no "manager" or "service" class that only forwards calls, no config option for a value that never changes.
- No folders, files, layers or helpers created "for later". Later can create them.
- No wrapper around a library that adds nothing.
- Prefer, in order: what already exists in this project, the language's standard library, the platform's built-in feature (a native date input, a database constraint, a CSS rule), a dependency already installed. Write new code last.
- Never add a dependency for something a few lines can do. Before adding one, check it is maintained and widely used, and tell the user what it is for.

*Plain reason: every extra piece is something that can break and that someone has to read.*

## Reuse before you create
- Before writing a function, component or style, search the project for one that already does it. Use it, or extend it.
- If you are about to write the same logic a third time, move it to one shared place and use it from all three.
- Never keep two versions of the same thing that "work slightly differently". Pick one, migrate the callers, delete the other. A duplicate you spot counts as moment 6.

*Plain reason: twelve copies of the same thing means twelve places to fix the same bug.*

## Clean as you go
- Delete dead code, unused imports, unused files, commented-out code and debug prints in the code you touch.
- Comments explain **why**, never what the next line does. No comment that repeats the code.
- Names say what the thing is or does (`unpaidInvoices`, not `data2`). Use the same word for the same thing everywhere.
- Handle errors where data enters the app: user input, network calls, files, payments. Show the user a clear message and keep the details in the logs. Never silence an error with an empty catch.
- Keep constants in one place. Keep secrets in the secret variables, never in code.

## Errors and input
- Never hide a failure behind a fake default (`return 0`, `return []`, a "fallback" value that looks like real data). Fail loudly, or show the user an error. *Plain reason: otherwise the app looks fine while it shows wrong numbers.*
- Check everything that comes from outside (forms, API bodies, URL parameters, webhooks, environment variables at startup) with one schema where it enters, then use the checked value everywhere after. *Plain reason: bad input stops at the door with a clear message instead of quietly corrupting your data.*
- Every network call has a timeout. Retry only calls that are safe to repeat, with a cap and a pause between tries. No loop or polling without an exit. *Plain reason: one slow service should not freeze your whole app.*
- Cap what users can send: a maximum upload size and a list of allowed file types. Resize or compress images before storing or showing them. *Plain reason: one 40 MB photo should not crash the server or slow the site for everyone.*

## Data
- Never run a database query inside a loop; fetch what you need in one query. Every list query has a limit or pagination, asks only for the columns it uses, and has an index on the columns it filters or sorts by. *Plain reason: it is fast with 10 rows and falls over with 10,000.*
- Store money in cents (whole numbers) or a decimal type, never a floating-point number. Store times in UTC and convert to the user's time zone only when you display them. *Plain reason: otherwise 0.1 + 0.2 is not 0.3, and appointments move by hours.*
- Change the database only through migration files kept in the project, never by hand in a dashboard, and never edit a migration that has already run. *Plain reason: you can rebuild or roll back your database from the project alone.*

## Consistency
- Every API route returns one response shape and one error shape. Use one async style (async/await) everywhere.
- Load server data through one mechanism (one data-fetching library or one API module). Keep state as close as possible to where it is used, and do not pass the same value down more than two levels of components. *Plain reason: otherwise the same data lives in five places and they drift apart.*

## Screens
- Every screen that loads data shows three states: loading, empty and error. *Plain reason: otherwise users see a blank page or a crash on the first slow connection.*
- Basic accessibility: a label on every button that only has an icon, alt text on every meaningful image, a visible focus outline, and everything reachable with the keyboard. *Plain reason: otherwise some of your users simply cannot use the app.*

## Project hygiene
- Before installing a package, check it exists, is the one you mean, and is maintained: AI tools sometimes invent package names, and attackers register them. Commit the lockfile and keep versions pinned.
- `.gitignore` covers dependencies, build output, `.env` files and local databases. Keep an `.env.example` with the variable names, and a README that says how to install, configure and run the app.
- Use one logger instead of scattered print statements, and never log passwords, tokens, emails or other personal data. *Plain reason: logs get copied and shared, and personal data leaks with them.*
- Never weaken a check to make something pass: no `any`, `@ts-ignore`, `# type: ignore` or lint-disable comment to silence an error, and never delete or loosen a test, a validation or a safety check. Keep each change to one purpose and leave unrelated files alone. *Plain reason: this is how "it works" turns into hidden damage.*

## Layout
- Keep the screens (what the user sees), the business rules (what the app decides) and the connections to outside services (database, payments, email) in separate places.
- The business rules never talk to an outside service directly; they go through one small file per service. *Plain reason: like standard plugs in a house, you can change the payment or email provider without rewiring everything.*
- Follow the folder layout the project already uses. If there is none, use the framework's standard layout and do not invent a new one.

## Tools that check for you
Use the project's tools. If the project has none, use the standard ones for its language and say so.

| Language | Formatter | Linter | Type checker |
|---|---|---|---|
| JavaScript / TypeScript | Prettier | ESLint | TypeScript (`strict`) |
| Python | Ruff format | Ruff | mypy or Pyright |
| Go | gofmt | go vet | the compiler |
| Rust | rustfmt | Clippy | the compiler |
| PHP | PHP-CS-Fixer | PHPStan | PHPStan |
| Ruby | RuboCop | RuboCop | Sorbet (if used) |
| Java / Kotlin | the IDE formatter or ktlint | the build's lint step | the compiler |

Run the formatter, the linter and the type checker before saying a change is done. Fix what they report in the code you touched.

## Before you say done
Re-read your own diff and remove what does not belong:
1. Code that is not used, or that only exists for a future feature.
2. Duplicates of something that already existed.
3. Comments that narrate the code.
4. Files or functions over the size limits above.
5. Tests that cannot fail (see `tests.md`).

Then tell the user, in one line, what you removed.
