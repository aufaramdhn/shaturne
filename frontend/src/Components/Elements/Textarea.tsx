import { forwardRef, useId } from 'react'
import type { TextareaHTMLAttributes } from 'react'

// Custom textarea (§6.4). Mirrors Input states; vertical resize only.

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  required?: boolean
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, helperText, required, id, rows = 5, className = '', ...rest },
  ref,
) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const errorId = `${fieldId}-error`
  const helperId = `${fieldId}-helper`
  const hasError = Boolean(error)

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={fieldId} className="text-[0.875rem] font-medium text-[var(--color-text)]">
          {label}
          {required && <span className="ml-0.5 text-[var(--color-error)]">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        id={fieldId}
        rows={rows}
        required={required}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : helperText ? helperId : undefined}
        className={[
          'w-full resize-y rounded-lg border px-4 py-3 text-[1rem] leading-[1.6]',
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

export default Textarea
