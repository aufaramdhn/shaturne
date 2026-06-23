import { useEffect, useState } from 'react'
import { getProjects } from '@/Services/Public/projectService'
import type { Project } from '@/Redux/Features/ProjectSlice'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    getProjects()
      .then(data => {
        if (active) {
          setProjects(data)
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (active) {
          setError('Gagal memuat proyek.')
          setIsLoading(false)
        }
      })
    return () => {
      active = false
    }
  }, [])

  return { projects, isLoading, error }
}
