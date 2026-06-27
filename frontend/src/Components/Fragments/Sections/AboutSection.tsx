import { motion } from 'framer-motion'
import Section from '@/Components/Fragments/UI/Section'
import NotesCard from '@/Components/Fragments/Cards/NotesCard'
import ContributionHeatmap from '@/Components/Fragments/Cards/ContributionHeatmap'
import { useLanguage } from '@/Context/LanguageContext'

export default function AboutSection() {
  const { t } = useLanguage()

  return (
    <Section eyebrow={t('about.eyebrow')} title={t('about.title')}>
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div className="flex flex-col gap-4 text-[1.0625rem] leading-[1.75] text-[var(--color-text)]">
          <p>{t('about.p1')}</p>
          <p>{t('about.p2')}</p>
        </div>
        <NotesCard />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mt-10 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 p-6 sm:p-8"
      >
        <ContributionHeatmap />
      </motion.div>
    </Section>
  )
}
