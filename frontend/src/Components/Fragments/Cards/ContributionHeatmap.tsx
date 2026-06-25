import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGithubContributions } from '@/Hooks/Public/useGithubContributions'
import { useLanguage } from '@/Context/LanguageContext'
import { PROFILE } from '@/Constants/dummyData'
import type { ContributionDay } from '@/Services/Public/githubService'

const MONTHS_ID = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Ags',
  'Sep',
  'Okt',
  'Nov',
  'Des',
]
const MONTHS_EN = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
const DAYS_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
const DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const VISIBLE_DAYS = new Set([1, 3, 5])

const CELL = 18 // px
const GAP = 3 // px
const COL_W = CELL + GAP
const DAY_LBL_W = 32 // px

function cellBg(count: number): string {
  if (count === 0) return 'var(--color-surface-raised)'
  if (count <= 3) return 'color-mix(in oklch, var(--color-accent) 22%, var(--color-surface-raised))'
  if (count <= 7) return 'color-mix(in oklch, var(--color-accent) 48%, var(--color-surface-raised))'
  if (count <= 12)
    return 'color-mix(in oklch, var(--color-accent) 72%, var(--color-surface-raised))'
  return 'var(--color-accent)'
}

interface TooltipState {
  day: ContributionDay
  rect: DOMRect
}

export default function ContributionHeatmap() {
  const { lang } = useLanguage()
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const { data, loading } = useGithubContributions(year)

  const MONTHS = lang === 'id' ? MONTHS_ID : MONTHS_EN
  const DAYS = lang === 'id' ? DAYS_ID : DAYS_EN

  const weeks = data?.weeks ?? []
  const availableYears = data?.availableYears ?? [currentYear]

  const monthLabels: { label: string; col: number }[] = []
  weeks.forEach((week, col) => {
    const month = new Date(week.firstDay).getMonth()
    const prevMonth = col > 0 ? new Date(weeks[col - 1].firstDay).getMonth() : -1
    if (month !== prevMonth) monthLabels.push({ label: MONTHS[month], col })
  })

  function formatDate(dateStr: string) {
    const d = new Date(dateStr)
    return lang === 'id'
      ? `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
      : `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
  }

  function formatCount(count: number) {
    if (count === 0) return lang === 'id' ? 'Tidak ada kontribusi' : 'No contributions'
    return lang === 'id' ? `${count} kontribusi` : `${count} contribution${count !== 1 ? 's' : ''}`
  }

  // Skeleton dimensions match the real grid so no layout shift on load
  const skeletonW = 53 * COL_W + DAY_LBL_W
  const skeletonH = 7 * CELL + 6 * GAP + 20 // +20 for month label row

  return (
    <div className="w-full">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noreferrer"
            className="font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.1em] text-[var(--color-accent)] transition-opacity hover:opacity-70"
          >
            GitHub ↗
          </a>
          <p className="font-[var(--font-display)] text-[1.15rem] font-semibold text-[var(--color-text)]">
            {loading
              ? '···'
              : `${data?.totalContributions ?? 0} ${lang === 'id' ? 'kontribusi di' : 'contributions in'} ${year}`}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {availableYears.map(y => (
            <button
              key={y}
              type="button"
              onClick={() => setYear(y)}
              className="rounded-md px-2.5 py-1 font-[var(--font-mono)] text-[0.75rem] transition-colors"
              style={{
                background: y === year ? 'var(--color-accent)' : 'var(--color-surface-raised)',
                color: y === year ? 'var(--color-bg)' : 'var(--color-text-muted)',
              }}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid area ──────────────────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <div className="mx-auto" style={{ width: 'fit-content' }}>
          {loading ? (
            /* Single shimmer block — cleaner than 27×7 individual cells */
            <div
              className="skeleton-shimmer rounded-xl"
              style={{ width: skeletonW, height: skeletonH }}
            />
          ) : (
            <>
              {/* Month labels */}
              <div className="relative mb-1 h-4" style={{ marginLeft: DAY_LBL_W }}>
                {monthLabels.map(({ label, col }) => (
                  <span
                    key={`${label}-${col}`}
                    className="absolute font-[var(--font-mono)] text-[0.65rem] text-[var(--color-text-muted)]"
                    style={{ left: col * COL_W }}
                  >
                    {label}
                  </span>
                ))}
              </div>

              {/* Day labels + week columns */}
              <div className="flex gap-[3px]">
                <div className="flex flex-col gap-[3px]" style={{ width: DAY_LBL_W }}>
                  {Array.from({ length: 7 }, (_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-end pr-1 font-[var(--font-mono)] text-[0.6rem] text-[var(--color-text-muted)]"
                      style={{ height: CELL }}
                    >
                      {VISIBLE_DAYS.has(i) ? DAYS[i] : ''}
                    </div>
                  ))}
                </div>

                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[3px]">
                    {Array.from({ length: 7 }, (_, dayIndex) => {
                      const day = week.contributionDays.find(d => d.weekday === dayIndex)
                      if (!day) {
                        return (
                          <div
                            key={dayIndex}
                            style={{ width: CELL, height: CELL }}
                            aria-hidden="true"
                          />
                        )
                      }
                      return (
                        <motion.div
                          key={day.date}
                          className="cursor-pointer rounded-[2px]"
                          style={{
                            width: CELL,
                            height: CELL,
                            background: cellBg(day.contributionCount),
                          }}
                          whileHover={{ scale: 1.4 }}
                          transition={{ duration: 0.1 }}
                          onMouseEnter={e =>
                            setTooltip({
                              day,
                              rect: (e.currentTarget as HTMLElement).getBoundingClientRect(),
                            })
                          }
                          onMouseLeave={() => setTooltip(null)}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-3 flex items-center gap-2" style={{ marginLeft: DAY_LBL_W }}>
                <span className="font-[var(--font-mono)] text-[0.6rem] text-[var(--color-text-muted)]">
                  {lang === 'id' ? 'Kurang' : 'Less'}
                </span>
                {[0, 3, 6, 10, 15].map(count => (
                  <div
                    key={count}
                    className="rounded-[2px]"
                    style={{ width: CELL, height: CELL, background: cellBg(count) }}
                  />
                ))}
                <span className="font-[var(--font-mono)] text-[0.6rem] text-[var(--color-text-muted)]">
                  {lang === 'id' ? 'Lebih' : 'More'}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Tooltip — portalled to body ────────────────────────────────── */}
      {createPortal(
        <AnimatePresence>
          {tooltip && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.12 }}
              className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-2.5 py-1.5 shadow-lg"
              style={{
                left: tooltip.rect.left + tooltip.rect.width / 2,
                top: tooltip.rect.top - 8,
              }}
            >
              <p className="whitespace-nowrap font-[var(--font-mono)] text-[0.7rem] font-semibold text-[var(--color-text)]">
                {formatCount(tooltip.day.contributionCount)}
              </p>
              <p className="whitespace-nowrap font-[var(--font-mono)] text-[0.65rem] text-[var(--color-text-muted)]">
                {formatDate(tooltip.day.date)}
              </p>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  )
}
