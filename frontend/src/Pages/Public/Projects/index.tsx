import { useLocation } from 'react-router-dom'
import { ErrorBoundary } from '@/Components/Elements/ErrorBoundary'
import ProjectsGrid from '@/Components/Fragments/Sections/ProjectsGrid'
import { useLanguage } from '@/Context/LanguageContext'
import { useProjects } from '@/Hooks/Public/useProjects'
import { useSeo, buildAlternates } from '@/Hooks/Common/useSeo'

export default function Projects() {
  const { t } = useLanguage()
  const { pathname } = useLocation()
  const { projects, isLoading, error } = useProjects()

  useSeo({
    title: t('seo.projectsTitle'),
    description: t('seo.projectsDesc'),
    alternates: buildAlternates(pathname),
  })

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
      <header className="max-w-2xl">
        <p className="font-[var(--font-mono)] text-[0.8125rem] uppercase tracking-[0.12em] text-[var(--color-accent)]">
          {isLoading ? '…' : t('projectsPage.entries', { count: projects.length })}
        </p>
        <h1 className="mt-4 text-[length:var(--text-h1)] font-bold leading-[1.1] tracking-[-0.03em] text-[var(--color-text)]">
          {t('projectsPage.title')}
        </h1>
        <p className="mt-4 text-[1.0625rem] leading-[1.7] text-[var(--color-text-muted)]">
          {t('projectsPage.intro')}
        </p>
      </header>

      <ErrorBoundary>
        <ProjectsGrid projects={projects} isLoading={isLoading} error={error} />
      </ErrorBoundary>
    </div>
  )
}
