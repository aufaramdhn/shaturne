import SkeletonBox from '@/Components/Elements/SkeletonBox'

// Mirrors ProjectCard shape exactly (§7.4). Used in Phase 4 async loading.

export default function ProjectCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="skeleton-shimmer aspect-[16/10] w-full" aria-hidden="true" />
      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <SkeletonBox width="55%" height="1.25rem" />
          <SkeletonBox width="3.5rem" height="1.1rem" radius="6px" />
        </div>
        <SkeletonBox width="100%" height="0.9rem" />
        <SkeletonBox width="80%" height="0.9rem" />
        <div className="flex gap-1.5 pt-1">
          <SkeletonBox width="3.5rem" height="1.1rem" radius="6px" />
          <SkeletonBox width="3rem" height="1.1rem" radius="6px" />
          <SkeletonBox width="4rem" height="1.1rem" radius="6px" />
        </div>
        <SkeletonBox width="2.5rem" height="0.75rem" />
      </div>
    </div>
  )
}
