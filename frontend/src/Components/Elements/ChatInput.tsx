import { useState, type KeyboardEvent } from 'react'
import { useLanguage } from '@/Context/LanguageContext'

interface Props {
  onSend: (text: string) => void
  disabled?: boolean
}

export default function ChatInput({ onSend, disabled }: Props) {
  const { t } = useLanguage()
  const [value, setValue] = useState('')

  const handleSend = () => {
    if (!value.trim() || disabled) return
    onSend(value.trim())
    setValue('')
  }

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex gap-3 border-t border-[var(--color-border)] p-4">
      <textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKey}
        disabled={disabled}
        placeholder={t('playground.inputPlaceholder')}
        rows={1}
        maxLength={500}
        className="flex-1 resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-2.5 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-accent)] focus-visible:outline-none disabled:opacity-50"
      />
      <button
        type="button"
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className="rounded-lg bg-[var(--color-accent)] px-4 py-2.5 font-medium text-[oklch(15%_0.024_265)] transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {t('playground.sendButton')}
      </button>
    </div>
  )
}
