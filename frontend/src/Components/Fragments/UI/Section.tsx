import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { staggerContainer, fadeUp } from '@/Animations/variants'

// SaaS section: scroll-revealed header (optional eyebrow + title + subtitle) + content.
// Reduced motion → render final state (Framer transforms are JS-driven).

interface SectionProps {
  id?: string
  eyebrow?: string
  title: string
  subtitle?: string
  children: ReactNode
  align?: 'left' | 'center'
  className?: string
}

export default function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  align = 'left',
  className = '',
}: SectionProps) {
  const reduce = useReducedMotion()
  const centered = align === 'center'

  return (
    <motion.section
      id={id}
      variants={staggerContainer}
      initial={reduce ? false : 'hidden'}
      whileInView={reduce ? undefined : 'visible'}
      viewport={{ once: true, amount: 0.2 }}
      className={`mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 ${className}`}
    >
      <div className={centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
        {eyebrow && (
          <motion.span
            variants={fadeUp}
            className="font-[var(--font-mono)] text-[0.8125rem] uppercase tracking-[0.12em] text-[var(--color-accent)]"
          >
            {eyebrow}
          </motion.span>
        )}
        <motion.h2
          variants={fadeUp}
          className="mt-3 text-[length:var(--text-h2)] leading-[1.12] text-[var(--color-text)]"
        >
          {title}
        </motion.h2>
        {subtitle && (
          <motion.p
            variants={fadeUp}
            className="mt-4 text-[1.0625rem] leading-[1.7] text-[var(--color-text-muted)]"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      <motion.div variants={fadeUp} className="mt-12">
        {children}
      </motion.div>
    </motion.section>
  )
}
