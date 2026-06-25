import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { AxiosError } from 'axios'
import { useAuth } from '@/Hooks/Auth/useAuth'
import { ROUTES } from '@/Constants/routes'
import { isEmail, isRequired } from '@/Utils/validators'

export function useLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const next: typeof fieldErrors = {}
    if (!isRequired(email)) next.email = 'Email wajib diisi.'
    else if (!isEmail(email)) next.email = 'Format email tidak valid.'
    if (!isRequired(password)) next.password = 'Password wajib diisi.'
    if (Object.keys(next).length) {
      setFieldErrors(next)
      return
    }
    setFieldErrors({})
    setFormError(null)
    setSubmitting(true)
    try {
      await login(email, password)
      navigate(ROUTES.DASHBOARD, { replace: true })
    } catch (err) {
      const ax = err as AxiosError
      const status = ax.response?.status
      setFormError(
        status === 422
          ? 'Email atau password salah.'
          : status === 429
            ? 'Terlalu banyak percobaan. Coba lagi nanti.'
            : 'Gagal masuk. Coba lagi.',
      )
      setSubmitting(false)
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    fieldErrors,
    formError,
    submitting,
    handleSubmit,
  }
}
