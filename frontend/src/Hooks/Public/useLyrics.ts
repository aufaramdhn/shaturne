import { useEffect, useRef, useState } from 'react'
import { fetchLyrics } from '@/Services/Public/lyricsService'
import type { LyricLine } from '@/Services/Public/lyricsService'

interface UseLyricsResult {
  lines: LyricLine[]
  currentIndex: number
  isLoading: boolean
  hasLyrics: boolean
}

export function useLyrics(
  track: string | undefined,
  artist: string | undefined,
  progressMs: number,
): UseLyricsResult {
  const [lines, setLines] = useState<LyricLine[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const prevTrackRef = useRef<string>('')

  useEffect(() => {
    const key = `${track}__${artist}`
    if (!track || !artist || key === prevTrackRef.current) return
    prevTrackRef.current = key
    setLines([])
    setIsLoading(true)

    fetchLyrics(track, artist)
      .then(setLines)
      .catch(() => setLines([]))
      .finally(() => setIsLoading(false))
  }, [track, artist])

  const currentIndex =
    lines.length === 0
      ? -1
      : lines.reduce((best, line, i) => (line.timeMs <= progressMs ? i : best), -1)

  return { lines, currentIndex, isLoading, hasLyrics: lines.length > 0 }
}
