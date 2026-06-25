import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { staggerContainer, fadeUp } from '@/Animations/variants'
import SpotifyCard from '@/Components/Fragments/Cards/SpotifyCard'
import { ROUTES, localePath } from '@/Constants/routes'
import { useLanguage } from '@/Context/LanguageContext'
import { tx } from '@/Locales'
import { PROFILE } from '@/Constants/dummyData'

const CTA_PRIMARY =
  'inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 font-semibold text-[var(--color-bg)] transition-[box-shadow,filter,transform] duration-200 hover:shadow-[var(--glow-accent)] hover:brightness-105 active:scale-[0.98]'
const CTA_SECONDARY =
  'inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 px-6 font-medium text-[var(--color-text)] transition-[border-color,box-shadow] duration-200 hover:border-[var(--color-accent)] hover:shadow-[var(--glow-accent)]'

interface Props {
  projectCount: number
  projectsLoading: boolean
}

export default function HeroSection({ projectCount, projectsLoading }: Props) {
  const { lang, t } = useLanguage()

  const stats = [
    { value: '2+', label: t('hero.statYears') },
    { value: projectsLoading ? '…' : String(projectCount), label: t('hero.statProjects') },
    { value: '3', label: t('hero.statDisciplines') },
  ]

  return (
    <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pt-20 pb-16 sm:px-8 sm:pt-28 lg:grid-cols-[1.1fr_0.9fr]">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible">
        <motion.div variants={fadeUp}>
          <span className="font-[var(--font-mono)] text-[0.8125rem] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            {PROFILE.location}
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="mt-6 text-[length:var(--text-hero)] font-bold leading-[1.04] tracking-[-0.03em] text-[var(--color-text)]"
        >
          {t('hero.headlineA')}{' '}
          <span className="text-[var(--color-accent)]">{t('hero.headlineHi')}</span>
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

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="flex justify-center"
      >
        <SpotifyCard />
      </motion.div>
    </section>
  )
}
