import { useEffect, useState } from 'react'
import { getExperiences } from '@/Services/Public/experienceService'
import type { ApiExperience } from '@/Services/Public/experienceService'

export function useExperience() {
  const [experiences, setExperiences] = useState<ApiExperience[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    getExperiences()
      .then(data => {
        if (active) {
          setExperiences(data)
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (active) {
          setError('Gagal memuat pengalaman.')
          setIsLoading(false)
        }
      })
    return () => {
      active = false
    }
  }, [])

  return { experiences, isLoading, error }
}
