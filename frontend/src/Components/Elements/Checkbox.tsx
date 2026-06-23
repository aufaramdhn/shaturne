import { useId } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

// Custom checkbox (§6.4). Native input visually hidden (keeps keyboard + a11y),
// custom SVG checkmark animates pathLength 0→1. Touch target ≥44px via padding.

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: ReactNode
  disabled?: boolean
  id?: string
  name?: string
}

export default function Checkbox({
  checked,
  onChange,
  label,
  disabled = false,
  id,
  name,
}: CheckboxProps) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const reduce = useReducedMotion()

  return (
    <label
      htmlFor={fieldId}
      className={[
        'inline-flex items-center gap-3 py-2.5',
        disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
      ].join(' ')}
    >
      <input
        id={fieldId}
        name={name}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={e => onChange(e.target.checked)}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={[
          'grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors duration-200',
          checked
            ? 'border-[var(--color-accent)] bg-[var(--color-accent)]'
            : 'border-[var(--color-border)] bg-[var(--color-surface)]',
        ].join(' ')}
      >
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
          <motion.path
            d="M2.5 7.5L5.5 10.5L11.5 3.5"
            stroke="var(--color-bg)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.25, ease: 'easeOut' }}
          />
        </svg>
      </span>
      {label && <span className="text-[1rem] text-[var(--color-text)]">{label}</span>}
    </label>
  )
}
