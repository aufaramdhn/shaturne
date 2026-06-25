import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: { componentStack: string }): void {
    console.error('[ErrorBoundary]', error.message, info.componentStack)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback ?? <SectionErrorFallback />
    }
    return this.props.children
  }
}

function SectionErrorFallback() {
  return (
    <div
      className="flex min-h-[6rem] items-center justify-center rounded-xl border border-[var(--color-error)]/30 bg-[var(--color-surface)]"
      role="alert"
    >
      <p className="font-[var(--font-mono)] text-[0.8125rem] text-[var(--color-text-muted)]">
        Gagal memuat bagian ini.
      </p>
    </div>
  )
}
