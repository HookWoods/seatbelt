'use client'

import { useState } from 'react'

export default function Summarize({ noteId }: { noteId: string }) {
  const [summary, setSummary] = useState('')
  async function run() {
    const r = await fetch('/api/summarize', { method: 'POST', body: JSON.stringify({ noteId }) })
    setSummary(r.ok ? (await r.json()).summary : 'Summary not available right now.')
  }
  return <><button onClick={run}>Summarize</button><p>{summary}</p></>
}
