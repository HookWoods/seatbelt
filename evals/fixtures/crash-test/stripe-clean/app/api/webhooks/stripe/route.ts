import Stripe from 'stripe'
import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'

export async function POST(req: Request) {
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      await req.text(), req.headers.get('stripe-signature') ?? '', process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch {
    return new Response('bad signature', { status: 400 })
  }

  // Stripe can send an event twice: handle it once.
  const seen = await db.stripeEvent.findUnique({ where: { id: event.id } })
  if (seen) return new Response('already handled')

  if (event.type === 'checkout.session.completed' && event.data.object.payment_status === 'paid') {
    const s = event.data.object
    await db.user.update({ where: { id: s.client_reference_id! }, data: { plan: s.metadata?.plan ?? 'pro' } })
  }
  // Stripe ends the subscription after its payment retries fail, which sends this event.
  if (event.type === 'customer.subscription.deleted') {
    const customer = String(event.data.object.customer)
    const sessions = await stripe.checkout.sessions.list({ customer, limit: 1 })
    const userId = sessions.data[0]?.client_reference_id
    if (userId) await db.user.update({ where: { id: userId }, data: { plan: 'free' } })
  }

  // Marked as handled only after the update worked (a failed update throws), so Stripe retries a failure.
  await db.stripeEvent.create({ data: { id: event.id } })
  return new Response('ok')
}
