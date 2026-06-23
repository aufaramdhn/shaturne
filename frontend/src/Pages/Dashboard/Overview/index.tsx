import { useAuth } from '@/Hooks/Auth/useAuth'
import { useFetch } from '@/Hooks/Dashboard/useFetch'
import { getOverview } from '@/Services/Dashboard/dashboardService'

export default function Overview() {
  const { user } = useAuth()
  const { data, isLoading } = useFetch(getOverview)

  const stats = [
    { label: 'Total Proyek', value: data?.projects },
    { label: 'Rilis', value: data?.published },
    { label: 'Pesan Baru', value: data?.unread },
    { label: 'Keahlian', value: data?.skills },
  ]

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-[length:var(--text-h2)] font-bold text-[var(--color-text)]">
          Halo, {user?.name ?? 'Admin'}.
        </h1>
        <p className="mt-1 text-[var(--color-text-muted)]">Ringkasan konten portfolio kamu.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(s => (
          <div
            key={s.label}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 p-5"
          >
            <p className="font-[var(--font-display)] text-[2rem] font-bold leading-none text-[var(--color-text)]">
              {isLoading ? '—' : (s.value ?? 0)}
            </p>
            <p className="mt-2 font-[var(--font-mono)] text-[0.75rem] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <section className="mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 p-6">
        <h2 className="text-[1.125rem] font-bold text-[var(--color-text)]">Pesan</h2>
        <p className="mt-2 text-[0.9375rem] text-[var(--color-text-muted)]">
          {isLoading
            ? 'Memuat…'
            : `${data?.messages ?? 0} pesan total, ${data?.unread ?? 0} belum dibaca.`}
        </p>
      </section>
    </div>
  )
}
