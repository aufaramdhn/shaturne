import { useState, useCallback } from 'react'
import { useLanguage } from '@/Context/LanguageContext'

// ─── Color conversion ────────────────────────────────────────────────────────

function linearize(c: number): number {
  const n = c / 255
  return n <= 0.04045 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4)
}

function hexToConverted(
  hex: string,
): { r: number; g: number; b: number; L: number; C: number; H: number } | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim())
  if (!m) return null
  const r = parseInt(m[1], 16)
  const g = parseInt(m[2], 16)
  const b = parseInt(m[3], 16)

  const lr = linearize(r),
    lg = linearize(g),
    lb = linearize(b)
  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb
  const mm = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb
  const l_ = Math.cbrt(l),
    m_ = Math.cbrt(mm),
    s_ = Math.cbrt(s)
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_
  const bOk = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_
  const C = Math.sqrt(a * a + bOk * bOk)
  let H = Math.atan2(bOk, a) * (180 / Math.PI)
  if (H < 0) H += 360

  return {
    r,
    g,
    b,
    L: Math.round(L * 1000) / 10,
    C: Math.round(C * 1000) / 1000,
    H: Math.round(H * 10) / 10,
  }
}

// ─── Shared styles ───────────────────────────────────────────────────────────

const textareaClass =
  'w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-3 font-[var(--font-mono)] text-[0.8125rem] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-accent)] focus-visible:outline-none'

const inputClass =
  'w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-2.5 font-[var(--font-mono)] text-[0.875rem] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus-visible:border-[var(--color-accent)] focus-visible:outline-none'

const btnClass =
  'rounded-lg bg-[var(--color-accent)] px-4 py-2 text-[0.875rem] font-medium text-[oklch(15%_0.024_265)] transition-opacity hover:opacity-90'

const labelClass = 'mb-1.5 block text-[0.8125rem] font-medium text-[var(--color-text-muted)]'

// ─── JSON Tool ───────────────────────────────────────────────────────────────

function JsonTool() {
  const { t } = useLanguage()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState<'idle' | 'valid' | 'error'>('idle')

  function format() {
    if (!input.trim()) return
    try {
      setOutput(JSON.stringify(JSON.parse(input), null, 2))
      setStatus('valid')
    } catch {
      setOutput('')
      setStatus('error')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className={labelClass}>{t('devtools.inputLabel')}</label>
        <textarea
          className={textareaClass}
          rows={8}
          placeholder='{"key": "value"}'
          value={input}
          onChange={e => {
            setInput(e.target.value)
            setStatus('idle')
          }}
        />
      </div>
      <div className="flex items-center gap-3">
        <button className={btnClass} onClick={format}>
          {t('devtools.format')}
        </button>
        {status === 'valid' && (
          <span className="text-[0.8125rem] text-[oklch(72%_0.16_145)]">{t('devtools.valid')}</span>
        )}
        {status === 'error' && (
          <span className="text-[0.8125rem] text-[var(--color-error)]">
            {t('devtools.invalid')}
          </span>
        )}
      </div>
      {output && (
        <div>
          <label className={labelClass}>{t('devtools.outputLabel')}</label>
          <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-all rounded-xl bg-[var(--color-surface-raised)] p-4 font-[var(--font-mono)] text-[0.8125rem] text-[var(--color-text)]">
            {output}
          </pre>
        </div>
      )}
    </div>
  )
}

// ─── Regex Tool ──────────────────────────────────────────────────────────────

function RegexTool() {
  const { t } = useLanguage()
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [testStr, setTestStr] = useState('')
  const [regexError, setRegexError] = useState(false)

  const { highlighted, matchCount } = useCallback(() => {
    if (!pattern || !testStr) return { highlighted: null, matchCount: 0 }
    let regex: RegExp
    try {
      regex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g')
      setRegexError(false)
    } catch {
      setRegexError(true)
      return { highlighted: null, matchCount: 0 }
    }

    const parts: React.ReactNode[] = []
    let last = 0
    let count = 0
    let match: RegExpExecArray | null
    regex.lastIndex = 0

    while ((match = regex.exec(testStr)) !== null) {
      if (match.index > last) parts.push(testStr.slice(last, match.index))
      parts.push(
        <mark
          key={match.index}
          className="rounded bg-[var(--color-accent)]/30 text-[var(--color-accent)]"
        >
          {match[0]}
        </mark>,
      )
      last = match.index + match[0].length
      count++
      if (match[0].length === 0) {
        regex.lastIndex++
        break
      }
    }
    if (last < testStr.length) parts.push(testStr.slice(last))
    return { highlighted: parts, matchCount: count }
  }, [pattern, flags, testStr])()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        <div className="flex-1">
          <label className={labelClass}>{t('devtools.patternLabel')}</label>
          <input
            className={inputClass}
            placeholder="(\w+)"
            value={pattern}
            onChange={e => setPattern(e.target.value)}
          />
        </div>
        <div className="w-24">
          <label className={labelClass}>{t('devtools.flagsLabel')}</label>
          <input
            className={inputClass}
            placeholder="gi"
            value={flags}
            onChange={e => setFlags(e.target.value)}
          />
        </div>
      </div>
      {regexError && (
        <p className="text-[0.8125rem] text-[var(--color-error)]">{t('devtools.regexError')}</p>
      )}
      <div>
        <label className={labelClass}>{t('devtools.testStringLabel')}</label>
        <textarea
          className={textareaClass}
          rows={4}
          placeholder="Type something to test..."
          value={testStr}
          onChange={e => setTestStr(e.target.value)}
        />
      </div>
      {testStr && !regexError && (
        <div>
          <div className="mb-2 flex items-center gap-2">
            <p className={labelClass + ' mb-0'}>{t('devtools.outputLabel')}</p>
            <span className="font-[var(--font-mono)] text-[0.75rem] text-[var(--color-text-muted)]">
              {matchCount === 0 ? t('devtools.noMatch') : t('devtools.matches', { n: matchCount })}
            </span>
          </div>
          <div className="whitespace-pre-wrap rounded-xl bg-[var(--color-surface-raised)] p-4 font-[var(--font-mono)] text-[0.8125rem] leading-relaxed text-[var(--color-text)]">
            {highlighted ?? testStr}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Base64 Tool ─────────────────────────────────────────────────────────────

function Base64Tool() {
  const { t } = useLanguage()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [error, setError] = useState(false)
  const [copied, setCopied] = useState(false)

  function convert() {
    if (!input.trim()) return
    try {
      setOutput(
        mode === 'encode'
          ? btoa(unescape(encodeURIComponent(input)))
          : decodeURIComponent(escape(atob(input.trim()))),
      )
      setError(false)
    } catch {
      setOutput('')
      setError(true)
    }
  }

  function copy() {
    if (!output) return
    void navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {(['encode', 'decode'] as const).map(m => (
          <button
            key={m}
            onClick={() => {
              setMode(m)
              setOutput('')
              setError(false)
            }}
            className={`rounded-lg px-4 py-2 text-[0.875rem] font-medium transition-colors ${
              mode === m
                ? 'bg-[var(--color-accent)] text-[oklch(15%_0.024_265)]'
                : 'bg-[var(--color-surface-raised)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            {t(`devtools.${m}`)}
          </button>
        ))}
      </div>
      <div>
        <label className={labelClass}>{t('devtools.inputLabel')}</label>
        <textarea
          className={textareaClass}
          rows={5}
          placeholder={mode === 'encode' ? 'Hello, World!' : 'SGVsbG8sIFdvcmxkIQ=='}
          value={input}
          onChange={e => {
            setInput(e.target.value)
            setOutput('')
            setError(false)
          }}
        />
      </div>
      {error && (
        <p className="text-[0.8125rem] text-[var(--color-error)]">{t('devtools.invalid')}</p>
      )}
      <button className={btnClass + ' w-fit'} onClick={convert}>
        {t(`devtools.${mode}`)}
      </button>
      {output && (
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className={labelClass + ' mb-0'}>{t('devtools.outputLabel')}</label>
            <button
              onClick={copy}
              className="text-[0.8125rem] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
            >
              {copied ? t('devtools.copied') : t('devtools.copy')}
            </button>
          </div>
          <pre className="whitespace-pre-wrap break-all rounded-xl bg-[var(--color-surface-raised)] p-4 font-[var(--font-mono)] text-[0.8125rem] text-[var(--color-text)]">
            {output}
          </pre>
        </div>
      )}
    </div>
  )
}

// ─── Color Tool ──────────────────────────────────────────────────────────────

function ColorTool() {
  const { t } = useLanguage()
  const [hex, setHex] = useState('')

  const result = hex ? hexToConverted(hex) : null
  const isInvalid = hex.length > 0 && !result

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className={labelClass}>{t('devtools.hexLabel')}</label>
        <div className="flex items-center gap-3">
          <input
            className={inputClass}
            placeholder="#3b82f6"
            value={hex}
            onChange={e => setHex(e.target.value)}
            maxLength={9}
          />
          {result && (
            <div
              className="h-10 w-10 shrink-0 rounded-lg border border-[var(--color-border)]"
              style={{ background: hex.startsWith('#') ? hex : `#${hex}` }}
            />
          )}
        </div>
        {isInvalid && (
          <p className="mt-1.5 text-[0.8125rem] text-[var(--color-error)]">
            {t('devtools.invalidColor')}
          </p>
        )}
      </div>

      {result && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              label: t('devtools.hexLabel'),
              value: (hex.startsWith('#') ? hex : `#${hex}`).toUpperCase(),
            },
            { label: t('devtools.rgbLabel'), value: `rgb(${result.r}, ${result.g}, ${result.b})` },
            {
              label: t('devtools.oklchLabel'),
              value: `oklch(${result.L}% ${result.C} ${result.H})`,
            },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl bg-[var(--color-surface-raised)] p-4">
              <p className="mb-1 text-[0.75rem] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                {label}
              </p>
              <p className="font-[var(--font-mono)] text-[0.875rem] text-[var(--color-text)]">
                {value}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main window ─────────────────────────────────────────────────────────────

type SubTab = 'json' | 'regex' | 'base64' | 'color'

export default function DevToolsWindow() {
  const { t } = useLanguage()
  const [subTab, setSubTab] = useState<SubTab>('json')

  const tabs: { id: SubTab; label: string }[] = [
    { id: 'json', label: t('devtools.jsonTab') },
    { id: 'regex', label: t('devtools.regexTab') },
    { id: 'base64', label: t('devtools.base64Tab') },
    { id: 'color', label: t('devtools.colorTab') },
  ]

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="border-b border-[var(--color-border)] px-5 py-4">
        <h2 className="text-[length:var(--text-h3)] font-bold text-[var(--color-text)]">
          {t('devtools.title')}
        </h2>
        <p className="mt-0.5 text-[0.8125rem] text-[var(--color-text-muted)]">
          {t('devtools.subtitle')}
        </p>
      </div>

      {/* Sub-tab bar */}
      <div className="flex gap-1 border-b border-[var(--color-border)] px-5 py-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`rounded-lg px-4 py-1.5 text-[0.875rem] font-medium transition-colors ${
              subTab === tab.id
                ? 'bg-[var(--color-accent)] text-[oklch(15%_0.024_265)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-5">
        {subTab === 'json' && <JsonTool />}
        {subTab === 'regex' && <RegexTool />}
        {subTab === 'base64' && <Base64Tool />}
        {subTab === 'color' && <ColorTool />}
      </div>
    </div>
  )
}
