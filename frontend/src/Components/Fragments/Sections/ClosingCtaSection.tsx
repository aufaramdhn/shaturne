import { Link } from 'react-router-dom'
import { ROUTES, localePath } from '@/Constants/routes'
import { useLanguage } from '@/Context/LanguageContext'

const CTA_PRIMARY =
  'inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 font-semibold text-[var(--color-bg)] transition-[box-shadow,filter,transform] duration-200 hover:shadow-[var(--glow-accent)] hover:brightness-105 active:scale-[0.98]'

export default function ClosingCtaSection() {
  const { lang, t } = useLanguage()

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-10 sm:p-14">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-30 blur-[90px]"
          style={{ background: 'var(--color-accent)' }}
          aria-hidden="true"
        />
        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[length:var(--text-h2)] text-[var(--color-text)]">
              {t('closing.title')}
            </h2>
            <p className="mt-2 text-[1rem] text-[var(--color-text-muted)]">
              {t('closing.subtitle')}
            </p>
          </div>
          <Link to={localePath(lang, ROUTES.CONTACT)} className={`${CTA_PRIMARY} shrink-0`}>
            {t('closing.cta')} →
          </Link>
        </div>
      </div>
    </section>
  )
}
