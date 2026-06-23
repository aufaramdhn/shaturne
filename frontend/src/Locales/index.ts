import { id } from './id'
import { en } from './en'

export type Lang = 'id' | 'en'

export const LANGS: Lang[] = ['id', 'en']
export const DEFAULT_LANG: Lang = 'id'

export const dictionaries = { id, en } as const
export type Dictionary = typeof id

export function isLang(v: unknown): v is Lang {
  return v === 'id' || v === 'en'
}

// Resolve browser/storage preference → a supported Lang.
export function detectLang(): Lang {
  const stored = localStorage.getItem('lang')
  if (isLang(stored)) return stored
  return navigator.language?.toLowerCase().startsWith('en') ? 'en' : DEFAULT_LANG
}

// Bilingual content helper for dummy data prose.
export type LocalizedText = Record<Lang, string>
export function tx(text: LocalizedText, lang: Lang): string {
  return text[lang] ?? text[DEFAULT_LANG]
}
