import type { ReactNode } from 'react'

// Mono chip (§6.3 --text-tag). Stack tags, status labels, dates.
// 'accent' = cyan highlight; 'alt' = violet (secondary accent).

type BadgeVariant = 'default' | 'accent' | 'alt'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const VARIANTS: Record<BadgeVariant, string> = {
  default:
    'text-[var(--color-text-muted)] border-[var(--color-border)] bg-[var(--color-surface-raised)]',
  accent: 'text-[var(--color-accent)] border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10',
  alt: 'text-[var(--color-accent-2)] border-[var(--color-accent-2)]/40 bg-[var(--color-accent-2)]/12',
}

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 font-[var(--font-mono)] text-[0.75rem] font-medium uppercase leading-none tracking-[0.04em] ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
