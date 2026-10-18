'use client'

export default function Pricing() {
  async function buy() {
    const r = await fetch('/api/checkout', { method: 'POST', body: JSON.stringify({ plan: 'pro', priceId: 'price_EXAMPLEpro' }) })
    window.location.href = (await r.json()).url
  }
  return <button onClick={buy}>Go Pro</button>
}
