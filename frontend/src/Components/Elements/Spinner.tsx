// Inline loading indicator (button busy state, not data fetch — data uses SkeletonBox §7.4).
// Spin animation auto-disabled by prefers-reduced-motion in Global.css.

interface SpinnerProps {
  size?: number
  className?: string
}

export default function Spinner({ size = 18, className = '' }: SpinnerProps) {
  return (
    <svg
      className={`animate-spin ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label="Memuat"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
