import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Section from '@/Components/Fragments/UI/Section'
import ProjectCard from '@/Components/Fragments/Cards/ProjectCard'
import ProjectCardSkeleton from '@/Components/Fragments/Cards/ProjectCardSkeleton'
import { ROUTES, localePath } from '@/Constants/routes'
import { useLanguage } from '@/Context/LanguageContext'
import type { Project } from '@/Redux/Features/ProjectSlice'

interface Props {
  featured: Project[]
  isLoading: boolean
}

interface CarouselSlide {
  key: string
  project: Project
  origIdx: number
}

const AUTOPLAY_MS = 4500
const SPRING = { type: 'spring', stiffness: 240, damping: 28, mass: 0.9 } as const

function getRelativeOffset(index: number, active: number, total: number): number {
  if (total <= 1) return 0
  let diff = (index - active + total) % total
  if (diff > total / 2) diff -= total
  return diff
}

export default function ProjectsPreviewSection({ featured, isLoading }: Props) {
  const { lang, t } = useLanguage()
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [tabHidden, setTabHidden] = useState(() => document.hidden)
  const touchStartX = useRef<number | null>(null)

  const count = featured.length

  const slides: CarouselSlide[] = useMemo(() => {
    if (count >= 3 && count < 5) {
      return [
        ...featured.map((project, origIdx) => ({
          key: `${project.uuid}-0`,
          project,
          origIdx,
        })),
        ...featured.map((project, origIdx) => ({
          key: `${project.uuid}-1`,
          project,
          origIdx,
        })),
      ]
    }
    return featured.map((project, origIdx) => ({
      key: project.uuid,
      project,
      origIdx,
    }))
  }, [count, featured])

  const slideCount = slides.length
  const safeActive = slideCount > 0 ? activeIndex % slideCount : 0
  const activeOrigIndex = slideCount > 0 ? slides[safeActive].origIdx : 0

  const next = useCallback(() => {
    if (slideCount <= 1) return
    setActiveIndex(prev => (prev + 1) % slideCount)
  }, [slideCount])

  const prev = useCallback(() => {
    if (slideCount <= 1) return
    setActiveIndex(prev => (prev - 1 + slideCount) % slideCount)
  }, [slideCount])

  const goToOriginal = useCallback(
    (targetOrig: number) => {
      if (slideCount === 0) return
      let bestSlide = 0
      let bestDist = Infinity
      slides.forEach((slide, idx) => {
        if (slide.origIdx !== targetOrig) return
        const dist = Math.abs(getRelativeOffset(idx, safeActive, slideCount))
        if (dist < bestDist) {
          bestDist = dist
          bestSlide = idx
        }
      })
      setActiveIndex(bestSlide)
    },
    [safeActive, slideCount, slides],
  )

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  useEffect(() => {
    if (count <= 1 || paused || tabHidden) return
    const id = window.setInterval(next, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [count, paused, tabHidden, next])

  return (
    <Section
      eyebrow={t('projectsPreview.eyebrow')}
      title={t('projectsPreview.title')}
      subtitle={t('projectsPreview.subtitle')}
    >
      {isLoading ? (
        <div className="relative isolate z-0 mx-auto flex min-h-[34rem] w-full items-center justify-center overflow-hidden py-8 sm:min-h-[38rem]">
          <div className="pointer-events-none absolute hidden w-[88%] max-w-[37rem] -translate-x-[78%] translate-y-6 scale-[0.76] overflow-hidden rounded-2xl bg-[var(--color-surface)] lg:block">
            <ProjectCardSkeleton />
            <div className="absolute inset-0 bg-[var(--color-bg)]/55" />
          </div>
          <div className="pointer-events-none absolute hidden w-[88%] max-w-[37rem] -translate-x-[44%] translate-y-3 scale-[0.88] overflow-hidden rounded-2xl bg-[var(--color-surface)] sm:block">
            <ProjectCardSkeleton />
            <div className="absolute inset-0 bg-[var(--color-bg)]/30" />
          </div>
          <div className="relative z-30 w-[88%] sm:w-[70%] md:w-[35rem] lg:w-[37rem]">
            <ProjectCardSkeleton />
          </div>
          <div className="pointer-events-none absolute hidden w-[88%] max-w-[37rem] translate-x-[44%] translate-y-3 scale-[0.88] overflow-hidden rounded-2xl bg-[var(--color-surface)] sm:block">
            <ProjectCardSkeleton />
            <div className="absolute inset-0 bg-[var(--color-bg)]/30" />
          </div>
          <div className="pointer-events-none absolute hidden w-[88%] max-w-[37rem] translate-x-[78%] translate-y-6 scale-[0.76] overflow-hidden rounded-2xl bg-[var(--color-surface)] lg:block">
            <ProjectCardSkeleton />
            <div className="absolute inset-0 bg-[var(--color-bg)]/55" />
          </div>
        </div>
      ) : (
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          onTouchStart={e => {
            touchStartX.current = e.touches[0]?.clientX ?? null
          }}
          onTouchEnd={e => {
            const start = touchStartX.current
            touchStartX.current = null
            const end = e.changedTouches[0]?.clientX
            if (start === null || end === undefined) return
            const delta = end - start
            if (Math.abs(delta) >= 48) {
              if (delta < 0) next()
              else prev()
            }
          }}
        >
          {/* Center-focused 5-card solid layered stage */}
          <div className="relative isolate z-0 mx-auto flex min-h-[34rem] w-full items-center justify-center overflow-hidden py-8 sm:min-h-[38rem]">
            {slides.map((slide, i) => {
              const offset = getRelativeOffset(i, safeActive, slideCount)
              const isCenter = offset === 0
              const isInner = Math.abs(offset) === 1
              const isOuter = Math.abs(offset) === 2
              const isSide = isInner || isOuter

              const animateState = isCenter
                ? { x: '0%', y: 0, scale: 1, opacity: 1 }
                : offset === -1
                  ? { x: '-44%', y: 12, scale: 0.88, opacity: 1 }
                  : offset === 1
                    ? { x: '44%', y: 12, scale: 0.88, opacity: 1 }
                    : offset === -2
                      ? { x: '-78%', y: 24, scale: 0.76, opacity: 1 }
                      : offset === 2
                        ? { x: '78%', y: 24, scale: 0.76, opacity: 1 }
                        : { x: '0%', y: 32, scale: 0.64, opacity: 0 }

              const zClass = isCenter
                ? 'z-40'
                : isInner
                  ? 'z-30'
                  : isOuter
                    ? 'z-20'
                    : 'z-10 pointer-events-none'

              const dimOverlayClass = isInner
                ? 'bg-[var(--color-bg)]/30'
                : isOuter
                  ? 'bg-[var(--color-bg)]/55'
                  : ''

              return (
                <motion.div
                  key={slide.key}
                  initial={false}
                  animate={animateState}
                  transition={SPRING}
                  className={`absolute w-[88%] will-change-transform sm:w-[70%] md:w-[35rem] lg:w-[37rem] ${zClass}`}
                >
                  {isCenter ? (
                    <div className="rounded-2xl ring-1 ring-[var(--color-accent)]/60 shadow-[var(--glow-accent)]">
                      <ProjectCard project={slide.project} index={slide.origIdx} />
                    </div>
                  ) : (
                    <div className="relative overflow-hidden rounded-2xl bg-[var(--color-surface)]">
                      <div className="pointer-events-none select-none" aria-hidden="true">
                        <ProjectCard project={slide.project} index={slide.origIdx} />
                      </div>
                      {dimOverlayClass && (
                        <div
                          aria-hidden="true"
                          className={`pointer-events-none absolute inset-0 z-10 ${dimOverlayClass}`}
                        />
                      )}
                      {isSide && (
                        <button
                          type="button"
                          onClick={() => setActiveIndex(i)}
                          aria-label={slide.project.title}
                          className="absolute inset-0 z-20 cursor-pointer rounded-2xl focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
                        />
                      )}
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Controls + dots + See all link */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            {count > 1 ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Previous project"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/85 text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)]/60 hover:text-[var(--color-accent)]"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next project"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/85 text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)]/60 hover:text-[var(--color-accent)]"
                  >
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                <div
                  className="flex items-center gap-1.5 px-1"
                  role="tablist"
                  aria-label="Featured projects"
                >
                  {featured.map((project, i) => {
                    const active = i === activeOrigIndex
                    return (
                      <button
                        key={project.uuid}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        aria-label={project.title}
                        onClick={() => goToOriginal(i)}
                        className={`h-2 rounded-full transition-colors duration-200 ${
                          active
                            ? 'w-7 bg-[var(--color-accent)]'
                            : 'w-2 bg-[var(--color-border)] hover:bg-[var(--color-text-muted)]'
                        }`}
                      />
                    )
                  })}
                </div>

                <span className="font-[var(--font-mono)] text-[0.75rem] tabular-nums text-[var(--color-text-muted)]">
                  {String(activeOrigIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
                </span>
              </div>
            ) : (
              <div />
            )}

            <Link
              to={localePath(lang, ROUTES.PROJECTS)}
              className="inline-flex items-center gap-1 text-[0.9375rem] text-[var(--color-accent)] transition-opacity hover:opacity-80"
            >
              {t('projectsPreview.seeAll')} →
            </Link>
          </div>
        </div>
      )}
    </Section>
  )
}
