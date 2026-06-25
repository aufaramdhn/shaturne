import { useLocation } from 'react-router-dom'
import { useSeo, buildAlternates } from '@/Hooks/Common/useSeo'
import { ErrorBoundary } from '@/Components/Elements/ErrorBoundary'
import Marquee from '@/Components/Fragments/Marquee'
import ScrollProgressBar from '@/Components/Fragments/ScrollProgressBar'
import HeroSection from '@/Components/Fragments/Sections/HeroSection'
import AboutSection from '@/Components/Fragments/Sections/AboutSection'
import SkillsSection from '@/Components/Fragments/Sections/SkillsSection'
import ExperienceSection from '@/Components/Fragments/Sections/ExperienceSection'
import ProjectsPreviewSection from '@/Components/Fragments/Sections/ProjectsPreviewSection'
import ClosingCtaSection from '@/Components/Fragments/Sections/ClosingCtaSection'
import { useLanguage } from '@/Context/LanguageContext'
import { useProjects } from '@/Hooks/Public/useProjects'
import { useSkills } from '@/Hooks/Public/useSkills'
import { useExperience } from '@/Hooks/Public/useExperience'
import { PROFILE } from '@/Constants/dummyData'

export default function Home() {
  const { t } = useLanguage()
  const { pathname } = useLocation()
  const { projects, isLoading: projectsLoading } = useProjects()
  const { groups, isLoading: skillsLoading } = useSkills()
  const { experiences, isLoading: expLoading } = useExperience()

  const origin = window.location.origin
  useSeo({
    title: t('seo.homeTitle'),
    description: t('seo.homeDesc'),
    type: 'profile',
    alternates: buildAlternates(pathname),
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: PROFILE.name,
        jobTitle: t('seo.jobTitle'),
        url: origin,
        description: t('seo.homeDesc'),
        sameAs: [PROFILE.github],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Shaturne',
        url: origin,
      },
    ],
  })

  return (
    <div>
      <ScrollProgressBar />
      <HeroSection projectCount={projects.length} projectsLoading={projectsLoading} />
      <Marquee />
      <ErrorBoundary>
        <AboutSection />
      </ErrorBoundary>
      <ErrorBoundary>
        <SkillsSection groups={groups} isLoading={skillsLoading} />
      </ErrorBoundary>
      <ErrorBoundary>
        <ExperienceSection experiences={experiences} isLoading={expLoading} />
      </ErrorBoundary>
      <ErrorBoundary>
        <ProjectsPreviewSection featured={projects.slice(0, 2)} isLoading={projectsLoading} />
      </ErrorBoundary>
      <ClosingCtaSection />
    </div>
  )
}
