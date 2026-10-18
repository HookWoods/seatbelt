import { auth } from '@/auth'
import { stripe } from '@/lib/stripe'

export async function POST(req: Request) {
  const session = await auth()
  const { priceId, plan } = await req.json()
  const checkout = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: session?.user?.id,
    metadata: { plan },
    success_url: 'https://app.example.com/success',
    cancel_url: 'https://app.example.com/pricing',
  })
  return Response.json({ url: checkout.url })
}
