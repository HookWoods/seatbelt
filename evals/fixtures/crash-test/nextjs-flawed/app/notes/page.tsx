import { db } from '@/lib/db'
import { auth } from '@/auth'
import { deleteNote } from './actions'
import Summarize from './Summarize'

export default async function NotesPage() {
  const session = await auth()
  const notes = await db.note.findMany({ where: { userId: session!.user!.id! } })
  return (
    <ul>
      {notes.map((n) => (
        <li key={n.id}>
          {n.body} <Summarize text={n.body} />
          <form action={deleteNote.bind(null, n.id)}><button>Delete</button></form>
        </li>
      ))}
    </ul>
  )
}
