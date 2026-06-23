import { useState } from 'react'
import Input from '@/Components/Elements/Input'
import Button from '@/Components/Elements/Button'
import { useAuth } from '@/Hooks/Auth/useAuth'
import { updateProfile } from '@/Services/Dashboard/dashboardService'

export default function Profile() {
  const { user, applyUser } = useAuth()
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setErrors({})
    try {
      const updated = await updateProfile({ name, email })
      applyUser(updated)
      setSaved(true)
      window.setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      const e2 = err as { response?: { data?: { errors?: Record<string, string[]> } } }
      const apiErrors = e2.response?.data?.errors
      if (apiErrors) {
        const mapped: Record<string, string> = {}
        for (const [k, v] of Object.entries(apiErrors)) mapped[k] = v[0]
        setErrors(mapped)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-[length:var(--text-h2)] font-bold text-[var(--color-text)]">Profil</h1>
        <p className="mt-1 text-[var(--color-text-muted)]">Kelola informasi akun.</p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="flex max-w-lg flex-col gap-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 p-6"
      >
        <Input
          label="Nama"
          value={name}
          onChange={e => setName(e.target.value)}
          error={errors.name}
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          error={errors.email}
        />
        <Input label="Peran" value={user?.role ?? 'admin'} disabled />

        <div className="flex items-center gap-4">
          <Button type="submit" isLoading={saving}>
            Simpan
          </Button>
          {saved && <span className="text-[0.875rem] text-[var(--color-accent)]">Tersimpan.</span>}
        </div>
      </form>
    </div>
  )
}
