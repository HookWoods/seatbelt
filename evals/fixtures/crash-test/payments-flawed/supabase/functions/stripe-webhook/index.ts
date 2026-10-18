import { createClient } from 'npm:@supabase/supabase-js@2'

const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

Deno.serve(async (req) => {
  const event = JSON.parse(await req.text())
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    await admin.from('profiles').update({ plan: 'pro' }).eq('id', session.client_reference_id)
  }
  return new Response('ok')
})
