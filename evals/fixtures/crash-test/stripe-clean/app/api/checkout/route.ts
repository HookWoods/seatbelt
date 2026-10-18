import { auth } from '@/auth'
import { stripe } from '@/lib/stripe'

const PRICES: Record<string, string | undefined> = { pro: process.env.STRIPE_PRICE_PRO }

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: 'Please log in.' }, { status: 401 })
  const { plan } = await req.json()
  const price = PRICES[plan]
  if (!price) return Response.json({ error: 'Unknown plan.' }, { status: 400 })
  const checkout = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price, quantity: 1 }],
    client_reference_id: session.user.id,
    metadata: { plan },
    success_url: 'https://app.example.com/success',
    cancel_url: 'https://app.example.com/pricing',
  })
  return Response.json({ url: checkout.url })
}
