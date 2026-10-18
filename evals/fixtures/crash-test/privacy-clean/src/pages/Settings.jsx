import { supabase } from '../lib/supabase'

export default function Settings() {
  async function deleteAccount() {
    if (!confirm('Delete your account, your notes and your photo? This cannot be undone.')) return
    const { error } = await supabase.functions.invoke('delete-account')
    if (error) return alert('Deletion did not work. Try again or write to privacy@example.com.')
    await supabase.auth.signOut()
    window.location.href = '/'
  }
  return <button onClick={deleteAccount}>Delete my account</button>
}
