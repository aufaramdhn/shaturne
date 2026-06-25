import { motion } from 'framer-motion'
import { staggerContainer, fadeUp } from '@/Animations/variants'
import ProjectCard from '@/Components/Fragments/Cards/ProjectCard'
import ProjectCardSkeleton from '@/Components/Fragments/Cards/ProjectCardSkeleton'
import type { Project } from '@/Redux/Features/ProjectSlice'

interface Props {
  projects: Project[]
  isLoading: boolean
  error: string | null
}

export default function ProjectsGrid({ projects, isLoading, error }: Props) {
  if (error) {
    return <p className="mt-12 text-[var(--color-error)]">{error}</p>
  }

  if (isLoading) {
    return (
      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i}>
            <ProjectCardSkeleton />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <motion.ul
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {projects.map((project, i) => (
        <motion.li key={project.uuid} variants={fadeUp}>
          <ProjectCard project={project} index={i} />
        </motion.li>
      ))}
    </motion.ul>
  )
}
