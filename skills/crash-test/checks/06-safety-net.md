# Check 6: Safety net

Plain words: "smoke alarms in the rooms that matter, and someone who hears them. An alarm that never rings is useless."

## What to look for
1. **Tests on the paths that matter.** Look for tests that cover login, payment and access to users' data (for example: user B cannot read user A's notes; a cancelled payment unlocks nothing). Count those, not the total number of tests.
2. **Tests that can fail.** Read each test that claims to cover those paths. A test with no real check (`expect(true)`, an empty body, only a snapshot, or a mock that replaces the thing under test) cannot fail, so it protects nothing.
3. **Something runs them.** A CI workflow (`.github/workflows/`, `.gitlab-ci.yml`, or the platform's checks) runs the tests on every change. A step that hides failures (`|| true`, `continue-on-error: true`, `--passWithNoTests` as the only test) does not count.
4. **Someone hears when the live app breaks.** An error reporting service, or logs or alerts that reach a person.

Do not reward a large number of tests. Five tests on the paths that matter beat two hundred on button colors.

## Evidence
`file:line` of the tests that matter, of a test that cannot fail, and of the workflow that runs them (or "no workflow found").

## Fix prompt example
"Delete src/__tests__/app.test.js, which checks nothing. Add one test that creates two users and checks that the second cannot read the first one's notes, and one that checks a logged-out visitor is sent to the login page. Add a GitHub workflow that runs npm test on every push and fails when a test fails."
