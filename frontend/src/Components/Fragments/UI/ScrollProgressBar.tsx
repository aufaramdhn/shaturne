import { useScroll, useSpring, motion } from 'framer-motion'

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      style={{
        scaleX,
        transformOrigin: 'left',
        boxShadow: 'var(--glow-accent)',
        zIndex: 21,
      }}
      className="fixed left-0 top-0 h-[3px] w-full bg-[var(--color-accent)]"
      aria-hidden="true"
    />
  )
}
