import { supabase } from '../lib/supabase'

export default function Settings() {
  async function deleteAccount() {
    if (!confirm('Delete your account?')) return
    await supabase.auth.signOut()
    window.location.href = '/'
  }
  return <button onClick={deleteAccount}>Delete my account</button>
}
