import { useCallback, useEffect, useState } from 'react'

// Generic read hook. `fn` must be a stable reference (module-level service fn).
export function useFetch<T>(fn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(() => {
    setIsLoading(true)
    setError(null)
    fn()
      .then(d => {
        setData(d)
        setIsLoading(false)
      })
      .catch(() => {
        setError('Gagal memuat data.')
        setIsLoading(false)
      })
  }, [fn])

  useEffect(() => {
    let active = true
    fn()
      .then(d => {
        if (active) {
          setData(d)
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (active) {
          setError('Gagal memuat data.')
          setIsLoading(false)
        }
      })
    return () => {
      active = false
    }
  }, [fn])

  return { data, isLoading, error, reload }
}
