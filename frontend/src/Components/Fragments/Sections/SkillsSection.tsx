import Section from '@/Components/Fragments/UI/Section'
import SkillGroup from '@/Components/Fragments/Sections/SkillGroup'
import { useLanguage } from '@/Context/LanguageContext'
import type { SkillGroupData } from '@/Hooks/Public/useSkills'

interface Props {
  groups: SkillGroupData[]
  isLoading: boolean
}

export default function SkillsSection({ groups, isLoading }: Props) {
  const { t } = useLanguage()

  return (
    <Section eyebrow={t('skills.eyebrow')} title={t('skills.title')}>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton-shimmer h-40 rounded-2xl" aria-hidden="true" />
            ))
          : groups.map(group => (
              <SkillGroup key={group.category} category={group.category} items={group.items} />
            ))}
      </div>
    </Section>
  )
}
