import { useLanguage } from '@/Context/LanguageContext'
import { SANDBOX_ENDPOINTS } from '@/Constants/sandboxEndpoints'
import { useSandbox } from '@/Hooks/useSandbox'
import EndpointList from './EndpointList'
import ParamForm from './ParamForm'
import ResponseViewer from './ResponseViewer'

export default function SandboxWindow() {
  const { t } = useLanguage()
  const {
    selected,
    setSelected,
    paramValues,
    setParam,
    response,
    status,
    duration,
    isLoading,
    error,
    execute,
  } = useSandbox()

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      {/* Header */}
      <div className="border-b border-[var(--color-border)] px-5 py-4">
        <h2 className="text-[length:var(--text-h3)] font-bold text-[var(--color-text)]">
          {t('sandbox.title')}
        </h2>
        <p className="mt-0.5 text-[0.8125rem] text-[var(--color-text-muted)]">
          {t('sandbox.subtitle')}
        </p>
      </div>

      {/* Body */}
      <div className="grid grid-cols-[200px_1fr] divide-x divide-[var(--color-border)]">
        {/* Sidebar — endpoint list */}
        <div className="p-4">
          <p className="mb-2 text-[0.75rem] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
            {t('sandbox.endpointsLabel')}
          </p>
          <EndpointList endpoints={SANDBOX_ENDPOINTS} selected={selected} onSelect={setSelected} />
        </div>

        {/* Main — params + response */}
        <div className="flex min-w-0 flex-col gap-6 overflow-hidden p-5">
          <ParamForm
            endpoint={selected}
            values={paramValues}
            onChange={setParam}
            onSubmit={execute}
            isLoading={isLoading}
          />
          <div>
            <p className="mb-2 text-[0.8125rem] font-medium text-[var(--color-text-muted)]">
              {t('sandbox.responseLabel')}
            </p>
            <ResponseViewer response={response} status={status} duration={duration} error={error} />
          </div>
        </div>
      </div>
    </div>
  )
}
