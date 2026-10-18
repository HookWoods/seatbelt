# Check 4: Payments

Plain words: "the shop decides the price, not the customer, and the bank's phone call is checked before anything is unlocked."

## Find the payment code
Search for `stripe`, `checkout`, `paddle`, `lemonsqueezy`, `paypal`, `webhook`, `price`, `amount`, `plan`, `subscription`. If the app takes no payments, write `n/a` with "no payment code found". `n/a` counts as passed.

## What to check
1. **Price from the server.** The code that creates the payment takes the price from the server: a price id kept on the server, or a table the browser cannot change. Fail if `amount`, `unit_amount`, `price` or `plan` comes from the request body or the URL and is passed to the payment provider as is.
2. **Payment notifications are verified.** The webhook handler checks the provider's signature with a signing secret (Stripe: `constructEvent` or `constructEventAsync` with `STRIPE_WEBHOOK_SECRET`) before trusting the event. Fail if it parses the body and acts on it without that check.
3. **Access is granted by the server after payment.** The plan, credits or order status change in the webhook handler (or after the server confirms the payment), never on the success page, in the browser, or from a URL parameter like `?paid=true`.
4. **Same event twice.** Handling the same notification twice does not credit twice (the handler checks the event id or the order status first).
5. **Cancel and refund.** A cancelled or refunded payment removes what it unlocked, or the gap is written down as a known limit.
6. **Keys.** The secret key and the signing secret are read on the server only (check 1 covers leaks).

## Evidence
`file:line` of where the price is chosen, where the webhook is checked, and where access is granted.

## Fix prompt example
"In supabase/functions/create-checkout/index.ts, stop reading amount from the request. Accept only a plan name, look up its Stripe price id in a server-side map, and pass that price id to Stripe. In stripe-webhook, verify the signature with stripe.webhooks.constructEventAsync and STRIPE_WEBHOOK_SECRET before doing anything, and move the plan upgrade from src/pages/Success.jsx into the webhook."
