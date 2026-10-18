import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function Notes() {
  const [notes, setNotes] = useState([])
  useEffect(() => {
    supabase.from('notes').select('*').then(({ data }) => setNotes(data ?? []))
  }, [])
  return <ul>{notes.map((n) => <li key={n.id}>{n.body}</li>)}</ul>
}
