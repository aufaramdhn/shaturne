// Base skeleton atom (§7.4) — compose all skeletons from this.
// Shimmer keyframe lives in Global.css (.skeleton-shimmer).

interface SkeletonBoxProps {
  width?: string | number
  height?: string | number
  radius?: string | number
  className?: string
}

export default function SkeletonBox({
  width = '100%',
  height = '1rem',
  radius = '6px',
  className = '',
}: SkeletonBoxProps) {
  return (
    <div
      className={`skeleton-shimmer ${className}`}
      style={{ width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  )
}
