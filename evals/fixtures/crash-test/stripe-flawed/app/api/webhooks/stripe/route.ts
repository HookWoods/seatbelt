import { db } from '@/lib/db'

export async function POST(req: Request) {
  const event = await req.json()
  if (event.type === 'checkout.session.completed') {
    const s = event.data.object
    await db.user.update({ where: { id: s.client_reference_id }, data: { plan: s.metadata.plan } })
  }
  return new Response('ok')
}
