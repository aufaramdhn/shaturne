import { Link } from 'react-router-dom'
import Section from '@/Components/Fragments/UI/Section'
import ProjectCard from '@/Components/Fragments/Cards/ProjectCard'
import ProjectCardSkeleton from '@/Components/Fragments/Cards/ProjectCardSkeleton'
import { ROUTES, localePath } from '@/Constants/routes'
import { useLanguage } from '@/Context/LanguageContext'
import type { Project } from '@/Redux/Features/ProjectSlice'

interface Props {
  featured: Project[]
  isLoading: boolean
}

export default function ProjectsPreviewSection({ featured, isLoading }: Props) {
  const { lang, t } = useLanguage()

  return (
    <Section
      eyebrow={t('projectsPreview.eyebrow')}
      title={t('projectsPreview.title')}
      subtitle={t('projectsPreview.subtitle')}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {isLoading
          ? Array.from({ length: 2 }).map((_, i) => <ProjectCardSkeleton key={i} />)
          : featured.map((project, i) => (
              <ProjectCard key={project.uuid} project={project} index={i} />
            ))}
      </div>
      <Link
        to={localePath(lang, ROUTES.PROJECTS)}
        className="mt-8 inline-flex items-center gap-1 text-[0.9375rem] text-[var(--color-accent)] transition-opacity hover:opacity-80"
      >
        {t('projectsPreview.seeAll')} →
      </Link>
    </Section>
  )
}
