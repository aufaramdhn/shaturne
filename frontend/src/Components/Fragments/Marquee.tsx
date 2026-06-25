import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'

const ITEMS = [
  'React',
  'TypeScript',
  'Laravel',
  'PostgreSQL',
  'Tailwind CSS',
  'Framer Motion',
  'REST API',
  'Sanctum',
  'Redux Toolkit',
  'Web Security',
  'Vite',
  'Git',
]

export default function Marquee() {
  const trackRef = useRef<HTMLUListElement>(null)
  const [width, setWidth] = useState(0)
  const controls = useAnimation()
  const loop = [...ITEMS, ...ITEMS]

  useEffect(() => {
    if (!trackRef.current) return
    // Half of scrollWidth = width of one set of items
    setWidth(trackRef.current.scrollWidth / 2)
  }, [])

  useEffect(() => {
    if (width === 0) return
    controls.start({
      x: [0, -width],
      transition: {
        duration: 28,
        repeat: Infinity,
        ease: 'linear',
        repeatType: 'loop',
      },
    })
  }, [width, controls])

  return (
    <div
      className="relative overflow-hidden border-y border-[var(--color-border)] bg-[var(--color-surface)]/30 py-6"
      onMouseEnter={() => controls.stop()}
      onMouseLeave={() => {
        if (width === 0) return
        controls.start({
          x: [0, -width],
          transition: { duration: 28, repeat: Infinity, ease: 'linear', repeatType: 'loop' },
        })
      }}
    >
      {/* Edge fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[var(--color-bg)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[var(--color-bg)] to-transparent" />

      <motion.ul ref={trackRef} animate={controls} className="flex w-max items-center gap-10">
        {loop.map((item, i) => (
          <li key={`${item}-${i}`} className="flex shrink-0 items-center gap-10">
            <span className="font-[var(--font-display)] text-[1.5rem] font-semibold text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]">
              {item}
            </span>
            <span className="h-1.5 w-1.5 rotate-45 bg-[var(--color-accent)]" aria-hidden="true" />
          </li>
        ))}
      </motion.ul>
    </div>
  )
}
