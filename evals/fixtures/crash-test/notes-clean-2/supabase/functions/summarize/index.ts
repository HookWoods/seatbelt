Deno.serve(async (req) => {
  const { text } = await req.json()
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${Deno.env.get('OPENAI_API_KEY')}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-5-mini', messages: [{ role: 'user', content: `Summarize: ${text}` }] }),
  })
  return new Response(JSON.stringify(await res.json()), { headers: { 'Content-Type': 'application/json' } })
})
