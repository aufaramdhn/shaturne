import { useLanguage } from '@/Context/LanguageContext'

interface Props {
  response: unknown
  status: number | null
  duration: number | null
  error: string | null
}

function statusColor(status: number): string {
  if (status >= 200 && status < 300) return 'text-[oklch(72%_0.16_145)]'
  if (status >= 400) return 'text-[var(--color-error)]'
  return 'text-[var(--color-text-muted)]'
}

export default function ResponseViewer({ response, status, duration, error }: Props) {
  const { t } = useLanguage()

  if (error) {
    return (
      <p role="alert" className="text-[0.875rem] text-[var(--color-error)]">
        {error}
      </p>
    )
  }

  if (response === null) {
    return (
      <p className="text-[0.875rem] text-[var(--color-text-muted)]">{t('sandbox.emptyState')}</p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-4 font-[var(--font-mono)] text-[0.75rem]">
        {status !== null && (
          <span>
            <span className="text-[var(--color-text-muted)]">{t('sandbox.statusLabel')}: </span>
            <span className={statusColor(status)}>{status}</span>
          </span>
        )}
        {duration !== null && (
          <span>
            <span className="text-[var(--color-text-muted)]">{t('sandbox.durationLabel')}: </span>
            <span className="text-[var(--color-text)]">{duration}ms</span>
          </span>
        )}
      </div>
      <pre className="max-h-[400px] overflow-auto rounded-lg bg-[var(--color-surface-raised)] p-4 font-[var(--font-mono)] text-[0.8125rem] leading-relaxed text-[var(--color-text)]">
        {JSON.stringify(response, null, 2)}
      </pre>
    </div>
  )
}
