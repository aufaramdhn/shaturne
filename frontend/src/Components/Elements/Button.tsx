import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import Spinner from './Spinner'

// Custom button (§6.4). States: default / hover / focus / disabled / loading.
// Focus ring comes from global :focus-visible — never removed.

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  fullWidth?: boolean
  children: ReactNode
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-accent)] text-[var(--color-bg)] border border-[var(--color-accent)] font-semibold hover:shadow-[var(--glow-accent)] hover:brightness-105',
  secondary:
    'bg-[var(--color-surface)]/60 text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:shadow-[var(--glow-accent)]',
  ghost:
    'bg-transparent text-[var(--color-text)] border border-transparent hover:bg-[var(--color-surface)]',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-[0.875rem]',
  md: 'h-11 px-5 text-[1rem]',
  lg: 'h-13 px-7 text-[1.0625rem]',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    disabled,
    children,
    className = '',
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || isLoading

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      aria-busy={isLoading}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium',
        'transition-[box-shadow,border-color,background-color,transform,filter] duration-200',
        'active:scale-[0.98]',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100',
        'cursor-pointer select-none',
        VARIANTS[variant],
        SIZES[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {isLoading && <Spinner size={size === 'sm' ? 15 : 18} />}
      {children}
    </button>
  )
})

export default Button
