import { useLocation } from 'react-router-dom'
import { ErrorBoundary } from '@/Components/Elements/ErrorBoundary'
import ContactForm from '@/Components/Fragments/Forms/ContactForm'
import { useLanguage } from '@/Context/LanguageContext'
import { useSeo, buildAlternates } from '@/Hooks/Common/useSeo'
import { PROFILE } from '@/Constants/dummyData'

export default function Contact() {
  const { t } = useLanguage()
  const { pathname } = useLocation()

  useSeo({
    title: t('seo.contactTitle'),
    description: t('seo.contactDesc'),
    alternates: buildAlternates(pathname),
  })

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
      <header className="max-w-2xl">
        <p className="font-[var(--font-mono)] text-[0.8125rem] uppercase tracking-[0.12em] text-[var(--color-accent)]">
          {t('contact.eyebrow')}
        </p>
        <h1 className="mt-4 text-[length:var(--text-h1)] font-bold leading-[1.1] tracking-[-0.03em] text-[var(--color-text)]">
          {t('contact.title')}
        </h1>
        <p className="mt-4 text-[1.0625rem] leading-[1.7] text-[var(--color-text-muted)]">
          {t('contact.intro')}
        </p>
      </header>

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <div className="max-w-[40rem]">
          <ErrorBoundary>
            <ContactForm />
          </ErrorBoundary>
        </div>

        <aside className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <span className="font-[var(--font-mono)] text-[0.75rem] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
              {t('contact.direct')}
            </span>
            <a
              href={`mailto:${PROFILE.email}`}
              className="text-[0.9375rem] text-[var(--color-text)] underline underline-offset-4 transition-opacity hover:opacity-80"
            >
              {PROFILE.email}
            </a>
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noreferrer"
              className="text-[0.9375rem] text-[var(--color-text)] underline underline-offset-4 transition-opacity hover:opacity-80"
            >
              GitHub
            </a>
          </div>

          <p className="font-[var(--font-mono)] text-[0.8125rem] leading-relaxed text-[var(--color-accent)]">
            {t('contact.reply')}
          </p>
        </aside>
      </div>
    </div>
  )
}
