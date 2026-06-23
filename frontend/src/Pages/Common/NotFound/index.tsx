import { Link } from 'react-router-dom'
import { ROUTES, localePath } from '@/Constants/routes'
import { useLanguage } from '@/Context/LanguageContext'
import { useSeo } from '@/Hooks/Common/useSeo'

export default function NotFound() {
  const { lang, t } = useLanguage()

  useSeo({ title: t('seo.notFoundTitle'), noindex: true })

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-start px-5 py-28 sm:px-8">
      <p className="font-[var(--font-mono)] text-[0.8125rem] uppercase tracking-[0.1em] text-[var(--color-accent)]">
        404
      </p>
      <h1 className="mt-4 text-[length:var(--text-h1)] font-bold leading-[1.1] tracking-[-0.03em] text-[var(--color-text)]">
        {t('notFound.title')}
      </h1>
      <p className="mt-4 max-w-[36rem] text-[1.0625rem] leading-[1.7] text-[var(--color-text-muted)]">
        {t('notFound.body')}
      </p>
      <Link
        to={localePath(lang, ROUTES.HOME)}
        className="mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-[var(--color-accent)] px-5 font-semibold text-[var(--color-bg)] transition-[box-shadow,filter] duration-200 hover:shadow-[var(--glow-accent)] hover:brightness-105"
      >
        {t('notFound.home')}
      </Link>
    </div>
  )
}
