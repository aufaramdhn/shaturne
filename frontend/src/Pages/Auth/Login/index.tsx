import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { AxiosError } from 'axios'
import Input from '@/Components/Elements/Input'
import Button from '@/Components/Elements/Button'
import { ROUTES } from '@/Constants/routes'
import { useAuth } from '@/Hooks/Auth/useAuth'
import { useSeo } from '@/Hooks/Common/useSeo'
import { isEmail, isRequired } from '@/Utils/validators'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  useSeo({ title: 'Masuk — Shaturne', noindex: true })

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const next: typeof errors = {}
    if (!isRequired(email)) next.email = 'Email wajib diisi.'
    else if (!isEmail(email)) next.email = 'Format email tidak valid.'
    if (!isRequired(password)) next.password = 'Password wajib diisi.'
    if (Object.keys(next).length) {
      setErrors(next)
      return
    }

    setErrors({})
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-8 shadow-[var(--glow-accent)]"
    >
      <Link
        to="/"
        className="font-[var(--font-display)] text-[1.5rem] font-bold tracking-[-0.02em] text-[var(--color-text)]"
      >
        Shaturne
      </Link>
      <h1 className="mt-5 text-[length:var(--text-h2)] font-bold text-[var(--color-text)]">
        Masuk Dashboard
      </h1>
      <p className="mt-2 text-[0.9375rem] text-[var(--color-text-muted)]">Area admin.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-7 flex flex-col gap-5">
        <Input
          label="Email"
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="username"
          placeholder="admin@shaturne.dev"
        />
        <Input
          label="Password"
          type="password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="current-password"
          placeholder="••••••••"
        />

        {formError && (
          <p role="alert" className="text-[0.875rem] text-[var(--color-error)]">
            {formError}
          </p>
        )}

        <Button type="submit" isLoading={submitting} fullWidth>
          {submitting ? 'Memproses…' : 'Masuk'}
        </Button>
      </form>

      <Link
        to="/"
        className="mt-6 inline-block text-[0.875rem] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
      >
        ← Kembali ke situs
      </Link>
    </motion.div>
  )
}
