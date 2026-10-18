# Stripe footguns

Detect: `stripe` or `@stripe/stripe-js` in `package.json`, `new Stripe(`, `loadStripe(`, `checkout.sessions.create`, a webhook route.

## Keys (check 1)
- `pk_live_` and `pk_test_` (publishable) are public by design.
- `sk_live_` and `sk_test_` (secret), `rk_live_` (restricted) and `whsec_` (webhook signing secret) are secrets. They are read on the server only, never behind `NEXT_PUBLIC_`, `VITE_` or similar.
- Live and test keys must not be mixed: a live secret key with a test webhook secret (or the other way) means notifications fail or are skipped.

## Payments (check 4)
- **Prices:** create Checkout Sessions with a `price` id chosen on the server from a fixed list (for example a map from plan name to price id). A `price` id or amount sent by the browser lets a buyer pick a cheaper price.
- **Signature:** verify every webhook with `stripe.webhooks.constructEvent` (or `constructEventAsync`), the `stripe-signature` header and the signing secret. It needs the raw request body: in Next.js route handlers use `await req.text()`; in Express use `express.raw`. Parsing the JSON first breaks the check, and AI code often "fixes" that by removing the check. Grade F if the handler acts on an event without verifying it.
- **Paid, not just completed:** `checkout.session.completed` can arrive before the money does for some payment methods. Grant access when `payment_status` is `paid`, or on `checkout.session.async_payment_succeeded`.
- **Subscriptions:** handle `customer.subscription.deleted` and `invoice.payment_failed`, or access stays after the customer stops paying.
- **Same event twice:** Stripe can send an event more than once. Store handled event ids and skip repeats.
- **Who paid:** link the session to the user on the server (`client_reference_id` or `metadata` set when the session is created), never from a URL parameter on the success page.
- Card numbers never touch the app's server or database: Checkout or Elements handle them.
