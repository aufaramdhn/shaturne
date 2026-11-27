import { Briefcase, GraduationCap, Users } from 'lucide-react'
import Section from '@/Components/Fragments/UI/Section'
import { useLanguage } from '@/Context/LanguageContext'
import { periodLabel } from '@/Utils/formatters'
import type { ApiExperience } from '@/Services/Public/experienceService'

interface Props {
  experiences: ApiExperience[]
  isLoading: boolean
}

function isWorkType(type: string): boolean {
  const t = type.toLowerCase()
  return t === 'work' || t === 'kerja'
}

function isEducationType(type: string): boolean {
  const t = type.toLowerCase()
  return t === 'education' || t === 'pendidikan'
}

function isOrganizationType(type: string): boolean {
  const t = type.toLowerCase()
  return t === 'organization' || t === 'organisasi'
}

export default function ExperienceSection({ experiences, isLoading }: Props) {
  const { t } = useLanguage()

  const workItems = experiences.filter(exp => isWorkType(exp.type))
  const educationItems = experiences.filter(exp => isEducationType(exp.type))
  const organizationItems = experiences.filter(exp => isOrganizationType(exp.type))

  return (
    <Section eyebrow={t('experience.eyebrow')} title={t('experience.title')}>
      {isLoading ? (
        <div className="grid gap-8 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, col) => (
            <div key={col} className="flex flex-col gap-4">
              <div className="skeleton-shimmer h-7 w-44 rounded-lg" aria-hidden="true" />
              <div className="skeleton-shimmer h-36 rounded-2xl" aria-hidden="true" />
              <div className="skeleton-shimmer h-36 rounded-2xl" aria-hidden="true" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Pengalaman Kerja */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-accent)]">
                    <Briefcase className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h3 className="text-[1.0625rem] font-bold text-[var(--color-text)]">
                    {t('experience.workTitle')}
                  </h3>
                </div>
                <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-0.5 font-[var(--font-mono)] text-[0.75rem] text-[var(--color-text-muted)]">
                  {workItems.length}
                </span>
              </div>

              {workItems.length > 0 ? (
                <ExperienceTimeline items={workItems} presentLabel={t('experience.present')} />
              ) : (
                <div className="flex items-center gap-3 rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)]/50 px-5 py-6 text-[0.9375rem] text-[var(--color-text-muted)]">
                  <Briefcase
                    className="h-4 w-4 shrink-0 text-[var(--color-accent)]"
                    aria-hidden="true"
                  />
                  <span>{t('experience.workEmpty')}</span>
                </div>
              )}
            </div>

            {/* Pendidikan */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-accent-2)]">
                    <GraduationCap className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h3 className="text-[1.0625rem] font-bold text-[var(--color-text)]">
                    {t('experience.educationTitle')}
                  </h3>
                </div>
                <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-0.5 font-[var(--font-mono)] text-[0.75rem] text-[var(--color-text-muted)]">
                  {educationItems.length}
                </span>
              </div>

              <ExperienceTimeline items={educationItems} presentLabel={t('experience.present')} />
            </div>
          </div>

          {organizationItems.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-accent)]">
                    <Users className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h3 className="text-[1.0625rem] font-bold text-[var(--color-text)]">
                    {t('experience.organizationTitle')}
                  </h3>
                </div>
                <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-0.5 font-[var(--font-mono)] text-[0.75rem] text-[var(--color-text-muted)]">
                  {organizationItems.length}
                </span>
              </div>

              <ExperienceTimeline
                items={organizationItems}
                presentLabel={t('experience.present')}
              />
            </div>
          )}
        </div>
      )}
    </Section>
  )
}

function ExperienceTimeline({
  items,
  presentLabel,
}: {
  items: ApiExperience[]
  presentLabel: string
}) {
  return (
    <ol className="relative flex flex-col gap-4 pl-5 before:absolute before:bottom-3 before:left-[0.4375rem] before:top-3 before:w-px before:bg-[var(--color-border)]">
      {items.map(exp => (
        <li
          key={exp.uuid}
          className="relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-5 transition-colors duration-200 hover:border-[var(--color-accent)]/50"
        >
          <span
            aria-hidden="true"
            className="absolute -left-[1.3125rem] top-6 h-2.5 w-2.5 rounded-full border-2 border-[var(--color-bg)] bg-[var(--color-accent)]"
          />
          <span className="font-[var(--font-mono)] text-[0.75rem] tracking-[0.04em] text-[var(--color-accent)]">
            {periodLabel(exp.start_date, exp.end_date, presentLabel)}
          </span>
          <h4 className="mt-1 text-[1.0625rem] font-bold text-[var(--color-text)]">{exp.title}</h4>
          <p className="text-[0.875rem] font-medium text-[var(--color-text-muted)]">
            {exp.organization}
          </p>
          {exp.description && (
            <p className="mt-2 text-[0.875rem] leading-relaxed text-[var(--color-text-muted)]">
              {exp.description}
            </p>
          )}
        </li>
      ))}
    </ol>
  )
}
