# Tests that matter (moment 7)

A test is a guard that shouts when something breaks. More guards are not better; guards that never shout are noise.

## What to test in a small app
1. Login: sign up, log in, log out, a logged-out visitor is kept out.
2. Payment: the price comes from the server; a failed payment unlocks nothing.
3. Data door: the right user can read and change their data; another user cannot.
4. One or two full journeys of the main feature, from start to finish.

About 15 tests is enough for a small app. If you are about to write more, pause and explain why.

## Rules
- One test per behavior the user cares about, not one test per function. Helpers, getters, setters and constructors are covered by the behavior tests that use them.
- Test-first workflows (TDD) apply to these behaviors only: write one failing test for the behavior you are adding, make it pass, stop. Do not write a test for every small piece along the way.
- Several inputs for the same behavior go in one table-driven test, and only when each input is a real edge case (empty, too long, wrong user, expired). Not ten variations of a valid email.
- No snapshot tests of whole pages, and no tests that only check a framework or library works.
- Test real behavior through the app's own code. Do not replace the project's own code with fake stand-ins (mocks); fakes are acceptable only for outside services that cost money or send real messages.
- Never change a test just to make it pass. If a test is wrong, say why before changing it.
- Delete tests that check nothing (for example, a test that only checks that a function exists).

## Flip test
For each new test, invert one condition in the code it covers (for example change `===` to `!==`), run the tests, and confirm at least one fails. Then undo the inversion. A test that still passes is not guarding anything: fix it or delete it. Tell the user how many tests passed the flip test.
