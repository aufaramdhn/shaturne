import { useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// Custom image uploader (§ Security: client pre-check mirrors the server MIME
// whitelist; the server is still the source of truth). Pure Element — the
// upload/remove transport is injected by the page (no Service import here).

export interface MediaItem {
  path: string
  url: string
}

interface PendingUpload {
  id: string
  name: string
  progress: number
  error?: string
}

interface FileUploadProps {
  value: MediaItem[]
  onChange: (items: MediaItem[]) => void
  onUpload: (file: File, onProgress: (p: number) => void) => Promise<MediaItem>
  onRemove?: (path: string) => Promise<void> | void
  label?: string
  error?: string
  maxFiles?: number
}

const ACCEPT = ['image/jpeg', 'image/png', 'image/webp']
const MAX_BYTES = 4 * 1024 * 1024

export default function FileUpload({
  value,
  onChange,
  onUpload,
  onRemove,
  label,
  error,
  maxFiles = 6,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [pending, setPending] = useState<PendingUpload[]>([])
  const [dragging, setDragging] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const inputId = useId()

  const total = value.length + pending.length
  const full = total >= maxFiles

  function validate(file: File): string | null {
    if (!ACCEPT.includes(file.type)) return 'Format harus JPG, PNG, atau WEBP.'
    if (file.size > MAX_BYTES) return 'Ukuran maksimal 4 MB.'
    return null
  }

  async function uploadOne(file: File) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    setPending(p => [...p, { id, name: file.name, progress: 0 }])
    try {
      const item = await onUpload(file, progress =>
        setPending(p => p.map(u => (u.id === id ? { ...u, progress } : u))),
      )
      setPending(p => p.filter(u => u.id !== id))
      onChange([...value, item])
    } catch {
      setPending(p => p.map(u => (u.id === id ? { ...u, error: 'Gagal mengunggah.' } : u)))
    }
  }

  function handleFiles(files: FileList | null) {
    if (!files?.length) return
    setNotice(null)
    let slots = maxFiles - total
    for (const file of Array.from(files)) {
      if (slots <= 0) {
        setNotice(`Maksimal ${maxFiles} gambar.`)
        break
      }
      const problem = validate(file)
      if (problem) {
        setNotice(problem)
        continue
      }
      void uploadOne(file)
      slots--
    }
  }

  async function remove(item: MediaItem) {
    onChange(value.filter(i => i.path !== item.path))
    if (onRemove) {
      try {
        await onRemove(item.path)
      } catch {
        /* orphaned file is harmless; the record is already detached */
      }
    }
  }

  function makeCover(index: number) {
    if (index === 0) return
    const next = [...value]
    const [picked] = next.splice(index, 1)
    next.unshift(picked)
    onChange(next)
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-[0.875rem] font-medium text-[var(--color-text)]">{label}</span>
      )}

      {/* Drop zone */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={e => {
          e.preventDefault()
          if (!full) setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => {
          e.preventDefault()
          setDragging(false)
          if (!full) handleFiles(e.dataTransfer.files)
        }}
        disabled={full}
        className={[
          'flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed px-5 py-7 text-center',
          'transition-colors duration-200',
          'disabled:cursor-not-allowed disabled:opacity-40',
          dragging
            ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/8'
            : error
              ? 'border-[var(--color-error)]'
              : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/60',
        ].join(' ')}
      >
        <span className="text-[1.5rem] leading-none text-[var(--color-accent)]" aria-hidden="true">
          ↑
        </span>
        <span className="text-[0.9375rem] font-medium text-[var(--color-text)]">
          {full ? 'Batas gambar tercapai' : 'Seret gambar atau klik untuk unggah'}
        </span>
        <span className="font-[var(--font-mono)] text-[0.7rem] text-[var(--color-text-muted)]">
          JPG · PNG · WEBP, maks 4 MB · {value.length}/{maxFiles}
        </span>
      </button>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPT.join(',')}
        multiple
        className="hidden"
        onChange={e => {
          handleFiles(e.target.files)
          e.target.value = '' // allow re-picking the same file
        }}
      />

      {(error || notice) && (
        <span role="alert" className="text-[0.875rem] text-[var(--color-error)]">
          {error ?? notice}
        </span>
      )}

      {/* Thumbnails + in-flight uploads */}
      {(value.length > 0 || pending.length > 0) && (
        <ul className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
          <AnimatePresence initial={false}>
            {value.map((item, i) => (
              <motion.li
                key={item.path}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.18 }}
                className="group relative aspect-square overflow-hidden rounded-lg border border-[var(--color-border)]"
              >
                <img src={item.url} alt="" className="h-full w-full object-cover" />
                {i === 0 && (
                  <span className="absolute left-1.5 top-1.5 rounded-md bg-[var(--color-accent)] px-1.5 py-0.5 font-[var(--font-mono)] text-[0.6rem] font-semibold uppercase text-[var(--color-bg)]">
                    Sampul
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-gradient-to-t from-black/70 to-transparent p-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {i !== 0 && (
                    <button
                      type="button"
                      onClick={() => makeCover(i)}
                      className="rounded bg-white/15 px-1.5 py-0.5 text-[0.65rem] font-medium text-white transition-colors hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)]"
                    >
                      Sampul
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(item)}
                    className="ml-auto rounded bg-white/15 px-1.5 py-0.5 text-[0.65rem] font-medium text-white transition-colors hover:bg-[var(--color-error)]"
                  >
                    Hapus
                  </button>
                </div>
              </motion.li>
            ))}
            {pending.map(u => (
              <motion.li
                key={u.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.18 }}
                className="relative grid aspect-square place-items-center overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]"
              >
                {u.error ? (
                  <div className="flex flex-col items-center gap-1 px-2 text-center">
                    <span className="text-[0.7rem] text-[var(--color-error)]">{u.error}</span>
                    <button
                      type="button"
                      onClick={() => setPending(p => p.filter(x => x.id !== u.id))}
                      className="text-[0.65rem] text-[var(--color-text-muted)] underline"
                    >
                      tutup
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="font-[var(--font-mono)] text-[0.8rem] text-[var(--color-accent)]">
                      {u.progress}%
                    </span>
                    <div className="absolute inset-x-2 bottom-2 h-1 overflow-hidden rounded-full bg-[var(--color-border)]">
                      <div
                        className="h-full origin-left bg-[var(--color-accent)] transition-transform duration-150"
                        style={{ transform: `scaleX(${u.progress / 100})` }}
                      />
                    </div>
                  </>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  )
}
