// Bridges the app's current UI language (from the URL) into the Axios layer so
// public API requests resolve translatable content server-side. Set by
// LanguageContext; read by the axios request interceptor.
let current = 'id'

export function setApiLocale(lang: string): void {
  current = lang
}

export function getApiLocale(): string {
  return current
}
