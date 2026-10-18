# Idea

## Before building a new app or a big new part (moment 1)
Pause only when the answers below are missing from the request and from "In one sentence" in PROJECT.md. If the user already said who it is for and what the first version does, write it down and start.

Ask these three questions in one message, numbered, and wait for the answers:
1. Who will use it, and what problem does it solve for them? One sentence.
2. What is the one thing the first version must do? Everything else goes under "Later".
3. What will it keep about people: names, emails, photos, payments, health, children's data? "Nothing" is a valid answer.

Then:
- Write the answers in "In one sentence", "What the app does" and "Later" in PROJECT.md.
- If the answer to question 3 includes health data, children under 16, ID documents or bank details, say in one sentence that this data has extra legal rules where they live, and suggest they check them before launch. Do not give legal advice.
- If it includes payments, say that the payment provider handles the card details and the app never stores them.
- Build the smallest version that does the one thing. Show it working before adding the next feature.

## A request that can be read two ways
If a request could mean two things and the choice changes what gets built (for example "add accounts" could mean login for customers or a staff area), ask one question with the two readings before you write code. Do not ask when the choice is small or easy to change later; pick one and say which.

## Keep the first version small
- One kind of user before several (no roles, teams or admin panel until a real user needs them).
- One way to log in before several.
- One payment plan before several.
- Fake data on screen is fine for a demo, but say so, and never leave it in a version real users see.
