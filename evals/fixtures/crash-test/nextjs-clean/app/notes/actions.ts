'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { db } from '@/lib/db'

export async function deleteNote(id: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Please log in.')
  if (typeof id !== 'string' || id.length > 40) throw new Error('Unknown note.')
  await db.note.deleteMany({ where: { id, userId: session.user.id } })
  revalidatePath('/notes')
}
