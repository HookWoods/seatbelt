import Stripe from 'npm:stripe@16'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!)

Deno.serve(async (req) => {
  const { plan, amount } = await req.json()
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price_data: { currency: 'eur', product_data: { name: plan }, unit_amount: amount }, quantity: 1 }],
    success_url: 'https://app.example.com/success?plan=' + plan,
    cancel_url: 'https://app.example.com/pricing',
  })
  return Response.json({ url: session.url })
})
