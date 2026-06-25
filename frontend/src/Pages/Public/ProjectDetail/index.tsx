import { Link, useLocation, useParams } from 'react-router-dom'
import { ErrorBoundary } from '@/Components/Elements/ErrorBoundary'
import Badge from '@/Components/Elements/Badge'
import ProjectDetailSkeleton from '@/Components/Fragments/Cards/ProjectDetailSkeleton'
import { ROUTES, localePath } from '@/Constants/routes'
import { useLanguage } from '@/Context/LanguageContext'
import { useProject } from '@/Hooks/Public/useProject'
import { useSeo, buildAlternates } from '@/Hooks/Common/useSeo'
import { projectAccent } from '@/Utils/formatters'
import ScrollProgressBar from '@/Components/Fragments/ScrollProgressBar'

export default function ProjectDetail() {
  const { lang, t } = useLanguage()
  const { pathname } = useLocation()
  const { slug } = useParams<{ slug: string }>()
  const { project, isLoading, notFound } = useProject(slug)

  // Hooks must run before any early return — compute SEO with null-safe fallbacks.
  const images = project ? [...project.images].sort((a, b) => a.order - b.order) : []
  useSeo({
    title: project
      ? t('seo.projectTitleTpl', { title: project.title })
      : notFound
        ? t('seo.notFoundTitle')
        : 'Shaturne',
    description: project?.description.slice(0, 155),
    image: images[0]?.url,
    type: 'article',
    noindex: notFound,
    alternates: buildAlternates(pathname),
    jsonLd: project
      ? {
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: project.title,
          description: project.description,
          ...(images[0] ? { image: images[0].url } : {}),
          ...(project.repo_url ? { codeRepository: project.repo_url } : {}),
          ...(project.demo_url ? { url: project.demo_url } : {}),
        }
      : undefined,
  })

  if (isLoading) return <ProjectDetailSkeleton />

  if (notFound || !project) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8">
        <p className="font-[var(--font-mono)] text-[0.8125rem] uppercase tracking-[0.1em] text-[var(--color-accent)]">
          404
        </p>
        <h1 className="mt-4 text-[length:var(--text-h1)] font-bold text-[var(--color-text)]">
          {t('projectDetail.notFoundTitle')}
        </h1>
        <Link
          to={localePath(lang, ROUTES.PROJECTS)}
          className="mt-6 inline-block text-[0.9375rem] text-[var(--color-accent)] underline underline-offset-4 transition-opacity hover:opacity-80"
        >
          ← {t('projectDetail.backList')}
        </Link>
      </div>
    )
  }

  const isCyan = projectAccent(project.slug) === 'cyan'
  const coverBg = isCyan
    ? 'radial-gradient(120% 120% at 30% 20%, color-mix(in oklch, var(--color-accent) 32%, transparent), transparent 70%)'
    : 'radial-gradient(120% 120% at 30% 20%, color-mix(in oklch, var(--color-accent-2) 35%, transparent), transparent 70%)'
  const initialColor = isCyan ? 'text-[var(--color-accent)]' : 'text-[var(--color-accent-2)]'

  return (
    <ErrorBoundary>
      <article className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <ScrollProgressBar />
        <Link
          to={localePath(lang, ROUTES.PROJECTS)}
          className="text-[0.9375rem] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
        >
          ← {t('projectDetail.back')}
        </Link>

        <header className="mt-6">
          <h1 className="text-[length:var(--text-h1)] font-bold leading-[1.1] tracking-[-0.03em] text-[var(--color-text)]">
            {project.title}
          </h1>
        </header>

        {images.length > 0 ? (
          <>
            <div className="mt-10 aspect-[16/9] overflow-hidden rounded-2xl border border-[var(--color-border)]">
              <img src={images[0].url} alt={project.title} className="h-full w-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {images.slice(1).map(img => (
                  <div
                    key={img.path}
                    className="aspect-square overflow-hidden rounded-xl border border-[var(--color-border)]"
                  >
                    <img
                      src={img.url}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div
            className="mt-10 grid aspect-[16/9] place-items-center rounded-2xl border border-[var(--color-border)]"
            style={{ background: coverBg }}
          >
            <span
              className={`font-[var(--font-display)] text-[5rem] font-bold leading-none ${initialColor}`}
            >
              {project.title.charAt(0)}
            </span>
          </div>
        )}

        <div className="mt-10 flex flex-col gap-4 text-[1.0625rem] leading-[1.75] text-[var(--color-text)]">
          <p>{project.description}</p>
        </div>

        <div className="mt-8">
          <span className="font-[var(--font-mono)] text-[0.75rem] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
            {t('projectDetail.stack')}
          </span>
          <ul className="mt-3 flex flex-wrap gap-2">
            {project.stack.map(s => (
              <li key={s}>
                <Badge>{s}</Badge>
              </li>
            ))}
          </ul>
        </div>

        {(project.repo_url || project.demo_url) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--color-border)] px-5 font-medium text-[var(--color-text)] transition-colors duration-200 hover:border-[var(--color-accent)]"
              >
                {t('projectDetail.repo')}
              </a>
            )}
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--color-accent)] px-5 font-semibold text-[var(--color-bg)] transition-[box-shadow,filter] duration-200 hover:shadow-[var(--glow-accent)] hover:brightness-105"
              >
                {t('projectDetail.demo')}
              </a>
            )}
          </div>
        )}
      </article>
    </ErrorBoundary>
  )
}
