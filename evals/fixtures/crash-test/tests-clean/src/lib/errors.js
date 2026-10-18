import * as Sentry from '@sentry/react'

// Errors in the live app are sent to Sentry, which emails the owner.
Sentry.init({ dsn: import.meta.env.VITE_SENTRY_DSN })
