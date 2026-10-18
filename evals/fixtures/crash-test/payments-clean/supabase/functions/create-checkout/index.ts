import Stripe from 'npm:stripe@16'
import { createClient } from 'npm:@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!)
const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const PRICES: Record<string, string | undefined> = { pro: Deno.env.get('STRIPE_PRICE_PRO') }

Deno.serve(async (req) => {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  const { data: { user } } = await admin.auth.getUser(token ?? '')
  if (!user) return Response.json({ error: 'Please log in.' }, { status: 401 })

  const { plan } = await req.json()
  const price = PRICES[plan]
  if (!price) return Response.json({ error: 'Unknown plan.' }, { status: 400 })

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price, quantity: 1 }],
    client_reference_id: user.id,
    metadata: { plan },
    success_url: 'https://app.example.com/success',
    cancel_url: 'https://app.example.com/pricing',
  })
  return Response.json({ url: session.url })
})
