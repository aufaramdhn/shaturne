import { useState } from 'react'
import Input from '@/Components/Elements/Input'
import Button from '@/Components/Elements/Button'
import { useProfile } from '@/Hooks/Dashboard/useProfile'

export default function Profile() {
  const { user, saving, saved, errors, save } = useProfile()
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await save(name, email)
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
