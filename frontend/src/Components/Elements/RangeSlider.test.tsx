import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import RangeSlider from './RangeSlider'

describe('RangeSlider', () => {
  it('renders the value with suffix and exposes a slider', () => {
    render(<RangeSlider label="Level" suffix="/100" value={40} onChange={() => {}} />)

    expect(screen.getByText('40/100')).toBeInTheDocument()
    const slider = screen.getByRole('slider') as HTMLInputElement
    expect(slider.value).toBe('40')
  })

  it('reports numeric changes', () => {
    const onChange = vi.fn()
    render(<RangeSlider label="Level" value={40} onChange={onChange} />)

    fireEvent.change(screen.getByRole('slider'), { target: { value: '55' } })
    expect(onChange).toHaveBeenCalledWith(55)
  })

  it('marks invalid state for screen readers when errored', () => {
    render(<RangeSlider label="Level" value={10} onChange={() => {}} error="Wajib" />)

    expect(screen.getByRole('slider')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('alert')).toHaveTextContent('Wajib')
  })
})
