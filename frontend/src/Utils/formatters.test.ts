import { describe, it, expect } from 'vitest'
import { projectAccent, periodLabel } from './formatters'

describe('projectAccent', () => {
  it('is deterministic for the same seed', () => {
    expect(projectAccent('alpha')).toBe(projectAccent('alpha'))
  })

  it('maps numeric parity to cyan/violet', () => {
    expect(projectAccent(0)).toBe('cyan')
    expect(projectAccent(1)).toBe('violet')
    expect(projectAccent(2)).toBe('cyan')
  })
})

describe('periodLabel', () => {
  it('uses the present word when end is null', () => {
    expect(periodLabel('2024-01-01', null, 'Sekarang')).toBe('2024 / Sekarang')
  })

  it('renders a year range when both dates exist', () => {
    expect(periodLabel('2022-06-01', '2024-03-01', 'Present')).toBe('2022 / 2024')
  })

  it('falls back to the end word when start is missing', () => {
    expect(periodLabel(null, null, 'Present')).toBe('Present')
  })
})
