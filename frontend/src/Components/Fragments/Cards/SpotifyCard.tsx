import { AnimatePresence, motion } from 'framer-motion'
import { useLanguage } from '@/Context/LanguageContext'
import { useNowPlaying } from '@/Hooks/Public/useNowPlaying'
import { useLyrics } from '@/Hooks/Public/useLyrics'
import { useTheme } from '@/Context/ThemeContext'

const GREEN = '#1DB954'
const GREEN_DIM = 'rgba(29,185,84,0.18)'

export default function SpotifyCard() {
  const { t } = useLanguage()
  const { theme } = useTheme()
  const { data, progress, progressMs } = useNowPlaying()
  const { lines, currentIndex, hasLyrics } = useLyrics(data?.track, data?.artist, progressMs)

  const online = Boolean(data?.is_playing)
  const isLight = theme === 'light'

  const prevLine = currentIndex > 0 ? lines[currentIndex - 1] : null
  const currLine = currentIndex >= 0 ? lines[currentIndex] : null
  const nextLine =
    currentIndex >= 0 && currentIndex < lines.length - 1 ? lines[currentIndex + 1] : null

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.015 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-sm overflow-hidden rounded-3xl border"
      style={{
        borderColor: isLight ? 'rgba(0,0,0,0.12)' : 'var(--color-border)',
        boxShadow: online
          ? isLight
            ? `0 0 0 1px ${GREEN_DIM}, 0 8px 32px -8px rgba(29,185,84,0.18), 0 4px 24px rgba(0,0,0,0.15)`
            : `0 0 0 1px ${GREEN_DIM}, 0 8px 40px -8px rgba(29,185,84,0.25), 0 2px 12px rgba(0,0,0,0.4)`
          : isLight
            ? '0 4px 24px rgba(0,0,0,0.12)'
            : '0 2px 12px rgba(0,0,0,0.4)',
      }}
    >
      {/* ── Album art background ──────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={data?.track ?? 'idle'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          {online && data?.album_image ? (
            <img
              src={data.album_image}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-110 object-cover"
              style={{ filter: 'blur(28px) brightness(0.35) saturate(1.4)' }}
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(120% 80% at 50% 0%, oklch(22% 0.05 265), oklch(15% 0.024 265))',
              }}
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(10,12,20,0.3) 0%, rgba(10,12,20,0.7) 50%, rgba(10,12,20,0.97) 100%)',
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col">
        {/* Status bar */}
        <div className="flex items-start justify-between px-5 pt-5">
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 backdrop-blur-sm">
            <SpotifyGlyph size={12} />
            <span className="font-[var(--font-mono)] text-[0.65rem] uppercase tracking-[0.1em] text-white/70">
              {online ? t('spotify.playing') : t('spotify.idle')}
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 backdrop-blur-sm">
            <motion.span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: online ? GREEN : 'rgba(255,255,255,0.3)' }}
              animate={online ? { scale: [1, 1.4, 1], opacity: [1, 0.6, 1] } : {}}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span
              className="font-[var(--font-mono)] text-[0.65rem] uppercase tracking-[0.1em]"
              style={{ color: online ? GREEN : 'rgba(255,255,255,0.4)' }}
            >
              {online ? t('spotify.online') : t('spotify.offline')}
            </span>
          </div>
        </div>

        {/* Album cover */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`art-${data?.track ?? 'idle'}`}
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -8 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-5 h-[148px] w-[148px] overflow-hidden rounded-2xl shadow-2xl"
            style={{
              boxShadow: online
                ? `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px ${GREEN_DIM}`
                : '0 8px 32px rgba(0,0,0,0.6)',
            }}
          >
            {online && data?.album_image ? (
              <img src={data.album_image} alt="" className="h-full w-full object-cover" />
            ) : (
              <div
                className="grid h-full w-full place-items-center"
                style={{
                  background: 'linear-gradient(135deg, oklch(24% 0.032 265), oklch(19% 0.028 265))',
                }}
              >
                <SpotifyGlyph size={48} opacity={0.3} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Track info */}
        <div className="mt-4 px-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={`info-${data?.track ?? 'idle'}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex items-start justify-between gap-3"
            >
              <div className="min-w-0">
                {online && data ? (
                  <>
                    {data.url ? (
                      <a
                        href={data.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block truncate text-[1.0625rem] font-bold leading-snug text-white transition-opacity hover:opacity-80"
                      >
                        {data.track}
                      </a>
                    ) : (
                      <p className="truncate text-[1.0625rem] font-bold leading-snug text-white">
                        {data.track}
                      </p>
                    )}
                    <p className="mt-0.5 truncate text-[0.875rem] text-white/55">{data.artist}</p>
                  </>
                ) : (
                  <>
                    <p className="text-[1.0625rem] font-bold leading-snug text-white/80">
                      {t('spotify.offlineTitle')}
                    </p>
                    <p className="mt-0.5 text-[0.875rem] text-white/40">
                      {t('spotify.offlineBody')}
                    </p>
                  </>
                )}
              </div>
              {online && (
                <div className="flex shrink-0 items-end gap-[3px] pb-1" style={{ height: 28 }}>
                  {[0, 1, 2, 3].map(i => (
                    <motion.span
                      key={i}
                      className="w-[3px] origin-bottom rounded-full"
                      style={{ background: GREEN }}
                      animate={{ scaleY: [0.25, 1, 0.5, 0.85, 0.25] }}
                      transition={{
                        duration: 0.9 + i * 0.15,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.18,
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Lyrics ───────────────────────────────────────────────────── */}
        {online && hasLyrics && (
          <div className="mx-5 mt-4 overflow-hidden rounded-xl border border-white/8 bg-black/30 px-4 py-3 backdrop-blur-sm">
            <div className="flex flex-col gap-1 text-center">
              {/* Previous line */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={`prev-${currentIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="truncate text-[0.75rem] leading-relaxed text-white/25"
                >
                  {prevLine?.text ?? ''}
                </motion.p>
              </AnimatePresence>

              {/* Current line */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={`curr-${currentIndex}`}
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="truncate text-[0.9375rem] font-semibold leading-relaxed"
                  style={{ color: GREEN }}
                >
                  {currLine?.text ?? '♪'}
                </motion.p>
              </AnimatePresence>

              {/* Next line */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={`next-${currentIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="truncate text-[0.75rem] leading-relaxed text-white/25"
                >
                  {nextLine?.text ?? ''}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Progress bar */}
        <div className="mt-4 px-5 pb-5">
          <div className="h-[3px] overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full origin-left rounded-full"
              style={{ background: GREEN }}
              animate={{ scaleX: online ? progress : 0 }}
              transition={{ duration: 0.9, ease: 'linear' }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function SpotifyGlyph({ size = 16, opacity = 1 }: { size?: number; opacity?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={GREEN}
      aria-hidden="true"
      style={{ opacity }}
    >
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.6 14.4a.62.62 0 0 1-.86.21c-2.35-1.44-5.3-1.76-8.79-.96a.62.62 0 1 1-.28-1.21c3.8-.87 7.07-.5 9.71 1.11.3.18.39.57.22.85zm1.23-2.74a.78.78 0 0 1-1.07.26c-2.69-1.65-6.79-2.13-9.97-1.17a.78.78 0 1 1-.45-1.49c3.63-1.1 8.15-.56 11.23 1.33.37.22.49.7.26 1.07zm.11-2.85C14.42 8.78 9.1 8.6 6.04 9.53a.93.93 0 1 1-.54-1.78c3.51-1.07 9.39-.86 13.09 1.34a.93.93 0 1 1-.95 1.6z" />
    </svg>
  )
}
