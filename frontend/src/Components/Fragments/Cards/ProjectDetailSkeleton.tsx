import SkeletonBox from '@/Components/Elements/SkeletonBox'

export default function ProjectDetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <SkeletonBox width="6rem" height="0.8rem" />
      <div className="mt-4 flex flex-col gap-3">
        <SkeletonBox width="70%" height="2.5rem" />
        <SkeletonBox width="40%" height="1rem" />
      </div>

      <div className="mt-6 flex gap-2">
        <SkeletonBox width="4rem" height="1.1rem" radius="6px" />
        <SkeletonBox width="3.5rem" height="1.1rem" radius="6px" />
        <SkeletonBox width="4.5rem" height="1.1rem" radius="6px" />
      </div>

      <div className="skeleton-shimmer mt-10 aspect-[16/9] w-full rounded-xl" aria-hidden="true" />

      <div className="mt-10 flex flex-col gap-3">
        <SkeletonBox width="100%" height="1rem" />
        <SkeletonBox width="95%" height="1rem" />
        <SkeletonBox width="90%" height="1rem" />
        <SkeletonBox width="60%" height="1rem" />
      </div>
    </div>
  )
}
