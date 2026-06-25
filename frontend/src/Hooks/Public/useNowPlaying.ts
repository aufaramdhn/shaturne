import { useEffect, useRef, useState } from 'react'
import { fetchNowPlaying } from '@/Services/Public/nowPlayingService'
import type { NowPlaying } from '@/Services/Public/nowPlayingService'

interface NowPlayingState {
  data: NowPlaying | null
  isLoading: boolean
  /** Interpolated progress 0–1, updated every second locally */
  progress: number
  /** Interpolated progress in milliseconds */
  progressMs: number
}

export function useNowPlaying(intervalMs = 15000): NowPlayingState {
  const [data, setData] = useState<NowPlaying | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [progressMs, setProgressMs] = useState(0)

  // Track when the last poll happened so we can interpolate forward
  const fetchedAtRef = useRef<number>(0)
  const snapshotRef = useRef<Pick<NowPlaying, 'progress_ms' | 'duration_ms'>>({})

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const res = await fetchNowPlaying()
        if (!active) return
        setData(res)
        if (res.is_playing && res.duration_ms) {
          fetchedAtRef.current = Date.now()
          snapshotRef.current = { progress_ms: res.progress_ms ?? 0, duration_ms: res.duration_ms }
        }
      } catch {
        if (active) setData({ is_playing: false })
      } finally {
        if (active) setIsLoading(false)
      }
    }

    load()
    const pollId = window.setInterval(load, intervalMs)
    return () => {
      active = false
      window.clearInterval(pollId)
    }
  }, [intervalMs])

  // Local tick: advance progress_ms by elapsed wall-clock time every second
  useEffect(() => {
    const tickId = window.setInterval(() => {
      const { progress_ms, duration_ms } = snapshotRef.current
      if (!duration_ms) {
        setProgress(0)
        setProgressMs(0)
        return
      }
      const elapsed = Date.now() - fetchedAtRef.current
      const rawMs = Math.min((progress_ms ?? 0) + elapsed, duration_ms)
      setProgress(rawMs / duration_ms)
      setProgressMs(rawMs)
    }, 1000)
    return () => window.clearInterval(tickId)
  }, [])

  return { data, isLoading, progress, progressMs }
}
