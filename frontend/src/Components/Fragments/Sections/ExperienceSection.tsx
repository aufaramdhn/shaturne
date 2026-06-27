import Section from '@/Components/Fragments/Section'
import { useLanguage } from '@/Context/LanguageContext'
import { periodLabel } from '@/Utils/formatters'
import type { ApiExperience } from '@/Services/Public/experienceService'

interface Props {
  experiences: ApiExperience[]
  isLoading: boolean
}

export default function ExperienceSection({ experiences, isLoading }: Props) {
  const { t } = useLanguage()

  return (
    <Section eyebrow={t('experience.eyebrow')} title={t('experience.title')}>
      {isLoading ? (
        <div className="flex max-w-3xl flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton-shimmer h-36 rounded-xl" aria-hidden="true" />
          ))}
        </div>
      ) : (
        <ol className="flex max-w-3xl flex-col">
          {experiences.map(exp => (
            <li
              key={exp.uuid}
              className="flex flex-col gap-1 border-t border-[var(--color-border)] py-5 first:border-t-0 sm:flex-row sm:gap-8"
            >
              <span className="shrink-0 pt-1 font-[var(--font-mono)] text-[0.8125rem] tracking-[0.04em] text-[var(--color-accent)] sm:w-40">
                {periodLabel(exp.start_date, exp.end_date, t('experience.present'))}
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="text-[1.125rem] font-bold text-[var(--color-text)]">{exp.title}</h3>
                <span className="text-[0.875rem] text-[var(--color-text-muted)]">
                  {exp.organization}
                </span>
                {exp.description && (
                  <p className="mt-1 text-[0.9375rem] leading-relaxed text-[var(--color-text-muted)]">
                    {exp.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </Section>
  )
}
