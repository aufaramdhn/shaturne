import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  const cancelAnimRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 360)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimRef.current?.()
    }
  }, [])

  function smoothScrollToTop() {
    cancelAnimRef.current?.()

    const startY = window.scrollY
    if (startY <= 0) return

    const duration = Math.min(1300, Math.max(750, startY * 0.45))
    const startTime = performance.now()
    const prevBehavior = document.documentElement.style.scrollBehavior
    document.documentElement.style.scrollBehavior = 'auto'

    let rafId = 0
    let stopped = false

    const stop = () => {
      if (stopped) return
      stopped = true
      if (rafId) window.cancelAnimationFrame(rafId)
      document.documentElement.style.scrollBehavior = prevBehavior
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchstart', stop)
      if (cancelAnimRef.current === stop) {
        cancelAnimRef.current = null
      }
    }

    cancelAnimRef.current = stop
    window.addEventListener('wheel', stop, { passive: true })
    window.addEventListener('touchstart', stop, { passive: true })

    const step = (now: number) => {
      if (stopped) return
      const elapsed = now - startTime
      const progress = Math.min(1, elapsed / duration)
      const eased = easeInOutCubic(progress)
      window.scrollTo(0, startY * (1 - eased))

      if (progress < 1) {
        rafId = window.requestAnimationFrame(step)
      } else {
        stop()
      }
    }

    rafId = window.requestAnimationFrame(step)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={smoothScrollToTop}
          aria-label="Scroll to top"
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-[var(--z-sticky)] flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/95 text-[var(--color-text)] shadow-lg transition-[transform,border-color,color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:shadow-[var(--glow-accent)]"
        >
          <ArrowUp className="h-4 w-4" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
