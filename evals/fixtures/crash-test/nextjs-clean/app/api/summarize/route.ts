import 'server-only'
import OpenAI from 'openai'
import { auth } from '@/auth'
import { db } from '@/lib/db'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: 'Please log in.' }, { status: 401 })
  const { noteId } = await req.json()
  const note = await db.note.findFirst({ where: { id: String(noteId), userId: session.user.id } })
  if (!note) return Response.json({ error: 'Unknown note.' }, { status: 404 })
  const r = await openai.chat.completions.create({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: 'Summarize: ' + note.body.slice(0, 5000) }] })
  return Response.json({ summary: r.choices[0].message.content ?? '' })
}
