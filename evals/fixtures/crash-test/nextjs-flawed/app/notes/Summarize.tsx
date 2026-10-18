'use client'

import OpenAI from 'openai'
import { useState } from 'react'

const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true })

export default function Summarize({ text }: { text: string }) {
  const [summary, setSummary] = useState('')
  async function run() {
    const r = await openai.chat.completions.create({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: 'Summarize: ' + text }] })
    setSummary(r.choices[0].message.content ?? '')
  }
  return <><button onClick={run}>Summarize</button><p>{summary}</p></>
}
