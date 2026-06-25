import Badge from '@/Components/Elements/Badge'
import { useLanguage } from '@/Context/LanguageContext'

export default function NotesCard() {
  const { lang } = useLanguage()
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/90 p-5 shadow-[var(--glow-accent)]">
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
        <span className="h-3 w-3 rounded-full bg-[var(--color-error)]" />
        <span className="h-3 w-3 rounded-full bg-[var(--color-accent-2)]" />
        <span className="h-3 w-3 rounded-full bg-[var(--color-accent)]" />
        <span className="ml-2 font-[var(--font-mono)] text-[0.75rem] text-[var(--color-text-muted)]">
          catatan-kerja.md
        </span>
      </div>
      <div className="mt-4 flex flex-col gap-3 font-[var(--font-mono)] text-[0.875rem]">
        <p className="text-[var(--color-accent)]">
          {lang === 'en' ? '# Currently building' : '# Sekarang dibangun'}
        </p>
        <p className="text-[var(--color-text)]">{'// Shaturne Portfolio'}</p>
        <p className="text-[var(--color-text-muted)]">{'// React · TypeScript · Laravel'}</p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          <Badge variant="accent">terdokumentasi</Badge>
          <Badge variant="alt">UUID</Badge>
          <Badge>sanctum</Badge>
        </div>
      </div>
    </div>
  )
}
