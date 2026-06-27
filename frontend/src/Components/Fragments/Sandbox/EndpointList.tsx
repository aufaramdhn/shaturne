import type { SandboxEndpoint } from '@/Constants/sandboxEndpoints'

interface Props {
  endpoints: SandboxEndpoint[]
  selected: SandboxEndpoint
  onSelect: (e: SandboxEndpoint) => void
}

export default function EndpointList({ endpoints, selected, onSelect }: Props) {
  return (
    <ul className="flex flex-col gap-1">
      {endpoints.map(ep => (
        <li key={ep.id}>
          <button
            onClick={() => onSelect(ep)}
            className={`w-full rounded-lg px-3 py-2.5 text-left transition-colors ${
              selected.id === ep.id
                ? 'bg-[var(--color-accent)] text-[oklch(15%_0.024_265)]'
                : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text)]'
            }`}
          >
            <span className="font-[var(--font-mono)] text-[0.6875rem] uppercase tracking-wider opacity-70">
              {ep.method}
            </span>
            <span className="ml-2 text-[0.875rem] font-medium">{ep.label}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
