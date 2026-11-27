import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import SkillLogo, { getSkillAccent } from '@/Components/Elements/SkillLogo'
import Section from '@/Components/Fragments/UI/Section'
import { useLanguage } from '@/Context/LanguageContext'
import type { SkillGroupData } from '@/Hooks/Public/useSkills'

interface Props {
  groups: SkillGroupData[]
  isLoading: boolean
}

export default function SkillsSection({ groups, isLoading }: Props) {
  const { t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = useMemo(() => ['all', ...groups.map(g => g.category)], [groups])

  const visibleItems = useMemo(() => {
    if (activeCategory === 'all') {
      const seen = new Set<string>()
      const list: string[] = []
      for (const group of groups) {
        for (const item of group.items) {
          const key = item.trim().toLowerCase()
          if (!seen.has(key)) {
            seen.add(key)
            list.push(item)
          }
        }
      }
      return list
    }

    return groups.find(g => g.category === activeCategory)?.items ?? []
  }, [activeCategory, groups])

  return (
    <Section eyebrow={t('skills.eyebrow')} title={t('skills.title')}>
      {isLoading ? (
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton-shimmer h-8 w-24 rounded-full" aria-hidden="true" />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3.5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="skeleton-shimmer h-28 rounded-2xl" aria-hidden="true" />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Category filter pills */}
          <div className="flex flex-wrap gap-2" role="tablist" aria-label={t('skills.eyebrow')}>
            {categories.map(category => {
              const isActive = activeCategory === category
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full border px-3.5 py-1.5 font-[var(--font-mono)] text-[0.75rem] uppercase tracking-[0.06em] transition-colors ${
                    isActive
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)] font-semibold text-[var(--color-bg)]'
                      : 'border-[var(--color-border)] bg-[var(--color-surface)]/80 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-text)]'
                  }`}
                >
                  {category === 'all' ? t('skills.all') : category}
                </button>
              )
            })}
          </div>

          {/* Modern logo-first grid */}
          <motion.ul
            key={activeCategory}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="grid grid-cols-3 gap-3.5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
          >
            {visibleItems.map(item => {
              const tint = getSkillAccent(item)
              return (
                <li key={item}>
                  <div
                    title={item}
                    className="group relative flex h-28 flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/85 px-3 py-4 transition-transform duration-200 hover:-translate-y-1 hover:border-[var(--color-accent)]/50"
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        background: `radial-gradient(circle, ${tint}28 0%, transparent 70%)`,
                      }}
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                    <div className="relative z-10 flex h-10 w-10 items-center justify-center transition-transform duration-200 group-hover:scale-110">
                      <SkillLogo name={item} className="h-9 w-9" />
                    </div>
                    <span className="relative z-10 line-clamp-1 max-w-full text-center font-[var(--font-mono)] text-[0.72rem] tracking-[0.02em] text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--color-text)]">
                      {item}
                    </span>
                  </div>
                </li>
              )
            })}
          </motion.ul>
        </div>
      )}
    </Section>
  )
}
