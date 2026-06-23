import { useState } from 'react'
import type { AxiosError } from 'axios'
import { sendMessage } from '@/Services/Public/contactService'
import type { ContactPayload } from '@/Services/Public/contactService'

type Status = 'idle' | 'submitting' | 'success' | 'error'

interface ApiError {
  message?: string
  errors?: Record<string, string[]>
}

export function useContact() {
  const [status, setStatus] = useState<Status>('idle')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  async function submit(payload: ContactPayload): Promise<boolean> {
    setStatus('submitting')
    setFieldErrors({})
    try {
      await sendMessage(payload)
      setStatus('success')
      return true
    } catch (e) {
      const err = e as AxiosError<ApiError>
      if (err.response?.status === 422 && err.response.data?.errors) {
        const mapped: Record<string, string> = {}
        for (const [key, msgs] of Object.entries(err.response.data.errors)) {
          mapped[key] = msgs[0]
        }
        setFieldErrors(mapped)
      }
      setStatus('error')
      return false
    }
  }

  function reset() {
    setStatus('idle')
    setFieldErrors({})
  }

  return { status, fieldErrors, submit, reset }
}
