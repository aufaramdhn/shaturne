import type { Variants } from 'framer-motion'

// Page transition presets for use with <AnimatePresence mode="wait">
export const pageEnter: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
}

export const pageExit: Variants = {
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
}

export const pageTransition = {
  ...pageEnter,
  ...pageExit,
}
