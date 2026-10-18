import Stripe from 'npm:stripe@16'
import { createClient } from 'npm:@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!)
const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

Deno.serve(async (req) => {
  let event
  try {
    event = await stripe.webhooks.constructEventAsync(
      await req.text(), req.headers.get('stripe-signature') ?? '', Deno.env.get('STRIPE_WEBHOOK_SECRET')!,
    )
  } catch {
    return new Response('bad signature', { status: 400 })
  }

  // The same event can arrive twice: handle it once.
  const { data: seen } = await admin.from('processed_events').select('id').eq('id', event.id).maybeSingle()
  if (seen) return new Response('already handled')

  let failed = null
  if (event.type === 'checkout.session.completed' && event.data.object.payment_status === 'paid') {
    const session = event.data.object
    const { error } = await admin.from('profiles').update({ plan: session.metadata?.plan ?? 'pro' }).eq('id', session.client_reference_id)
    failed = error
  }
  if (event.type === 'charge.refunded') {
    const charge = event.data.object
    const sessions = await stripe.checkout.sessions.list({ payment_intent: String(charge.payment_intent), limit: 1 })
    const userId = sessions.data[0]?.client_reference_id
    if (userId) failed = (await admin.from('profiles').update({ plan: 'free' }).eq('id', userId)).error
  }

  // Marked as handled only after the update worked, so Stripe retries a failure.
  if (failed) return new Response('retry later', { status: 500 })
  await admin.from('processed_events').insert({ id: event.id })
  return new Response('ok')
})
