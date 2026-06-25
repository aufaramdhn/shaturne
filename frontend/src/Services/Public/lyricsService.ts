export interface LyricLine {
  timeMs: number
  text: string
}

function parseLrc(raw: string): LyricLine[] {
  const lines: LyricLine[] = []
  for (const line of raw.split('\n')) {
    const m = line.match(/^\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)$/)
    if (!m) continue
    const timeMs = Number(m[1]) * 60_000 + Number(m[2]) * 1_000 + Number(m[3].padEnd(3, '0'))
    const text = m[4].trim()
    if (text) lines.push({ timeMs, text })
  }
  return lines
}

export async function fetchLyrics(track: string, artist: string): Promise<LyricLine[]> {
  const url = `https://lrclib.net/api/get?track_name=${encodeURIComponent(track)}&artist_name=${encodeURIComponent(artist)}`
  const res = await fetch(url)
  if (!res.ok) return []
  const json = await res.json()
  if (!json?.syncedLyrics) return []
  return parseLrc(json.syncedLyrics)
}
