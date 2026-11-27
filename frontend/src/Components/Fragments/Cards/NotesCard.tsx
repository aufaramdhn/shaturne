import { useLanguage } from '@/Context/LanguageContext'

export default function NotesCard() {
  const { lang } = useLanguage()

  const commentText =
    lang === 'en'
      ? '// Fullstack web developer & CS student'
      : '// Fullstack web developer & mahasiswa Informatika'

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 shadow-[var(--glow-accent)]">
      {/* Editor window bar */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface-raised)]/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[var(--color-error)]" />
          <span className="h-3 w-3 rounded-full bg-[var(--color-accent-2)]" />
          <span className="h-3 w-3 rounded-full bg-[var(--color-accent)]" />
          <span className="ml-2 font-[var(--font-mono)] text-[0.75rem] text-[var(--color-text-muted)]">
            profile.ts
          </span>
        </div>
        <span className="rounded bg-[#3178C6]/20 px-2 py-0.5 font-[var(--font-mono)] text-[0.6875rem] font-semibold tracking-wider text-[#60A5FA]">
          TS
        </span>
      </div>

      {/* TypeScript code block */}
      <div className="overflow-x-auto p-5 font-[var(--font-mono)] text-[0.8125rem] leading-[1.75]">
        <CodeLine n={1}>
          <span className="text-[var(--color-text-muted)]">{commentText}</span>
        </CodeLine>
        <CodeLine n={2}>
          <span className="text-[var(--color-accent-2)]">interface</span>{' '}
          <span className="text-[var(--color-accent)]">Developer</span> {'{'}
        </CodeLine>
        <CodeLine n={3}>
          {'  '}name: <span className="text-[var(--color-accent)]">string</span>; role:{' '}
          <span className="text-[var(--color-accent)]">string</span>
        </CodeLine>
        <CodeLine n={4}>
          {'  '}education: <span className="text-[var(--color-accent)]">string</span>[]
        </CodeLine>
        <CodeLine n={5}>
          {'  '}internships: <span className="text-[var(--color-accent)]">string</span>[]
        </CodeLine>
        <CodeLine n={6}>
          {'  '}stack: <span className="text-[var(--color-accent)]">string</span>[]; openToWork:{' '}
          <span className="text-[var(--color-accent)]">boolean</span>
        </CodeLine>
        <CodeLine n={7}>{'}'}</CodeLine>
        <CodeLine n={8}>
          <span className="text-[var(--color-accent-2)]">export const</span>{' '}
          <span className="text-[var(--color-text)]">aufa</span>:{' '}
          <span className="text-[var(--color-accent)]">Developer</span> = {'{'}
        </CodeLine>
        <CodeLine n={9}>
          {'  '}name: <Str>&apos;Aufa Ramadhan&apos;</Str>,
        </CodeLine>
        <CodeLine n={10}>
          {'  '}role: <Str>&apos;Fullstack Developer&apos;</Str>,
        </CodeLine>
        <CodeLine n={11}>
          {'  '}education: [<Str>&apos;Universitas Pasundan&apos;</Str>,{' '}
          <Str>&apos;SMK Bina Mandiri Multi Media (RPL)&apos;</Str>],
        </CodeLine>
        <CodeLine n={12}>
          {'  '}internships: [<Str>&apos;Kodingin.id (POS Gunajaya)&apos;</Str>,{' '}
          <Str>&apos;Dewarangga&apos;</Str>],
        </CodeLine>
        <CodeLine n={13}>
          {'  '}stack: [<Str>&apos;React&apos;</Str>, <Str>&apos;TypeScript&apos;</Str>,{' '}
          <Str>&apos;Laravel&apos;</Str>, <Str>&apos;PostgreSQL&apos;</Str>],
        </CodeLine>
        <CodeLine n={14}>
          {'  '}openToWork: <span className="text-[var(--color-accent)]">true</span>,
        </CodeLine>
        <CodeLine n={15}>{'}'}</CodeLine>
      </div>
    </div>
  )
}

function CodeLine({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex whitespace-pre">
      <span className="w-7 shrink-0 select-none text-right text-[var(--color-text-muted)]/45">
        {n}
      </span>
      <span className="ml-4 text-[var(--color-text)]">{children}</span>
    </div>
  )
}

function Str({ children }: { children: React.ReactNode }) {
  return <span className="text-[var(--color-code-string)]">{children}</span>
}
