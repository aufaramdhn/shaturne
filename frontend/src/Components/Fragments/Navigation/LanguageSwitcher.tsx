import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Globe, ChevronDown } from 'lucide-react'
import { useLanguage } from '@/Context/LanguageContext'
import { LANGS } from '@/Locales'
import type { Lang } from '@/Locales'

const LABELS: Record<Lang, { code: string; name: string }> = {
  id: { code: 'ID', name: 'Indonesia' },
  en: { code: 'EN', name: 'English' },
}

export default function LanguageSwitcher() {
  const { lang, switchLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  function choose(next: Lang) {
    switchLang(next)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Ganti bahasa"
        onClick={() => setOpen(o => !o)}
        onKeyDown={e => e.key === 'Escape' && setOpen(false)}
        className="flex h-11 items-center gap-1.5 rounded-lg px-2.5 text-[var(--color-text-muted)] transition-colors duration-200 hover:text-[var(--color-text)]"
      >
        <Globe size={17} aria-hidden="true" />
        <span className="font-[var(--font-mono)] text-[0.8125rem] font-medium tracking-[0.04em]">
          {LABELS[lang].code}
        </span>
        <ChevronDown
          size={13}
          aria-hidden="true"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{ zIndex: 'var(--z-dropdown)' }}
            className="absolute right-0 top-[calc(100%+6px)] w-40 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-1 shadow-lg"
          >
            {LANGS.map(l => {
              const active = l === lang
              return (
                <li key={l}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => choose(l)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[0.9375rem] transition-colors ${
                      active
                        ? 'text-[var(--color-accent)]'
                        : 'text-[var(--color-text)] hover:bg-[var(--color-accent)]/10'
                    }`}
                  >
                    {LABELS[l].name}
                    <span className="font-[var(--font-mono)] text-[0.75rem] text-[var(--color-text-muted)]">
                      {LABELS[l].code}
                    </span>
                  </button>
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
