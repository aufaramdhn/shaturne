import { useLanguage } from '@/Context/LanguageContext'
import { dictionaries } from '@/Locales'

interface Props {
  onSelect: (question: string) => void
}

export default function ChatShortcuts({ onSelect }: Props) {
  const { lang } = useLanguage()
  const shortcuts = dictionaries[lang].playground.shortcuts

  return (
    <div className="flex flex-wrap justify-center gap-2 px-5 pb-2 pt-4">
      {shortcuts.map(q => (
        <button
          key={q}
          onClick={() => onSelect(q)}
          className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-2 text-[0.8125rem] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-text)]"
        >
          {q}
        </button>
      ))}
    </div>
  )
}
