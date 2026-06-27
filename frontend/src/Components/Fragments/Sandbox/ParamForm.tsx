import { useLanguage } from '@/Context/LanguageContext'
import type { SandboxEndpoint } from '@/Constants/sandboxEndpoints'

interface Props {
  endpoint: SandboxEndpoint
  values: Record<string, string>
  onChange: (key: string, value: string) => void
  onSubmit: () => void
  isLoading: boolean
}

export default function ParamForm({ endpoint, values, onChange, onSubmit, isLoading }: Props) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="font-[var(--font-mono)] text-[0.75rem] text-[var(--color-text-muted)]">
          {endpoint.method}
        </p>
        <p className="mt-0.5 font-[var(--font-mono)] text-[0.875rem] text-[var(--color-accent)]">
          {endpoint.path}
        </p>
        <p className="mt-1 text-[0.875rem] text-[var(--color-text-muted)]">
          {endpoint.description}
        </p>
      </div>

      {endpoint.params.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-[0.8125rem] font-medium text-[var(--color-text-muted)]">
            {t('sandbox.paramsLabel')}
          </p>
          {endpoint.params.map(param => (
            <div key={param.key}>
              <label className="mb-1 block text-[0.8125rem] text-[var(--color-text)]">
                {param.label}
                {param.required && <span className="ml-1 text-[var(--color-error)]">*</span>}
              </label>
              <input
                type={param.type === 'number' ? 'number' : 'text'}
                min={param.type === 'number' ? 0 : undefined}
                value={values[param.key] ?? ''}
                onChange={e => onChange(param.key, e.target.value)}
                placeholder={param.example}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 font-[var(--font-mono)] text-[0.875rem] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-accent)] focus-visible:outline-none"
              />
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={isLoading}
        className="w-fit rounded-lg bg-[var(--color-accent)] px-5 py-2.5 font-medium text-[oklch(15%_0.024_265)] transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {isLoading ? '...' : t('sandbox.runButton')}
      </button>
    </div>
  )
}
