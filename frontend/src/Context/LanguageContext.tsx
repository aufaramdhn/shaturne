import { createContext, useCallback, useContext, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { dictionaries, DEFAULT_LANG } from '@/Locales'
import type { Lang } from '@/Locales'
import { setApiLocale } from '@/Services/Common/locale'

type Vars = Record<string, string | number>

interface LanguageValue {
  lang: Lang
  t: (key: string, vars?: Vars) => string
  switchLang: (next: Lang) => void
}

const LanguageContext = createContext<LanguageValue | null>(null)

function resolve(obj: unknown, path: string): string | undefined {
  let cur: unknown = obj
  for (const key of path.split('.')) {
    if (cur && typeof cur === 'object' && key in cur) {
      cur = (cur as Record<string, unknown>)[key]
    } else {
      return undefined
    }
  }
  return typeof cur === 'string' ? cur : undefined
}

export function LanguageProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()

  // Set synchronously during render so child fetch effects (which run before
  // the parent effect) already see the right locale on the API layer.
  setApiLocale(lang)

  // Keep <html lang> + stored preference in sync.
  useEffect(() => {
    document.documentElement.setAttribute('lang', lang)
    localStorage.setItem('lang', lang)
  }, [lang])

  const t = useCallback(
    (key: string, vars?: Vars) => {
      let str = resolve(dictionaries[lang], key) ?? resolve(dictionaries[DEFAULT_LANG], key) ?? key
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replaceAll(`{${k}}`, String(v))
        }
      }
      return str
    },
    [lang],
  )

  const switchLang = useCallback(
    (next: Lang) => {
      if (next === lang) return
      const rest = location.pathname.replace(/^\/(id|en)(?=\/|$)/, '')
      navigate(`/${next}${rest}${location.search}`)
    },
    [lang, location, navigate],
  )

  return (
    <LanguageContext.Provider value={{ lang, t, switchLang }}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
