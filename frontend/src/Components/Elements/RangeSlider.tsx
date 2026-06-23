import { useId } from 'react'

// Custom range input (§6.4 — appearance:none, styled track + thumb in
// Global.css). Native <input type="range"> keeps free keyboard support
// (arrows/home/end). The fill is driven by a CSS var set inline.

interface RangeSliderProps {
  label?: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  error?: string
  suffix?: string
  id?: string
}

export default function RangeSlider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  error,
  suffix = '',
  id,
}: RangeSliderProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const errorId = `${inputId}-error`
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <div className="flex items-baseline justify-between">
          <label htmlFor={inputId} className="text-[0.875rem] font-medium text-[var(--color-text)]">
            {label}
          </label>
          <span className="font-[var(--font-mono)] text-[0.8125rem] text-[var(--color-accent)]">
            {value}
            {suffix}
          </span>
        </div>
      )}

      <input
        id={inputId}
        type="range"
        className="range-slider"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        style={{ ['--range-fill' as string]: `${pct}%` }}
        onChange={e => onChange(Number(e.target.value))}
      />

      {error && (
        <span id={errorId} role="alert" className="text-[0.875rem] text-[var(--color-error)]">
          {error}
        </span>
      )}
    </div>
  )
}
