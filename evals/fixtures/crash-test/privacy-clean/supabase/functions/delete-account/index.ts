import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { data: { user } } = await admin.auth.getUser(token ?? '')
  if (!user) return new Response('Please log in.', { status: 401 })

  const { data: files } = await admin.storage.from('avatars').list(user.id)
  if (files?.length) await admin.storage.from('avatars').remove(files.map((f) => user.id + '/' + f.name))
  await admin.from('notes').delete().eq('user_id', user.id)
  const { error } = await admin.auth.admin.deleteUser(user.id)
  if (error) {
    console.error('delete-account failed', error.code)
    return new Response('Could not delete the account.', { status: 500 })
  }
  return new Response('deleted')
})
