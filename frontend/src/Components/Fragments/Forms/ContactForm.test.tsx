import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ContactForm from './ContactForm'

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockSubmit = vi.fn()
const mockReset = vi.fn()

vi.mock('@/Hooks/Public/useContact', () => ({
  useContact: vi.fn(),
}))

vi.mock('@/Context/LanguageContext', () => ({
  useLanguage: vi.fn(),
}))

import { useContact } from '@/Hooks/Public/useContact'
import { useLanguage } from '@/Context/LanguageContext'

const mockUseContact = vi.mocked(useContact)
const mockUseLanguage = vi.mocked(useLanguage)

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeUseContact(overrides: Partial<ReturnType<typeof useContact>> = {}) {
  return {
    status: 'idle' as const,
    fieldErrors: {},
    submit: mockSubmit,
    reset: mockReset,
    ...overrides,
  }
}

/** t() returns the key so assertions don't depend on real translation strings */
function makeUseLanguage() {
  return {
    lang: 'id' as const,
    t: (key: string, vars?: Record<string, string | number>) => {
      if (!vars) return key
      return Object.entries(vars).reduce((s, [k, v]) => s.replaceAll(`{${k}}`, String(v)), key)
    },
    switchLang: vi.fn(),
  }
}

beforeEach(() => {
  vi.resetAllMocks()
  mockUseContact.mockReturnValue(makeUseContact())
  mockUseLanguage.mockReturnValue(makeUseLanguage())
  localStorage.clear()
})

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ContactForm', () => {
  it('renders name, email, and message fields', () => {
    render(<ContactForm />)

    // Labels are translation keys in our mock
    expect(screen.getByLabelText(/contact\.name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contact\.email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contact\.message/i)).toBeInTheDocument()
  })

  it('shows client-side validation errors when submitting an empty form', async () => {
    const { container } = render(<ContactForm />)

    // The <form> has no accessible name so getByRole('form') won't find it;
    // fire submit on the DOM element directly.
    fireEvent.submit(container.querySelector('form')!)

    await waitFor(() => {
      const alerts = screen.getAllByRole('alert')
      expect(alerts.length).toBeGreaterThanOrEqual(1)
      // Name and email and message errors must surface
      const texts = alerts.map(a => a.textContent)
      expect(texts.some(t => t?.includes('contact.errNameReq'))).toBe(true)
      expect(texts.some(t => t?.includes('contact.errEmailReq'))).toBe(true)
      expect(texts.some(t => t?.includes('contact.errMsgReq'))).toBe(true)
    })

    // submit() on the hook must NOT have been called (failed client validation)
    expect(mockSubmit).not.toHaveBeenCalled()
  })

  it('calls submit() with correct payload when form is valid', async () => {
    mockSubmit.mockResolvedValue(true)
    render(<ContactForm />)

    fireEvent.change(screen.getByLabelText(/contact\.name/i), { target: { value: 'Alice' } })
    fireEvent.change(screen.getByLabelText(/contact\.email/i), {
      target: { value: 'alice@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/contact\.message/i), {
      target: { value: 'Hello, this is a valid message!' },
    })

    fireEvent.click(screen.getByRole('button', { name: /contact\.send/i }))

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledOnce()
    })

    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Alice',
        email: 'alice@example.com',
        message: 'Hello, this is a valid message!',
      }),
    )
  })

  it('shows success state when status === success', () => {
    mockUseContact.mockReturnValue(makeUseContact({ status: 'success' }))
    render(<ContactForm />)

    expect(screen.getByText('contact.successTitle')).toBeInTheDocument()
    expect(screen.getByText('contact.successBody')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /contact\.sendAnother/i })).toBeInTheDocument()
  })

  it('clicking "send another" in success state calls reset()', () => {
    mockUseContact.mockReturnValue(makeUseContact({ status: 'success' }))
    render(<ContactForm />)

    fireEvent.click(screen.getByRole('button', { name: /contact\.sendAnother/i }))
    expect(mockReset).toHaveBeenCalledOnce()
  })

  it('shows generic error message when status === error and no fieldErrors', () => {
    mockUseContact.mockReturnValue(makeUseContact({ status: 'error', fieldErrors: {} }))
    render(<ContactForm />)

    expect(screen.getByText('contact.errSend')).toBeInTheDocument()
  })

  it('does not show generic error message when status === error but fieldErrors exist', () => {
    mockUseContact.mockReturnValue(
      makeUseContact({ status: 'error', fieldErrors: { email: 'Invalid.' } }),
    )
    render(<ContactForm />)

    expect(screen.queryByText('contact.errSend')).not.toBeInTheDocument()
  })

  it('button is disabled and shows countdown when cooldownMs > 0 (via localStorage)', () => {
    // Simulate an active cooldown: 5 minutes remaining
    const until = Date.now() + 5 * 60 * 1000
    localStorage.setItem('shaturne_contact_cooldown', String(until))

    render(<ContactForm />)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    // Label contains the time key with an interpolated {time}
    expect(button.textContent).toContain('contact.cooldownBtn')
  })
})
