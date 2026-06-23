import { useState } from 'react'
import Button from '@/Components/Elements/Button'
import Modal from '@/Components/Elements/Modal'
import { useFetch } from '@/Hooks/Dashboard/useFetch'
import { getMessages, readMessage, deleteMessage } from '@/Services/Dashboard/dashboardService'
import type { DashMessage } from '@/Services/Dashboard/dashboardService'

export default function Inbox() {
  const { data, isLoading, reload } = useFetch(getMessages)
  const messages = data ?? []
  const [active, setActive] = useState<DashMessage | null>(null)

  const unread = messages.filter(m => !m.is_read).length

  async function openMessage(m: DashMessage) {
    setActive(m)
    if (!m.is_read) {
      await readMessage(m.uuid)
      reload()
    }
  }

  async function handleDelete(m: DashMessage) {
    if (!window.confirm(`Hapus pesan dari ${m.name}?`)) return
    await deleteMessage(m.uuid)
    setActive(null)
    reload()
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-[length:var(--text-h2)] font-bold text-[var(--color-text)]">Pesan</h1>
        <p className="mt-1 text-[var(--color-text-muted)]">
          {isLoading ? 'Memuat…' : `${unread} belum dibaca`}
        </p>
      </header>

      <ul className="flex flex-col gap-2">
        {messages.map(m => (
          <li key={m.uuid}>
            <button
              onClick={() => openMessage(m)}
              className={[
                'flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition-colors',
                m.is_read
                  ? 'border-[var(--color-border)] bg-[var(--color-surface)]/40'
                  : 'border-[var(--color-accent)]/30 bg-[var(--color-surface)]/70',
              ].join(' ')}
            >
              <span
                className={`mt-2 h-2 w-2 shrink-0 rounded-full ${
                  m.is_read ? 'bg-transparent' : 'bg-[var(--color-accent)]'
                }`}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <p
                    className={`truncate ${m.is_read ? 'font-medium' : 'font-bold'} text-[var(--color-text)]`}
                  >
                    {m.name}{' '}
                    <span className="font-normal text-[var(--color-text-muted)]">· {m.email}</span>
                  </p>
                  <span className="shrink-0 font-[var(--font-mono)] text-[0.75rem] text-[var(--color-text-muted)]">
                    {m.created_at?.slice(0, 10)}
                  </span>
                </div>
                <p className="mt-1 truncate text-[0.875rem] text-[var(--color-text-muted)]">
                  {m.message}
                </p>
              </div>
            </button>
          </li>
        ))}
        {!isLoading && messages.length === 0 && (
          <li className="rounded-2xl border border-[var(--color-border)] p-10 text-center text-[var(--color-text-muted)]">
            Belum ada pesan.
          </li>
        )}
      </ul>

      <Modal open={Boolean(active)} onClose={() => setActive(null)} title="Pesan">
        {active && (
          <div className="flex flex-col gap-4">
            <div>
              <p className="font-bold text-[var(--color-text)]">{active.name}</p>
              <a
                href={`mailto:${active.email}`}
                className="text-[0.875rem] text-[var(--color-accent)] underline underline-offset-4"
              >
                {active.email}
              </a>
            </div>
            <p className="whitespace-pre-wrap rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-[0.9375rem] leading-relaxed text-[var(--color-text)]">
              {active.message}
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => handleDelete(active)}>
                Hapus
              </Button>
              <a
                href={`mailto:${active.email}`}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--color-accent)] px-5 font-semibold text-[var(--color-bg)] transition-[box-shadow,filter] hover:shadow-[var(--glow-accent)] hover:brightness-105"
              >
                Balas
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
