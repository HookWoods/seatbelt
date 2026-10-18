import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Admin() {
  const [message, setMessage] = useState('')

  async function removeUser(userId) {
    const { data, error } = await supabase.functions.invoke('admin-delete-user', { body: { userId } })
    setMessage(error ? 'Not allowed or failed.' : data.deleted ? 'User deleted.' : '')
  }

  return (
    <>
      <button onClick={() => removeUser(prompt('User id?'))}>Delete a user</button>
      <p>{message}</p>
    </>
  )
}
