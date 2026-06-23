import { forwardRef, useId } from 'react'
import type { InputHTMLAttributes } from 'react'

// Custom input (§6.4). Visible label, error below field via aria-describedby.
// Focus ring inherited from global :focus-visible.

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  required?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, helperText, required, id, className = '', ...rest },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId
  const errorId = `${inputId}-error`
  const helperId = `${inputId}-helper`
  const hasError = Boolean(error)

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-[0.875rem] font-medium text-[var(--color-text)]">
          {label}
          {required && <span className="ml-0.5 text-[var(--color-error)]">*</span>}
        </label>
      )}

      <input
        ref={ref}
        id={inputId}
        required={required}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : helperText ? helperId : undefined}
        className={[
          'h-11 w-full rounded-lg border px-4 text-[1rem]',
          'bg-[var(--color-surface)] text-[var(--color-text)]',
          'placeholder:text-[var(--color-text-muted)]',
          'transition-colors duration-200',
          'hover:border-[var(--color-accent)]/60',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          hasError
            ? 'border-[var(--color-error)] focus-visible:outline-[var(--color-error)]'
            : 'border-[var(--color-border)] focus-visible:border-[var(--color-accent)]',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      />

      {hasError ? (
        <span id={errorId} role="alert" className="text-[0.875rem] text-[var(--color-error)]">
          {error}
        </span>
      ) : (
        helperText && (
          <span id={helperId} className="text-[0.875rem] text-[var(--color-text-muted)]">
            {helperText}
          </span>
        )
      )}
    </div>
  )
})

export default Input
