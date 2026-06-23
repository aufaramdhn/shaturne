import { useId } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

// Custom toggle (§6.4). role="switch" button, thumb slides via Framer Motion.

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  id?: string
}

export default function Switch({ checked, onChange, label, disabled = false, id }: SwitchProps) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const reduce = useReducedMotion()

  return (
    <div className="inline-flex items-center gap-3">
      <button
        id={fieldId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={[
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border px-0.5 transition-colors duration-200',
          'disabled:cursor-not-allowed disabled:opacity-40',
          checked
            ? 'justify-end border-[var(--color-accent)] bg-[var(--color-accent)]'
            : 'justify-start border-[var(--color-border)] bg-[var(--color-surface)]',
        ].join(' ')}
      >
        <motion.span
          layout
          transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 32 }}
          className={[
            'block h-4.5 w-4.5 rounded-full',
            checked ? 'bg-[var(--color-bg)]' : 'bg-[var(--color-text-muted)]',
          ].join(' ')}
        />
      </button>
      {label && (
        <label htmlFor={fieldId} className="text-[1rem] text-[var(--color-text)]">
          {label}
        </label>
      )}
    </div>
  )
}
