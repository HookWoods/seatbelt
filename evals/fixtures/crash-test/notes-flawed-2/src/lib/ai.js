const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY

export async function summarize(text) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-5-mini', messages: [{ role: 'user', content: `Summarize: ${text}` }] }),
  })
  return (await res.json()).choices[0].message.content
}
