export const ROUTES = {
  HOME: '/',
  PROJECTS: '/projects',
  PROJECT_DETAIL: '/projects/:slug',
  CONTACT: '/contact',
  PLAYGROUND: '/playground',

  LOGIN: '/login',

  DASHBOARD: '/dashboard',
  DASHBOARD_PROJECTS: '/dashboard/projects',
  DASHBOARD_SKILLS: '/dashboard/skills',
  DASHBOARD_EXPERIENCE: '/dashboard/experience',
  DASHBOARD_INBOX: '/dashboard/inbox',
  DASHBOARD_PROFILE: '/dashboard/profile',
  DASHBOARD_MEDIA: '/dashboard/media',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]

// Prefix a public route with the active language segment, e.g.
// localePath('en', '/projects') → '/en/projects'; localePath('id', '/') → '/id'.
export function localePath(lang: string, route: string): string {
  return route === '/' ? `/${lang}` : `/${lang}${route}`
}
