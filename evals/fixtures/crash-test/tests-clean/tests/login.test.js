import { it, expect } from 'vitest'
import { client } from './helpers.js'

it('shows no notes to a logged-out visitor', async () => {
  const { data } = await client().from('notes').select()
  expect(data).toHaveLength(0)
})
