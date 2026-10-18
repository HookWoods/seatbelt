'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'

export async function deleteNote(id: string) {
  await db.note.delete({ where: { id } })
  revalidatePath('/notes')
}
