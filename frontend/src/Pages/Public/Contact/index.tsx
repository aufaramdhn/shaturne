import { useLocation } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { ErrorBoundary } from '@/Components/Elements/ErrorBoundary'
import SocialIcon, { type SocialPlatform } from '@/Components/Elements/SocialIcon'
import ContactForm from '@/Components/Fragments/Forms/ContactForm'
import { useLanguage } from '@/Context/LanguageContext'
import { useSeo, buildAlternates } from '@/Hooks/Common/useSeo'
import { PROFILE } from '@/Constants/dummyData'

interface DirectLink {
  platform: SocialPlatform
  label: string
  handle: string
  href: string
  external?: boolean
}

const DIRECT_LINKS: DirectLink[] = [
  {
    platform: 'email',
    label: 'Email',
    handle: PROFILE.email,
    href: `mailto:${PROFILE.email}`,
  },
  {
    platform: 'github',
    label: 'GitHub',
    handle: '@aufaramdhn',
    href: PROFILE.github,
    external: true,
  },
  {
    platform: 'instagram',
    label: 'Instagram',
    handle: '@aufaramdhn',
    href: PROFILE.instagram,
    external: true,
  },
  {
    platform: 'tiktok',
    label: 'TikTok',
    handle: '@shaturne',
    href: PROFILE.tiktok,
    external: true,
  },
]

export default function Contact() {
  const { t } = useLanguage()
  const { pathname } = useLocation()

  useSeo({
    title: t('seo.contactTitle'),
    description: t('seo.contactDesc'),
    alternates: buildAlternates(pathname),
  })

  return (
    <div className="mx-auto max-w-[104rem] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
      <div className="mx-auto max-w-5xl">
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

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-16">
          <div>
            <ErrorBoundary>
              <ContactForm />
            </ErrorBoundary>
          </div>

          <aside className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <span className="font-[var(--font-mono)] text-[0.75rem] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                {t('contact.direct')}
              </span>

              <div className="flex flex-col gap-2.5">
                {DIRECT_LINKS.map(item => (
                  <a
                    key={item.platform}
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noreferrer' : undefined}
                    className="group flex items-center gap-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/85 px-3.5 py-3 transition-colors duration-200 hover:border-[var(--color-accent)]/60 hover:bg-[var(--color-surface)]"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] text-[var(--color-accent)] transition-colors group-hover:border-[var(--color-accent)]/40">
                      <SocialIcon name={item.platform} className="h-[1.125rem] w-[1.125rem]" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.875rem] font-semibold text-[var(--color-text)]">
                        {item.label}
                      </span>
                      <span className="block truncate font-[var(--font-mono)] text-[0.75rem] text-[var(--color-text-muted)]">
                        {item.handle}
                      </span>
                    </span>

                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 text-[var(--color-text-muted)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--color-accent)]"
                      aria-hidden="true"
                    />
                  </a>
                ))}
              </div>
            </div>

            <p className="font-[var(--font-mono)] text-[0.8125rem] leading-relaxed text-[var(--color-accent)]">
              {t('contact.reply')}
            </p>
          </aside>
        </div>
      </div>
    </div>
  )
}
