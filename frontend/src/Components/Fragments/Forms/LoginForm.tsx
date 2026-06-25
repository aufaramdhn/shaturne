import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Input from '@/Components/Elements/Input'
import Button from '@/Components/Elements/Button'
import { ROUTES, localePath } from '@/Constants/routes'
import { useLanguage } from '@/Context/LanguageContext'
import { useLogin } from '@/Hooks/Auth/useLogin'

export default function LoginForm() {
  const { lang } = useLanguage()
  const {
    email,
    setEmail,
    password,
    setPassword,
    fieldErrors,
    formError,
    submitting,
    handleSubmit,
  } = useLogin()

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-8 shadow-[var(--glow-accent)]"
    >
      <Link
        to={localePath(lang, ROUTES.HOME)}
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
          error={fieldErrors.email}
          autoComplete="username"
          placeholder="nama@email.com"
        />
        <Input
          label="Password"
          type="password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          error={fieldErrors.password}
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
        to={localePath(lang, ROUTES.HOME)}
        className="mt-6 inline-block text-[0.875rem] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
      >
        ← Kembali ke situs
      </Link>
    </motion.div>
  )
}
