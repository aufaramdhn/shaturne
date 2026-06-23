import { useEffect, useState } from 'react'
import { fetchNowPlaying } from '@/Services/Public/nowPlayingService'
import type { NowPlaying } from '@/Services/Public/nowPlayingService'

// Polls the Spotify now-playing proxy. Fails soft to offline so the card never
// breaks when the endpoint is unconfigured or unreachable.
export function useNowPlaying(intervalMs = 30000): { data: NowPlaying | null; isLoading: boolean } {
  const [data, setData] = useState<NowPlaying | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const res = await fetchNowPlaying()
        if (active) setData(res)
      } catch {
        if (active) setData({ is_playing: false })
      } finally {
        if (active) setIsLoading(false)
      }
    }

    load()
    const id = window.setInterval(load, intervalMs)
    return () => {
      active = false
      window.clearInterval(id)
    }
  }, [intervalMs])

  return { data, isLoading }
}
