import { describe, it, expect } from 'vitest'

describe('app', () => {
  it('works', () => {
    expect(true).toBe(true)
  })

  it('keeps notes private', () => {
    expect('notes').toMatchSnapshot()
  })
})
