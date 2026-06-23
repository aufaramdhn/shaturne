// Design token references — values live in Global.css CSS custom properties.
// Use these constants when you need token names in TypeScript (e.g. for
// Framer Motion inline styles or dynamic class generation).

export const FONTS = {
  display: 'var(--font-display)',
  body: 'var(--font-body)',
  mono: 'var(--font-mono)',
} as const

export const COLORS = {
  bg: 'var(--color-bg)',
  surface: 'var(--color-surface)',
  surfaceRaised: 'var(--color-surface-raised)',
  text: 'var(--color-text)',
  textMuted: 'var(--color-text-muted)',
  border: 'var(--color-border)',
  accent: 'var(--color-accent)',
  accentStrong: 'var(--color-accent-strong)',
  accent2: 'var(--color-accent-2)',
  error: 'var(--color-error)',
} as const

export const GLOW = 'var(--glow-accent)'

export const Z = {
  dropdown: 'var(--z-dropdown)',
  sticky: 'var(--z-sticky)',
  backdrop: 'var(--z-backdrop)',
  modal: 'var(--z-modal)',
  toast: 'var(--z-toast)',
  tooltip: 'var(--z-tooltip)',
} as const

export const TRANSITION = {
  fast: '150ms ease-out',
  normal: '250ms ease-out',
  slow: '400ms ease-out',
} as const
