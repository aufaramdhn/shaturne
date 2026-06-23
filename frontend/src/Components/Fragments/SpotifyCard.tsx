import { motion } from 'framer-motion'
import { useLanguage } from '@/Context/LanguageContext'
import { useNowPlaying } from '@/Hooks/Public/useNowPlaying'

// Spotify "now playing" card — real data via the Laravel proxy
// (GET /api/v1/now-playing, polled ~30s). Fails soft to an offline state when
// the endpoint is unconfigured/unreachable.

const SPOTIFY_GREEN = '#1DB954'

export default function SpotifyCard() {
  const { t } = useLanguage()
  const { data } = useNowPlaying()

  const online = Boolean(data?.is_playing)
  const progress =
    data?.duration_ms && data.duration_ms > 0
      ? Math.min((data.progress_ms ?? 0) / data.duration_ms, 1)
      : 0

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/90 p-5 shadow-[var(--glow-accent)]">
      {/* header */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
        <span className="flex items-center gap-2 font-[var(--font-mono)] text-[0.75rem] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
          <SpotifyGlyph />
          {online ? t('spotify.playing') : t('spotify.idle')}
        </span>
        <span className="flex items-center gap-1.5 font-[var(--font-mono)] text-[0.7rem]">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background: online ? SPOTIFY_GREEN : 'var(--color-text-muted)',
              boxShadow: online ? `0 0 8px ${SPOTIFY_GREEN}` : 'none',
            }}
          />
          <span style={{ color: online ? SPOTIFY_GREEN : 'var(--color-text-muted)' }}>
            {online ? t('spotify.online') : t('spotify.offline')}
          </span>
        </span>
      </div>

      {online && data ? (
        <>
          <div className="mt-4 flex items-center gap-4">
            {/* album art (real cover when available, else gradient + equalizer) */}
            <div
              className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-lg"
              style={{
                background: `radial-gradient(120% 120% at 30% 20%, ${SPOTIFY_GREEN}, color-mix(in oklch, ${SPOTIFY_GREEN} 30%, var(--color-surface)))`,
              }}
            >
              {data.album_image ? (
                <img
                  src={data.album_image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-7 items-end gap-1">
                  {[0, 1, 2, 3].map(i => (
                    <motion.span
                      key={i}
                      className="w-1 origin-bottom rounded-full bg-[var(--color-bg)]"
                      style={{ height: '100%' }}
                      animate={{ scaleY: [0.3, 1, 0.45, 0.8, 0.3] }}
                      transition={{
                        duration: 1.1,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.15,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              {data.url ? (
                <a
                  href={data.url}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate text-[1rem] font-semibold text-[var(--color-text)] underline-offset-4 hover:underline"
                >
                  {data.track}
                </a>
              ) : (
                <p className="truncate text-[1rem] font-semibold text-[var(--color-text)]">
                  {data.track}
                </p>
              )}
              <p className="truncate text-[0.875rem] text-[var(--color-text-muted)]">
                {data.artist}
              </p>
            </div>
          </div>

          {/* progress bar (scaleX from API progress) */}
          <div className="mt-4 h-1 overflow-hidden rounded-full bg-[var(--color-border)]">
            <div
              className="h-full origin-left rounded-full transition-transform duration-1000 ease-linear"
              style={{ background: SPOTIFY_GREEN, transform: `scaleX(${progress})` }}
            />
          </div>
        </>
      ) : (
        <div className="mt-4 flex flex-col gap-1">
          <p className="text-[1rem] font-semibold text-[var(--color-text)]">
            {t('spotify.offlineTitle')}
          </p>
          <p className="text-[0.875rem] text-[var(--color-text-muted)]">
            {t('spotify.offlineBody')}
          </p>
        </div>
      )}
    </div>
  )
}

function SpotifyGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={SPOTIFY_GREEN} aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.6 14.4a.62.62 0 0 1-.86.21c-2.35-1.44-5.3-1.76-8.79-.96a.62.62 0 1 1-.28-1.21c3.8-.87 7.07-.5 9.71 1.11.3.18.39.57.22.85zm1.23-2.74a.78.78 0 0 1-1.07.26c-2.69-1.65-6.79-2.13-9.97-1.17a.78.78 0 1 1-.45-1.49c3.63-1.1 8.15-.56 11.23 1.33.37.22.49.7.26 1.07zm.11-2.85C14.42 8.78 9.1 8.6 6.04 9.53a.93.93 0 1 1-.54-1.78c3.51-1.07 9.39-.86 13.09 1.34a.93.93 0 1 1-.95 1.6z" />
    </svg>
  )
}
