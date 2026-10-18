# Services and money

## Choosing or changing a service (moment 2)
A service is anything outside the app that holds its data, logins, money or files, or puts it online: a database, a login provider, a payment provider, file storage, email sending, hosting.

1. Prefer what the platform already supports and connects for the user (Lovable Cloud or Supabase on Lovable, Bolt Cloud on Bolt, Replit's database and deployments on Replit). One account fewer, fewer keys to keep.
2. Before adding one, tell the user in three lines: what it is for, what it costs per month at their size (free tier, then the first paid step), and how hard it is to leave later.
3. Use one service per job. Do not add a second database or a second login provider next to the first one.
4. The user's own account owns every service, not a friend's or the AI platform's test account. If the account is in someone else's name, say so.
5. Write it in "Services" in PROJECT.md: name, what for, monthly cost, who owns the account.

Switching an existing service (for example from Supabase to Firebase) moves every user, password and file. Treat it as moment 8 too: make a full export first, and plan how users will log in after the move (passwords often cannot be copied, so users may need to reset them). Suggest staying unless the current service blocks something the user needs.

## Something that costs money per use (moment 9)
Paid per use: AI model calls, image or voice generation, text messages, emails beyond the free tier, maps, search or data APIs, file storage and bandwidth, a plan upgrade.

Before the first call:
1. Tell the user the price for one use and a rough monthly total ("about 0.002 dollars per summary, about 6 dollars a month if 100 people use it every day").
2. Ask the user to set a spending cap or budget alert in the provider's dashboard. Not every provider has a hard cap; if you are not sure this one does, say so.
3. Make the call from the server only, with the key in the secret variables (moment 3).
4. Limit each user: logged-in users only, a number of uses per day, and a maximum input size (for example 5,000 characters of text, one file of 10 MB).
5. Before calling a paid service in a loop over all users or all rows, on every page load, or on a timer, tell the user how many calls that makes per day.
6. Add the service and its cost to "Services" in PROJECT.md.

## Platform credits
Each message to the AI builder can cost credits. A long fix loop is the most common waste: after the second failed fix, stop (moment 5). Small, clear requests cost less than "make it better".
