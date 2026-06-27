import Badge from '@/Components/Elements/Badge'

interface SkillGroupProps {
  category: string
  items: string[]
}

export default function SkillGroup({ category, items }: SkillGroupProps) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-5 transition-colors duration-300 hover:border-[var(--color-accent)]/50">
      <span className="font-[var(--font-mono)] text-[0.75rem] uppercase tracking-[0.1em] text-[var(--color-accent)]">
        {category}
      </span>
      <ul className="flex flex-wrap gap-2">
        {items.map(item => (
          <li key={item}>
            <Badge>{item}</Badge>
          </li>
        ))}
      </ul>
    </div>
  )
}
