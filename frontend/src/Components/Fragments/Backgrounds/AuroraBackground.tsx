// Ambient cyan/violet glow drifting behind content. Kept cheap: smaller blur
// radius + will-change so the blobs stay on their own compositor layer. Heavy
// backdrop-blur on surfaces above this was removed for performance.

export default function AuroraBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 'var(--z-aurora)' }}
    >
      <div
        className="aurora-blob absolute -left-[8%] -top-[12%] h-[42vh] w-[42vh] rounded-full opacity-35 blur-[70px] animate-[aurora-drift_22s_ease-in-out_infinite]"
        style={{ background: 'var(--color-accent)', willChange: 'transform' }}
      />
      <div
        className="aurora-blob absolute -right-[6%] top-[26%] h-[40vh] w-[40vh] rounded-full opacity-30 blur-[80px] animate-[aurora-drift_28s_ease-in-out_infinite_reverse]"
        style={{ background: 'var(--color-accent-2)', willChange: 'transform' }}
      />
    </div>
  )
}
