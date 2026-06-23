import { motion, useReducedMotion } from 'framer-motion'

// Infinite horizontal marquee of tech/skills. Items rendered twice and the
// track translates 0 → -50% for a seamless loop. Reduced motion → static wrap.

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
  const reduce = useReducedMotion()
  const loop = [...ITEMS, ...ITEMS]

  return (
    <div className="relative overflow-hidden border-y border-[var(--color-border)] bg-[var(--color-surface)]/30 py-6">
      {/* edge fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[var(--color-bg)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[var(--color-bg)] to-transparent" />

      <motion.ul
        className="flex w-max items-center gap-10"
        animate={reduce ? undefined : { x: ['0%', '-50%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      >
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
