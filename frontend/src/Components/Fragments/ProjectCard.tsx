import { Link } from 'react-router-dom'
import Badge from '@/Components/Elements/Badge'
import { ROUTES, localePath } from '@/Constants/routes'
import { useLanguage } from '@/Context/LanguageContext'
import { projectAccent } from '@/Utils/formatters'
import type { Project } from '@/Redux/Features/ProjectSlice'

interface ProjectCardProps {
  project: Project
  index?: number
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const { lang } = useLanguage()
  const to = localePath(lang, ROUTES.PROJECT_DETAIL.replace(':slug', project.slug))
  const isCyan = projectAccent(index ?? project.slug) === 'cyan'
  const coverBg = isCyan
    ? 'radial-gradient(120% 120% at 30% 20%, color-mix(in oklch, var(--color-accent) 35%, transparent), transparent 70%)'
    : 'radial-gradient(120% 120% at 30% 20%, color-mix(in oklch, var(--color-accent-2) 38%, transparent), transparent 70%)'
  const initialColor = isCyan ? 'text-[var(--color-accent)]' : 'text-[var(--color-accent-2)]'
  const cover = [...project.images].sort((a, b) => a.order - b.order)[0]

  return (
    <Link
      to={to}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1.5 hover:border-[var(--color-accent)] hover:shadow-[var(--glow-accent)]"
    >
      <div
        className="aspect-[16/10] overflow-hidden border-b border-[var(--color-border)]"
        style={cover ? undefined : { background: coverBg }}
      >
        {cover ? (
          <img
            src={cover.url}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <span
              className={`font-[var(--font-display)] text-[3.5rem] font-bold leading-none ${initialColor}`}
            >
              {project.title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-[1.25rem] font-bold text-[var(--color-text)] transition-colors duration-200 group-hover:text-[var(--color-accent)]">
          {project.title}
        </h3>

        <p className="line-clamp-2 flex-1 text-[0.9375rem] leading-relaxed text-[var(--color-text-muted)]">
          {project.description}
        </p>

        <ul className="flex flex-wrap gap-1.5">
          {project.stack.slice(0, 4).map(s => (
            <li key={s}>
              <Badge>{s}</Badge>
            </li>
          ))}
        </ul>
      </div>
    </Link>
  )
}
