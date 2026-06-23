import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSeo, buildAlternates } from '@/Hooks/Common/useSeo'
import { staggerContainer, fadeUp } from '@/Animations/variants'
import Section from '@/Components/Fragments/Section'
import Marquee from '@/Components/Fragments/Marquee'
import SkillGroup from '@/Components/Fragments/SkillGroup'
import ProjectCard from '@/Components/Fragments/ProjectCard'
import ProjectCardSkeleton from '@/Components/Fragments/ProjectCardSkeleton'
import SpotifyCard from '@/Components/Fragments/SpotifyCard'
import NotesCard from '@/Components/Fragments/NotesCard'
import { ROUTES, localePath } from '@/Constants/routes'
import { useLanguage } from '@/Context/LanguageContext'
import { tx } from '@/Locales'
import { useProjects } from '@/Hooks/Public/useProjects'
import { useSkills } from '@/Hooks/Public/useSkills'
import { useExperience } from '@/Hooks/Public/useExperience'
import { periodLabel } from '@/Utils/formatters'
import { PROFILE } from '@/Constants/dummyData'

const CTA_PRIMARY =
  'inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 font-semibold text-[var(--color-bg)] transition-[box-shadow,filter,transform] duration-200 hover:shadow-[var(--glow-accent)] hover:brightness-105 active:scale-[0.98]'
const CTA_SECONDARY =
  'inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 px-6 font-medium text-[var(--color-text)] transition-[border-color,box-shadow] duration-200 hover:border-[var(--color-accent)] hover:shadow-[var(--glow-accent)]'

export default function Home() {
  const { lang, t } = useLanguage()
  const { pathname } = useLocation()
  const { projects, isLoading: projectsLoading } = useProjects()
  const { groups, isLoading: skillsLoading } = useSkills()
  const { experiences, isLoading: expLoading } = useExperience()

  const origin = window.location.origin
  useSeo({
    title: t('seo.homeTitle'),
    description: t('seo.homeDesc'),
    type: 'profile',
    alternates: buildAlternates(pathname),
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: PROFILE.name,
        jobTitle: t('seo.jobTitle'),
        url: origin,
        description: t('seo.homeDesc'),
        ...(PROFILE.github !== 'https://github.com/' ? { sameAs: [PROFILE.github] } : {}),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Shaturne',
        url: origin,
      },
    ],
  })

  const featured = projects.slice(0, 2)

  const stats = [
    { value: '2+', label: t('hero.statYears') },
    { value: projectsLoading ? '—' : String(projects.length), label: t('hero.statProjects') },
    { value: '3', label: t('hero.statDisciplines') },
  ]

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pt-20 pb-16 sm:px-8 sm:pt-28 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <span className="h-px w-8 bg-[var(--color-accent)]" aria-hidden="true" />
            <span className="font-[var(--font-mono)] text-[0.8125rem] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              {PROFILE.role} · {PROFILE.location}
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-6 text-[length:var(--text-hero)] font-bold leading-[1.04] tracking-[-0.03em] text-[var(--color-text)]"
          >
            {t('hero.headlineA')}{' '}
            <span className="text-[var(--color-accent)]">{t('hero.headlineHi')}</span>{' '}
            {t('hero.headlineB')}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-[34rem] text-[1.0625rem] leading-[1.7] text-[var(--color-text-muted)]"
          >
            {tx(PROFILE.framing, lang)}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap gap-3">
            <Link to={localePath(lang, ROUTES.PROJECTS)} className={CTA_PRIMARY}>
              {t('hero.ctaProjects')} →
            </Link>
            <Link to={localePath(lang, ROUTES.CONTACT)} className={CTA_SECONDARY}>
              {t('hero.ctaContact')}
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-12 flex gap-8">
            {stats.map(stat => (
              <div key={stat.label} className="flex flex-col">
                <span className="font-[var(--font-display)] text-[1.75rem] font-bold text-[var(--color-text)]">
                  {stat.value}
                </span>
                <span className="font-[var(--font-mono)] text-[0.75rem] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Spotify now-playing (mock — real API Phase 5) */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <SpotifyCard />
        </motion.div>
      </section>

      {/* ── Marquee (skill jalan) ────────────────────────────────────── */}
      <Marquee />

      {/* ── About ────────────────────────────────────────────────────── */}
      <Section eyebrow={t('about.eyebrow')} title={t('about.title')}>
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="flex flex-col gap-4 text-[1.0625rem] leading-[1.75] text-[var(--color-text)]">
            <p>{t('about.p1')}</p>
            <p>{t('about.p2')}</p>
          </div>
          <NotesCard />
        </div>
      </Section>

      {/* ── Skills ───────────────────────────────────────────────────── */}
      <Section eyebrow={t('skills.eyebrow')} title={t('skills.title')}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skillsLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton-shimmer h-40 rounded-2xl" aria-hidden="true" />
              ))
            : groups.map(group => (
                <SkillGroup key={group.category} category={group.category} items={group.items} />
              ))}
        </div>
      </Section>

      {/* ── Experience ───────────────────────────────────────────────── */}
      <Section eyebrow={t('experience.eyebrow')} title={t('experience.title')}>
        {expLoading ? (
          <div className="flex max-w-3xl flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton-shimmer h-24 rounded-xl" aria-hidden="true" />
            ))}
          </div>
        ) : (
          <ol className="flex max-w-3xl flex-col">
            {experiences.map(exp => (
              <li
                key={exp.uuid}
                className="flex flex-col gap-1 border-t border-[var(--color-border)] py-5 first:border-t-0 sm:flex-row sm:gap-8"
              >
                <span className="shrink-0 pt-1 font-[var(--font-mono)] text-[0.8125rem] tracking-[0.04em] text-[var(--color-accent)] sm:w-40">
                  {periodLabel(exp.start_date, exp.end_date, t('experience.present'))}
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-[1.125rem] font-bold text-[var(--color-text)]">
                    {exp.title}{' '}
                    <span className="font-normal text-[var(--color-text-muted)]">
                      · {exp.organization}
                    </span>
                  </h3>
                  {exp.description && (
                    <p className="text-[0.9375rem] leading-relaxed text-[var(--color-text-muted)]">
                      {exp.description}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </Section>

      {/* ── Projects preview ─────────────────────────────────────────── */}
      <Section
        eyebrow={t('projectsPreview.eyebrow')}
        title={t('projectsPreview.title')}
        subtitle={t('projectsPreview.subtitle')}
      >
        <div className="grid gap-6 sm:grid-cols-2">
          {projectsLoading
            ? Array.from({ length: 2 }).map((_, i) => <ProjectCardSkeleton key={i} />)
            : featured.map((project, i) => (
                <ProjectCard key={project.uuid} project={project} index={i} />
              ))}
        </div>
        <Link
          to={localePath(lang, ROUTES.PROJECTS)}
          className="mt-8 inline-flex items-center gap-1 text-[0.9375rem] text-[var(--color-accent)] transition-opacity hover:opacity-80"
        >
          {t('projectsPreview.seeAll')} →
        </Link>
      </Section>

      {/* ── Closing CTA ──────────────────────────────────────────────── */}
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
    </div>
  )
}
