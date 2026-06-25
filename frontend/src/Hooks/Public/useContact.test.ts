import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useContact } from './useContact'

vi.mock('@/Services/Public/contactService', () => ({
  sendMessage: vi.fn(),
}))

import { sendMessage } from '@/Services/Public/contactService'

const mockSendMessage = vi.mocked(sendMessage)

const PAYLOAD = { name: 'Alice', email: 'alice@example.com', message: 'Hello there!' }

beforeEach(() => {
  vi.resetAllMocks()
})

describe('useContact', () => {
  it('initial status is idle', () => {
    const { result } = renderHook(() => useContact())
    expect(result.current.status).toBe('idle')
    expect(result.current.fieldErrors).toEqual({})
  })

  it('sets status to submitting then success on resolve', async () => {
    mockSendMessage.mockResolvedValueOnce(undefined)

    const { result } = renderHook(() => useContact())

    let returnValue: boolean | undefined
    await act(async () => {
      returnValue = await result.current.submit(PAYLOAD)
    })

    expect(returnValue).toBe(true)
    expect(result.current.status).toBe('success')
    expect(result.current.fieldErrors).toEqual({})
  })

  it('sets status to error on non-422 rejection', async () => {
    const networkError = { response: { status: 500 } }
    mockSendMessage.mockRejectedValueOnce(networkError)

    const { result } = renderHook(() => useContact())

    let returnValue: boolean | undefined
    await act(async () => {
      returnValue = await result.current.submit(PAYLOAD)
    })

    expect(returnValue).toBe(false)
    expect(result.current.status).toBe('error')
    expect(result.current.fieldErrors).toEqual({})
  })

  it('sets fieldErrors on 422 response with errors object', async () => {
    const validationError = {
      response: {
        status: 422,
        data: {
          errors: {
            name: ['The name field is required.'],
            email: ['The email must be a valid email address.'],
          },
        },
      },
    }
    mockSendMessage.mockRejectedValueOnce(validationError)

    const { result } = renderHook(() => useContact())

    await act(async () => {
      await result.current.submit(PAYLOAD)
    })

    expect(result.current.status).toBe('error')
    expect(result.current.fieldErrors).toEqual({
      name: 'The name field is required.',
      email: 'The email must be a valid email address.',
    })
  })

  it('reset() clears status back to idle and clears fieldErrors', async () => {
    const validationError = {
      response: {
        status: 422,
        data: { errors: { name: ['Required.'] } },
      },
    }
    mockSendMessage.mockRejectedValueOnce(validationError)

    const { result } = renderHook(() => useContact())

    await act(async () => {
      await result.current.submit(PAYLOAD)
    })

    expect(result.current.status).toBe('error')

    act(() => {
      result.current.reset()
    })

    expect(result.current.status).toBe('idle')
    expect(result.current.fieldErrors).toEqual({})
  })
})
