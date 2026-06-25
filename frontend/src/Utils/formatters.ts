// Cover tint for a project — deterministic from a seed (index or slug) so cards
// alternate cyan/violet consistently. DB has no `accent` column.
export function projectAccent(seed: string | number): 'cyan' | 'violet' {
  const n =
    typeof seed === 'number' ? seed : seed.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  return n % 2 === 0 ? 'cyan' : 'violet'
}

// Build a period label from ISO dates. `present` is the localized word for an
// ongoing role (e.g. "Sekarang" / "Present").
export function periodLabel(start: string | null, end: string | null, present: string): string {
  const year = (d: string | null) => (d ? d.slice(0, 4) : '')
  const startY = year(start)
  const endY = end ? year(end) : present
  return startY ? `${startY} / ${endY}` : endY
}
