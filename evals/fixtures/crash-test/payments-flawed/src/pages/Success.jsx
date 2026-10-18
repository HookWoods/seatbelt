import { useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Success() {
  useEffect(() => {
    const plan = new URLSearchParams(window.location.search).get('plan')
    supabase.auth.getUser().then(({ data }) => {
      supabase.from('profiles').update({ plan }).eq('id', data.user.id)
    })
  }, [])
  return <p>Thank you! You are now Pro.</p>
}
