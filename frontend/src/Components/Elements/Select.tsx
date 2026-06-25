import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

// Custom select (§6.4). Native <select> replaced by button trigger + listbox popup.
// Keyboard: ↑/↓ navigate, Enter/Space select, Escape close, Tab moves focus.
// ARIA listbox-with-button pattern via aria-activedescendant.

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  options: SelectOption[]
  value: string | null
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  id?: string
}

export default function Select({
  options,
  value,
  onChange,
  label,
  placeholder = 'Pilih…',
  error,
  disabled = false,
  id,
}: SelectProps) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const errorId = `${fieldId}-error`
  const reduce = useReducedMotion()

  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const selected = options.find(o => o.value === value) ?? null
  const hasError = Boolean(error)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  // Highlight the current selection when opening (set in handlers, not an effect)
  function openMenu() {
    const idx = options.findIndex(o => o.value === value)
    setHighlight(idx >= 0 ? idx : 0)
    setOpen(true)
  }

  function commit(idx: number) {
    const opt = options[idx]
    if (!opt) return
    onChange(opt.value)
    setOpen(false)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (disabled) return
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (!open) openMenu()
        else setHighlight(h => Math.min(h + 1, options.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        if (!open) openMenu()
        else setHighlight(h => Math.max(h - 1, 0))
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (!open) openMenu()
        else commit(highlight)
        break
      case 'Escape':
        setOpen(false)
        break
      case 'Tab':
        setOpen(false)
        break
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={fieldId} className="text-[0.875rem] font-medium text-[var(--color-text)]">
          {label}
        </label>
      )}

      <div ref={containerRef} className="relative">
        <button
          id={fieldId}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={`${fieldId}-listbox`}
          aria-activedescendant={open ? `${fieldId}-opt-${highlight}` : undefined}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          disabled={disabled}
          onClick={() => (open ? setOpen(false) : openMenu())}
          onKeyDown={onKeyDown}
          className={[
            'flex h-11 w-full items-center justify-between gap-2 rounded-lg border px-4 text-left text-[1rem]',
            'bg-[var(--color-surface)] transition-colors duration-200',
            'hover:border-[var(--color-accent)]/60',
            'disabled:cursor-not-allowed disabled:opacity-40',
            hasError
              ? 'border-[var(--color-error)]'
              : 'border-[var(--color-border)] focus-visible:border-[var(--color-accent)]',
          ].join(' ')}
        >
          <span
            className={selected ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'}
          >
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown
            size={15}
            aria-hidden="true"
            className={`shrink-0 text-[var(--color-text-muted)] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        <AnimatePresence>
          {open && (
            <motion.ul
              id={`${fieldId}-listbox`}
              role="listbox"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              style={{ zIndex: 'var(--z-dropdown)' }}
              className="absolute left-0 right-0 top-[calc(100%+4px)] max-h-60 overflow-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-1 shadow-lg"
            >
              {options.map((opt, idx) => {
                const isSelected = opt.value === value
                const isHigh = idx === highlight
                return (
                  <li
                    key={opt.value}
                    id={`${fieldId}-opt-${idx}`}
                    role="option"
                    aria-selected={isSelected}
                    onPointerEnter={() => setHighlight(idx)}
                    onClick={() => commit(idx)}
                    className={[
                      'cursor-pointer rounded-md px-3 py-2 text-[1rem]',
                      isHigh ? 'bg-[var(--color-accent)]/15' : '',
                      isSelected ? 'text-[var(--color-accent)]' : 'text-[var(--color-text)]',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {opt.label}
                  </li>
                )
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {hasError && (
        <span id={errorId} role="alert" className="text-[0.875rem] text-[var(--color-error)]">
          {error}
        </span>
      )}
    </div>
  )
}
