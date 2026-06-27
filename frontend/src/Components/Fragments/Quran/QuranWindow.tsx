import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/Context/LanguageContext'
import {
  getQuranGuidance,
  type QuranGuidanceResult,
  type QuranVerse,
} from '@/Services/quranService'

const MAX = 500

function VerseCard({ verse, index }: { verse: QuranVerse; index: number }) {
  const { t } = useLanguage()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)]"
    >
      {/* Surah header */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-3">
        <div className="flex items-center gap-2">
          <span
            className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.12em]"
            style={{ color: 'var(--color-accent)' }}
          >
            Q.S.
          </span>
          <span className="text-[0.9375rem] font-semibold text-[var(--color-text)]">
            {verse.surah_name_latin}
          </span>
          {verse.surah_name_arabic && (
            <span className="text-[0.875rem] text-[var(--color-text-muted)]">
              {verse.surah_name_arabic}
            </span>
          )}
        </div>
        <span className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-0.5 font-[var(--font-mono)] text-[0.75rem] text-[var(--color-text-muted)]">
          {verse.surah_number}:{verse.ayah_number}
        </span>
      </div>

      <div className="flex flex-col gap-4 p-5">
        {/* Arabic text — RTL */}
        <p
          dir="rtl"
          lang="ar"
          className="text-right text-[1.6rem] leading-[2.2] text-[var(--color-text)]"
          style={{
            fontFamily:
              '"Scheherazade New", "Noto Naskh Arabic", "Traditional Arabic", "Times New Roman", serif',
          }}
        >
          {verse.arabic}
        </p>

        {/* Transliteration */}
        <div className="border-t border-[var(--color-border)] pt-4">
          <p className="mb-1 font-[var(--font-mono)] text-[0.65rem] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
            {t('quran.transliterationLabel')}
          </p>
          <p className="font-[var(--font-mono)] text-[0.875rem] italic leading-relaxed text-[var(--color-text-muted)]">
            {verse.transliteration}
          </p>
        </div>

        {/* Translation */}
        <div className="border-t border-[var(--color-border)] pt-4">
          <p className="mb-1 font-[var(--font-mono)] text-[0.65rem] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
            {t('quran.translationLabel')}
          </p>
          <p className="text-[0.9375rem] leading-relaxed text-[var(--color-text)]">
            {verse.translation}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default function QuranWindow() {
  const { t } = useLanguage()
  const [feeling, setFeeling] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<QuranGuidanceResult | null>(null)
  const [error, setError] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!feeling.trim() || loading) return

    setLoading(true)
    setError(false)
    setResult(null)

    try {
      const data = await getQuranGuidance(feeling.trim())
      setResult(data)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const remaining = MAX - feeling.length

  return (
    <div className="flex flex-col gap-5">
      {/* Input card */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="border-b border-[var(--color-border)] px-5 py-4">
          <h2 className="text-[length:var(--text-h3)] font-bold text-[var(--color-text)]">
            {t('quran.title')}
          </h2>
          <p className="mt-0.5 text-[0.8125rem] text-[var(--color-text-muted)]">
            {t('quran.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="relative">
            <textarea
              value={feeling}
              onChange={e => setFeeling(e.target.value.slice(0, MAX))}
              placeholder={t('quran.inputPlaceholder')}
              rows={4}
              disabled={loading}
              className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-3 text-[0.9375rem] leading-relaxed text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-accent)] focus-visible:outline-none disabled:opacity-50"
            />
            <span
              className="absolute bottom-3 right-3 font-[var(--font-mono)] text-[0.7rem]"
              style={{ color: remaining < 50 ? 'var(--color-error)' : 'var(--color-text-muted)' }}
            >
              {t('quran.charCount').replace('{n}', String(feeling.length))}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[0.8125rem] text-[var(--color-error)]"
                >
                  {t('quran.error')}
                </motion.p>
              )}
            </AnimatePresence>
            <button
              type="submit"
              disabled={!feeling.trim() || loading}
              className="ml-auto flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-5 py-2.5 font-semibold text-[oklch(15%_0.024_265)] transition-[opacity,box-shadow] hover:opacity-90 hover:shadow-[var(--glow-accent)] disabled:opacity-40"
            >
              {loading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              )}
              {loading ? t('quran.finding') : t('quran.findButton')}
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-4"
          >
            {/* AI Reflection */}
            {result.reflection && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 px-5 py-4"
              >
                <p className="mb-2 font-[var(--font-mono)] text-[0.65rem] uppercase tracking-[0.12em] text-[var(--color-accent)]">
                  {t('quran.reflectionLabel')}
                </p>
                <p className="text-[0.9375rem] leading-relaxed text-[var(--color-text)]">
                  {result.reflection}
                </p>
              </motion.div>
            )}

            {/* Verses */}
            {result.verses.map((verse, i) => (
              <VerseCard
                key={`${verse.surah_number}:${verse.ayah_number}`}
                verse={verse}
                index={i}
              />
            ))}
          </motion.div>
        )}

        {!result && !loading && !error && (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-[0.875rem] text-[var(--color-text-muted)]"
          >
            {t('quran.emptyState')}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
