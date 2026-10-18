# Next.js footguns

Detect: `next` in `package.json` dependencies, `next.config.*`, an `app/` or `pages/` folder.

## Secrets (check 1)
- Any variable starting with `NEXT_PUBLIC_` is copied into the browser code at build time. A secret with that prefix is public, even if `.env` is not committed.
- Files that start with `"use client"`, and everything they import, are sent to the browser. A secret read there leaks, or is undefined and the AI "fixes" it by adding `NEXT_PUBLIC_`.
- Server-only code should import `server-only` so a mistake fails the build instead of leaking.

## Server doors (check 3)
- Every function in a file marked `"use server"` (a server action) is a public endpoint that anyone can call with any arguments, even if no button shows it. Each one must check the session and ownership itself.
- Route handlers (`app/api/**/route.ts`, `pages/api/**`) must check the session too.
- Protecting pages only in `middleware.ts` is not enough: middleware can be skipped for some requests, and it does not protect server actions or route handlers on its own. Check the session again where the data is read or changed.
- Queries that take an id from the request must also match the owner: `where: { id, userId: session.user.id }`, not `where: { id }`.
- Pages and route handlers that return users' data must not be cached and shared between users (watch for `force-static`, `revalidate` or a shared fetch cache on user-specific data).

## Errors (check 3)
- In production, error pages should not show stack traces or database messages. Check custom `error.tsx` files and API responses that return `error.message`.
