import { useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import type { RefObject } from 'react'

interface ScrollRevealOptions {
  amount?: number
  margin?: string
}

export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  options: ScrollRevealOptions = {},
): { ref: RefObject<T | null>; isInView: boolean; shouldReduceMotion: boolean } {
  const ref = useRef<T>(null)
  const shouldReduceMotion = useReducedMotion() ?? false
  const isInView = useInView(ref, {
    once: true,
    amount: options.amount ?? 0.2,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    margin: (options.margin ?? '-60px') as any,
  })

  return { ref, isInView, shouldReduceMotion }
}
