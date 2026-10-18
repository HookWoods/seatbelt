import { createClient } from '@supabase/supabase-js'

export const client = () => createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

export async function newUser(name) {
  const c = client()
  const { error } = await c.auth.signUp({ email: name + '-' + Date.now() + '@example.com', password: 'test-password-123' })
  if (error) throw error
  return c
}
