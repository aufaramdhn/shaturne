// Safe wrapper around import.meta.env — throws at startup if required vars are missing.

const required = (key: string): string => {
  const value = import.meta.env[key]
  if (!value) throw new Error(`Missing required env variable: ${key}`)
  return value
}

export const ENV = {
  API_URL: required('VITE_API_URL'),
  APP_ENV: (import.meta.env.VITE_APP_ENV as string) ?? 'production',
} as const

export const isDev = ENV.APP_ENV === 'local'
