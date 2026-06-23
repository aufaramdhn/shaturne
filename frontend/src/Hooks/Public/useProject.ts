import { useEffect, useState } from 'react'
import { getProject } from '@/Services/Public/projectService'
import type { Project } from '@/Redux/Features/ProjectSlice'

// ProjectDetail remounts per route (AnimatePresence keyed on pathname), so the
// no-slug / reset cases are handled via initial state — no synchronous setState
// inside the effect.
export function useProject(slug: string | undefined) {
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(Boolean(slug))
  const [notFound, setNotFound] = useState(!slug)

  useEffect(() => {
    if (!slug) return
    let active = true
    getProject(slug)
      .then(data => {
        if (active) {
          setProject(data)
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (active) {
          setNotFound(true)
          setIsLoading(false)
        }
      })
    return () => {
      active = false
    }
  }, [slug])

  return { project, isLoading, notFound }
}
