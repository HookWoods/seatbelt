import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const { userId } = await req.json()
  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  await admin.from('notes').delete().eq('user_id', userId)
  const { error } = await admin.auth.admin.deleteUser(userId)
  if (error) return new Response(error.message, { status: 500 })
  return new Response('deleted')
})
