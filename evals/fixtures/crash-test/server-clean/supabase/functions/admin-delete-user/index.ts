import { createClient } from 'npm:@supabase/supabase-js@2'

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

Deno.serve(async (req) => {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return json({ error: 'Please log in.' }, 401)

  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { data: { user } } = await admin.auth.getUser(token)
  if (!user) return json({ error: 'Please log in.' }, 401)

  const { data: profile } = await admin.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) return json({ error: 'Only admins can do this.' }, 403)

  const { userId } = await req.json()
  if (typeof userId !== 'string' || !UUID.test(userId)) return json({ error: 'Unknown user.' }, 400)

  await admin.from('notes').delete().eq('user_id', userId)
  const { error } = await admin.auth.admin.deleteUser(userId)
  if (error) {
    console.error('deleteUser failed', error.code)
    return json({ error: 'Could not delete this user. Try again later.' }, 500)
  }
  return json({ deleted: true })
})
