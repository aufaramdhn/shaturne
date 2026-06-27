import { useState, useEffect } from 'react'
import { useLanguage } from '@/Context/LanguageContext'
import ContributionHeatmap from '@/Components/Fragments/Cards/ContributionHeatmap'
import { PROFILE } from '@/Constants/dummyData'

const GH_USER = PROFILE.github.split('/').pop() as string

interface GhProfile {
  public_repos: number
  followers: number
  following: number
}

interface GhRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  language: string | null
  fork: boolean
}

export default function GitHubWindow() {
  const { t } = useLanguage()
  const [profile, setProfile] = useState<GhProfile | null>(null)
  const [repos, setRepos] = useState<GhRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [rateLimited, setRateLimited] = useState(false)

  useEffect(() => {
    let active = true
    Promise.all([
      fetch(`https://api.github.com/users/${GH_USER}`).then(r => {
        if (r.status === 403) throw new Error('rate_limit')
        return r.json() as Promise<GhProfile>
      }),
      fetch(
        `https://api.github.com/users/${GH_USER}/repos?sort=updated&per_page=8&type=public`,
      ).then(r => r.json() as Promise<GhRepo[]>),
    ])
      .then(([prof, reps]) => {
        if (!active) return
        setProfile(prof)
        setRepos(reps.filter(r => !r.fork).slice(0, 6))
        setLoading(false)
      })
      .catch(err => {
        if (!active) return
        if ((err as Error).message === 'rate_limit') setRateLimited(true)
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const stats = [
    { label: t('github.repos'), value: profile?.public_repos },
    { label: t('github.followers'), value: profile?.followers },
    { label: t('github.following'), value: profile?.following },
  ]

  return (
    <div className="flex flex-col gap-5">
      {rateLimited && (
        <p className="rounded-xl border border-[var(--color-error)]/30 bg-[var(--color-error)]/10 px-4 py-3 text-[0.875rem] text-[var(--color-error)]">
          {t('github.rateLimit')}
        </p>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-center"
          >
            <p className="text-[1.75rem] font-bold tabular-nums text-[var(--color-text)]">
              {loading ? '···' : (value ?? '—')}
            </p>
            <p className="mt-0.5 text-[0.8125rem] text-[var(--color-text-muted)]">{label}</p>
          </div>
        ))}
      </div>

      {/* Contribution heatmap */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <ContributionHeatmap />
      </div>

      {/* Top repos */}
      <div>
        <p className="mb-3 font-[var(--font-mono)] text-[0.75rem] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
          {t('github.topRepos')}
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton-shimmer h-24 rounded-xl" />
              ))
            : repos.map(repo => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:border-[var(--color-accent)]/50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-[0.9375rem] text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)]">
                      {repo.name}
                    </span>
                    {repo.stargazers_count > 0 && (
                      <span className="shrink-0 font-[var(--font-mono)] text-[0.75rem] text-[var(--color-text-muted)]">
                        ★ {repo.stargazers_count}
                      </span>
                    )}
                  </div>
                  {repo.description && (
                    <p className="line-clamp-2 text-[0.8125rem] text-[var(--color-text-muted)]">
                      {repo.description}
                    </p>
                  )}
                  {repo.language && (
                    <span className="font-[var(--font-mono)] text-[0.75rem] text-[var(--color-accent)]">
                      {repo.language}
                    </span>
                  )}
                </a>
              ))}
        </div>
      </div>
    </div>
  )
}
