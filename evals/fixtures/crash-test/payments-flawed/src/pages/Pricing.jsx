import { supabase } from '../lib/supabase'

export default function Pricing() {
  async function buy() {
    const { data } = await supabase.functions.invoke('create-checkout', { body: { plan: 'pro', amount: 900 } })
    window.location.href = data.url
  }
  return <button onClick={buy}>Go Pro, 9 euros</button>
}
