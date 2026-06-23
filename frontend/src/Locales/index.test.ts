import { describe, it, expect, beforeEach } from 'vitest'
import { isLang, detectLang, tx, DEFAULT_LANG } from './index'

describe('isLang', () => {
  it('narrows only supported codes', () => {
    expect(isLang('id')).toBe(true)
    expect(isLang('en')).toBe(true)
    expect(isLang('fr')).toBe(false)
    expect(isLang(null)).toBe(false)
  })
})

describe('detectLang', () => {
  beforeEach(() => localStorage.clear())

  it('prefers a stored preference', () => {
    localStorage.setItem('lang', 'en')
    expect(detectLang()).toBe('en')
  })

  it('falls back to the default when nothing is stored', () => {
    expect(['id', 'en']).toContain(detectLang())
  })
})

describe('tx', () => {
  it('resolves the requested locale', () => {
    expect(tx({ id: 'Halo', en: 'Hello' }, 'en')).toBe('Hello')
    expect(tx({ id: 'Halo', en: 'Hello' }, 'id')).toBe('Halo')
  })

  it('falls back to the default locale when a value is empty', () => {
    expect(tx({ id: 'Halo', en: '' }, 'en')).toBe('')
    expect(DEFAULT_LANG).toBe('id')
  })
})
