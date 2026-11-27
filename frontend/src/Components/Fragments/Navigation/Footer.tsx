import { Link } from 'react-router-dom'
import SocialIcon, { type SocialPlatform } from '@/Components/Elements/SocialIcon'
import { ROUTES, localePath } from '@/Constants/routes'
import { useLanguage } from '@/Context/LanguageContext'
import { PROFILE } from '@/Constants/dummyData'

const FOOTER_SOCIALS: { platform: SocialPlatform; label: string; href: string }[] = [
  { platform: 'github', label: 'GitHub', href: PROFILE.github },
  { platform: 'instagram', label: 'Instagram', href: PROFILE.instagram },
  { platform: 'tiktok', label: 'TikTok', href: PROFILE.tiktok },
]

export default function Footer() {
  const { lang, t } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 border-t border-[var(--color-border)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-12 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div className="flex flex-col gap-2">
          <Link
            to={localePath(lang, ROUTES.HOME)}
            className="font-[var(--font-display)] text-[1.35rem] font-bold tracking-[-0.02em] text-[var(--color-text)]"
          >
            Shaturne
          </Link>
          <p className="max-w-xs text-[0.9375rem] text-[var(--color-text-muted)]">
            {t('footer.tagline')}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <nav className="flex flex-wrap items-center gap-5 text-[0.9375rem] text-[var(--color-text-muted)]">
            <Link
              to={localePath(lang, ROUTES.PROJECTS)}
              className="transition-colors hover:text-[var(--color-text)]"
            >
              {t('nav.projects')}
            </Link>
            <Link
              to={localePath(lang, ROUTES.CONTACT)}
              className="transition-colors hover:text-[var(--color-text)]"
            >
              {t('nav.contact')}
            </Link>

            <div className="flex items-center gap-2 border-l border-[var(--color-border)] pl-4">
              {FOOTER_SOCIALS.map(item => (
                <a
                  key={item.platform}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  title={item.label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]/80 text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)]/60 hover:text-[var(--color-accent)]"
                >
                  <SocialIcon name={item.platform} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </nav>

          <p className="font-[var(--font-mono)] text-[0.75rem] tracking-[0.04em] text-[var(--color-text-muted)]">
            © {year} {PROFILE.name}
          </p>
        </div>
      </div>
    </footer>
  )
}
