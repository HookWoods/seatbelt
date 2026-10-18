import { supabase } from '../lib/supabase'

export default function Admin({ user }) {
  if (user?.email !== 'owner@example.com') return <p>Not allowed</p>

  async function removeUser(userId) {
    await supabase.functions.invoke('admin-delete-user', { body: { userId } })
  }

  return <button onClick={() => removeUser(prompt('User id?'))}>Delete a user</button>
}
