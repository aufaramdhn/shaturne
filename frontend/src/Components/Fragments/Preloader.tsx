import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// Initial-load screen (themed). A short multilingual greeting cycles in/out,
// then the brand reveals; finally the whole panel wipes upward to show the app.

const GREETINGS = ['Halo', 'Hello', 'Hola', 'Selamat datang']
const WORD_MS = 520

export default function Preloader() {
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<'words' | 'brand'>('words')
  const [done, setDone] = useState(false)

  useEffect(() => {
    const timers: number[] = []
    GREETINGS.forEach((_, i) => {
      if (i > 0) timers.push(window.setTimeout(() => setIndex(i), i * WORD_MS))
    })
    timers.push(window.setTimeout(() => setPhase('brand'), GREETINGS.length * WORD_MS))
    timers.push(window.setTimeout(() => setDone(true), GREETINGS.length * WORD_MS + 1400))
    return () => timers.forEach(t => window.clearTimeout(t))
  }, [])

  const total = (GREETINGS.length * WORD_MS + 1400) / 1000

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          exit={{ y: '-100%', transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[var(--color-bg)]"
        >
          {/* top progress bar — fills across the whole intro */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: total, ease: 'easeInOut' }}
            style={{ transformOrigin: 'left', boxShadow: 'var(--glow-accent)' }}
            className="absolute left-0 top-0 h-[3px] w-full bg-[var(--color-accent)]"
          />

          <div className="grid min-h-[6rem] place-items-center px-6 text-center">
            <AnimatePresence mode="wait">
              {phase === 'words' ? (
                <motion.span
                  key={`w-${index}`}
                  initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -18, filter: 'blur(6px)' }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  className="text-[length:var(--text-h1)] font-bold tracking-[-0.02em] text-[var(--color-text-muted)]"
                >
                  {GREETINGS[index]}
                </motion.span>
              ) : (
                <motion.div
                  key="brand"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center gap-5"
                >
                  <h1 className="text-[length:var(--text-hero)] font-bold tracking-[-0.03em] text-[var(--color-text)]">
                    Shaturne
                  </h1>
                  <p className="font-[var(--font-mono)] text-[0.8125rem] uppercase tracking-[0.25em] text-[var(--color-accent)]">
                    catatan kerja
                  </p>
                  <div className="flex gap-2">
                    {[0, 1, 2].map(i => (
                      <motion.span
                        key={i}
                        className="h-2 w-2 rounded-full bg-[var(--color-accent)]"
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.18,
                          ease: 'easeInOut',
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
