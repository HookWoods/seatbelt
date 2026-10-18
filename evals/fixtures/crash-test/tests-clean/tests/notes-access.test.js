import { describe, it, expect, beforeAll } from 'vitest'
import { newUser } from './helpers.js'

describe('notes access', () => {
  let alice, bob, noteId

  beforeAll(async () => {
    alice = await newUser('alice')
    bob = await newUser('bob')
    const { data } = await alice.from('notes').insert({ body: 'private' }).select().single()
    noteId = data.id
  })

  it('lets the owner read their note', async () => {
    const { data } = await alice.from('notes').select().eq('id', noteId)
    expect(data).toHaveLength(1)
  })

  it('hides the note from another user', async () => {
    const { data } = await bob.from('notes').select().eq('id', noteId)
    expect(data).toHaveLength(0)
  })

  it('stops another user from deleting it', async () => {
    await bob.from('notes').delete().eq('id', noteId)
    const { data } = await alice.from('notes').select().eq('id', noteId)
    expect(data).toHaveLength(1)
  })
})
