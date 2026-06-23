import { describe, it, expect } from 'vitest'
import { isRequired, isEmail, minLength, maxLength } from './validators'

describe('validators', () => {
  it('isRequired rejects blank/whitespace', () => {
    expect(isRequired('')).toBe(false)
    expect(isRequired('   ')).toBe(false)
    expect(isRequired('x')).toBe(true)
  })

  it('isEmail accepts valid and rejects invalid', () => {
    expect(isEmail('a@b.com')).toBe(true)
    expect(isEmail('a@b')).toBe(false)
    expect(isEmail('nope')).toBe(false)
    expect(isEmail('a b@c.com')).toBe(false)
  })

  it('minLength / maxLength trim before measuring', () => {
    expect(minLength('  ab  ', 2)).toBe(true)
    expect(minLength('a', 2)).toBe(false)
    expect(maxLength('abc', 3)).toBe(true)
    expect(maxLength('abcd', 3)).toBe(false)
  })
})
