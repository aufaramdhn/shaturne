const BASE = '/api/v1'

export const API = {
  // Auth
  CSRF: '/sanctum/csrf-cookie',
  LOGIN: `${BASE}/auth/login`,
  LOGOUT: `${BASE}/auth/logout`,
  ME: `${BASE}/auth/me`,

  // Public
  PROJECTS: `${BASE}/projects`,
  PROJECT_DETAIL: (slug: string) => `${BASE}/projects/${slug}`,
  SKILLS: `${BASE}/skills`,
  EXPERIENCE: `${BASE}/experience`,
  CONTACT: `${BASE}/contact`,
  NOW_PLAYING: `${BASE}/now-playing`,

  // Dashboard (auth required — uses UUID)
  DASH_PROJECTS: `${BASE}/dashboard/projects`,
  DASH_PROJECT: (uuid: string) => `${BASE}/dashboard/projects/${uuid}`,
  DASH_SKILLS: `${BASE}/dashboard/skills`,
  DASH_SKILL: (uuid: string) => `${BASE}/dashboard/skills/${uuid}`,
  DASH_EXPERIENCE: `${BASE}/dashboard/experience`,
  DASH_EXPERIENCE_ITEM: (uuid: string) => `${BASE}/dashboard/experience/${uuid}`,
  DASH_INBOX: `${BASE}/dashboard/messages`,
  DASH_MESSAGE: (uuid: string) => `${BASE}/dashboard/messages/${uuid}`,
  DASH_PROFILE: `${BASE}/dashboard/profile`,
  DASH_MEDIA: `${BASE}/dashboard/media`,
  DASH_MEDIA_ITEM: (filename: string) => `${BASE}/dashboard/media/${filename}`,
  DASH_OVERVIEW: `${BASE}/dashboard/overview`,
} as const
