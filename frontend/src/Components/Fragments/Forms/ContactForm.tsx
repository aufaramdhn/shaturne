import { useEffect, useRef, useState } from 'react'
import Input from '@/Components/Elements/Input'
import Textarea from '@/Components/Elements/Textarea'
import Button from '@/Components/Elements/Button'
import { useLanguage } from '@/Context/LanguageContext'
import { useContact } from '@/Hooks/Public/useContact'
import { isRequired, isEmail, minLength } from '@/Utils/validators'

interface FormState {
  name: string
  email: string
  message: string
  honeypot: string
}

const EMPTY: FormState = { name: '', email: '', message: '', honeypot: '' }
const COOLDOWN_MS = 10 * 60 * 1000
const COOLDOWN_KEY = 'shaturne_contact_cooldown'

function getCooldownRemaining(): number {
  const until = Number(localStorage.getItem(COOLDOWN_KEY) || 0)
  return Math.max(0, until - Date.now())
}

function setCooldown(): void {
  localStorage.setItem(COOLDOWN_KEY, String(Date.now() + COOLDOWN_MS))
}

function formatTime(ms: number): string {
  const m = Math.floor(ms / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function ContactForm() {
  const { t } = useLanguage()
  const { status, fieldErrors, submit, reset } = useContact()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({})
  const [cooldownMs, setCooldownMs] = useState(() => getCooldownRemaining())
  const intervalRef = useRef<number | null>(null)

  const isOnCooldown = cooldownMs > 0

  useEffect(() => {
    if (!isOnCooldown) return
    intervalRef.current = window.setInterval(() => {
      const rem = getCooldownRemaining()
      setCooldownMs(rem)
      if (rem <= 0 && intervalRef.current) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }, 1000)
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [isOnCooldown])

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm(f => ({ ...f, [key]: value }))
    if (key in clientErrors) setClientErrors(e => ({ ...e, [key]: '' }))
  }

  function validate(): Record<string, string> {
    const next: Record<string, string> = {}
    if (!isRequired(form.name)) next.name = t('contact.errNameReq')
    if (!isRequired(form.email)) next.email = t('contact.errEmailReq')
    else if (!isEmail(form.email)) next.email = t('contact.errEmailInvalid')
    if (!isRequired(form.message)) next.message = t('contact.errMsgReq')
    else if (!minLength(form.message, 10)) next.message = t('contact.errMsgMin')
    return next
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const found = validate()
    if (Object.keys(found).length > 0) {
      setClientErrors(found)
      return
    }
    setClientErrors({})
    const ok = await submit(form)
    if (ok) {
      setForm(EMPTY)
      setCooldown()
      setCooldownMs(COOLDOWN_MS)
    }
  }

  const errorFor = (field: keyof FormState) => clientErrors[field] || fieldErrors[field]
  const isCooling = cooldownMs > 0
  const isSubmitting = status === 'submitting'

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-[var(--color-accent)] bg-[var(--color-surface)] p-6 shadow-[var(--glow-accent)]">
        <p className="font-[var(--font-display)] text-[1.25rem] font-bold text-[var(--color-text)]">
          {t('contact.successTitle')}
        </p>
        <p className="mt-2 text-[0.9375rem] text-[var(--color-text-muted)]">
          {t('contact.successBody')}
        </p>
        <button
          type="button"
          onClick={() => {
            setForm(EMPTY)
            reset()
          }}
          className="mt-4 text-[0.9375rem] text-[var(--color-accent)] underline underline-offset-4 transition-opacity hover:opacity-80"
        >
          {t('contact.sendAnother')}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <Input
        label={t('contact.name')}
        required
        value={form.name}
        onChange={e => update('name', e.target.value)}
        error={errorFor('name')}
        autoComplete="name"
        placeholder={t('contact.namePlaceholder')}
      />
      <Input
        label={t('contact.email')}
        type="email"
        required
        value={form.email}
        onChange={e => update('email', e.target.value)}
        error={errorFor('email')}
        autoComplete="email"
        placeholder={t('contact.emailPlaceholder')}
      />
      <Textarea
        label={t('contact.message')}
        required
        value={form.message}
        onChange={e => update('message', e.target.value)}
        error={errorFor('message')}
        placeholder={t('contact.messagePlaceholder')}
      />

      {/* Honeypot — hidden from real users, only bots fill it */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={form.honeypot}
        onChange={e => update('honeypot', e.target.value)}
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      {status === 'error' && Object.keys(fieldErrors).length === 0 && (
        <p className="text-[0.875rem] text-[var(--color-error)]">{t('contact.errSend')}</p>
      )}

      <Button
        type="submit"
        isLoading={isSubmitting}
        disabled={isSubmitting || isCooling}
        className="self-start"
      >
        {isSubmitting
          ? t('contact.sending')
          : isCooling
            ? t('contact.cooldownBtn', { time: formatTime(cooldownMs) })
            : t('contact.send')}
      </Button>
    </form>
  )
}
