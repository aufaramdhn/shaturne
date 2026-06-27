import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/Context/LanguageContext'
import { getSkills, type ApiSkill } from '@/Services/Public/skillService'

function groupByCategory(skills: ApiSkill[]): Map<string, ApiSkill[]> {
  const map = new Map<string, ApiSkill[]>()
  for (const s of skills) {
    const list = map.get(s.category) ?? []
    list.push(s)
    map.set(s.category, list)
  }
  return map
}

export default function TechStackWindow() {
  const { t } = useLanguage()
  const [skills, setSkills] = useState<ApiSkill[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    let active = true
    getSkills()
      .then(data => {
        if (active) {
          setSkills(data)
          setLoading(false)
        }
      })
      .catch(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const grouped = groupByCategory(skills)
  const categories = ['all', ...Array.from(grouped.keys())]
  const filtered = activeCategory === 'all' ? skills : (grouped.get(activeCategory) ?? [])

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="border-b border-[var(--color-border)] px-5 py-4">
        <h2 className="text-[length:var(--text-h3)] font-bold text-[var(--color-text)]">
          {t('techstack.title')}
        </h2>
        <p className="mt-0.5 text-[0.8125rem] text-[var(--color-text-muted)]">
          {t('techstack.subtitle')}
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 border-b border-[var(--color-border)] px-5 py-3">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton-shimmer h-7 w-20 rounded-full" />
            ))
          : categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-3 py-1 text-[0.8125rem] font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-[var(--color-accent)] text-[oklch(15%_0.024_265)]'
                    : 'bg-[var(--color-surface-raised)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                {cat === 'all' ? t('techstack.all') : cat}
              </button>
            ))}
      </div>

      {/* Skills grid */}
      <div className="p-5">
        {loading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton-shimmer h-14 rounded-xl" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
              {filtered.map((skill, i) => (
                <motion.div
                  key={skill.uuid}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.025 }}
                  className="flex flex-col gap-2 rounded-xl bg-[var(--color-surface-raised)] px-4 py-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[0.9375rem] font-medium text-[var(--color-text)]">
                      {skill.name}
                    </span>
                    <span className="font-[var(--font-mono)] text-[0.75rem] text-[var(--color-text-muted)]">
                      {skill.proficiency}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-surface)]">
                    <motion.div
                      className="h-full rounded-full bg-[var(--color-accent)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.proficiency}%` }}
                      transition={{ duration: 0.5, delay: i * 0.025 + 0.1, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
