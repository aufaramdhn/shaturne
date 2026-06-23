import axiosInstance from '@/Services/Common/axiosInstance'
import { API } from '@/Constants/apiEndpoints'
import type { User } from '@/Redux/Features/AuthSlice'

// Dashboard exposes the full {id, en} translation map (admin edits both locales).
export interface LocalizedText {
  id: string
  en: string
}

export interface DashProject {
  uuid: string
  title: LocalizedText
  slug: string
  description: LocalizedText
  stack: string[]
  repo_url: string | null
  demo_url: string | null
  is_published: boolean
  images: { path: string; url: string; order: number }[]
}

export interface DashSkill {
  uuid: string
  name: string
  category: LocalizedText
  proficiency: number
  icon: string | null
}

export interface DashExperience {
  uuid: string
  title: LocalizedText
  organization: string
  start_date: string
  end_date: string | null
  description: LocalizedText
  type: string
}

export interface OverviewStats {
  projects: number
  published: number
  skills: number
  experiences: number
  messages: number
  unread: number
}

export interface DashMessage {
  uuid: string
  name: string
  email: string
  message: string
  is_read: boolean
  created_at: string | null
}

export interface ProjectPayload {
  title: LocalizedText
  slug?: string
  description: LocalizedText
  stack: string[]
  repo_url?: string | null
  demo_url?: string | null
  is_published: boolean
  images?: string[] // storage paths, ordered (first = cover)
}

export interface UploadedMedia {
  path: string
  url: string
}

export interface SkillPayload {
  name: string
  category: LocalizedText
  proficiency: number
}

export interface ExperiencePayload {
  title: LocalizedText
  organization: string
  start_date: string
  end_date: string | null
  description: LocalizedText
  type: string
}

// ── Overview ────────────────────────────────────────────────────────────
export async function getOverview(): Promise<OverviewStats> {
  return (await axiosInstance.get(API.DASH_OVERVIEW)).data.data
}

// ── Projects ────────────────────────────────────────────────────────────
export async function getDashProjects(): Promise<DashProject[]> {
  return (await axiosInstance.get(API.DASH_PROJECTS)).data.data
}
export async function createProject(payload: ProjectPayload): Promise<DashProject> {
  return (await axiosInstance.post(API.DASH_PROJECTS, payload)).data.data
}
export async function updateProject(uuid: string, payload: ProjectPayload): Promise<DashProject> {
  return (await axiosInstance.put(API.DASH_PROJECT(uuid), payload)).data.data
}
export async function deleteProject(uuid: string): Promise<void> {
  await axiosInstance.delete(API.DASH_PROJECT(uuid))
}

// ── Skills ──────────────────────────────────────────────────────────────
export async function getDashSkills(): Promise<DashSkill[]> {
  return (await axiosInstance.get(API.DASH_SKILLS)).data.data
}
export async function createSkill(payload: SkillPayload): Promise<DashSkill> {
  return (await axiosInstance.post(API.DASH_SKILLS, payload)).data.data
}
export async function updateSkill(uuid: string, payload: SkillPayload): Promise<DashSkill> {
  return (await axiosInstance.put(API.DASH_SKILL(uuid), payload)).data.data
}
export async function deleteSkill(uuid: string): Promise<void> {
  await axiosInstance.delete(API.DASH_SKILL(uuid))
}

// ── Experience ──────────────────────────────────────────────────────────
export async function getDashExperience(): Promise<DashExperience[]> {
  return (await axiosInstance.get(API.DASH_EXPERIENCE)).data.data
}
export async function createExperience(payload: ExperiencePayload): Promise<DashExperience> {
  return (await axiosInstance.post(API.DASH_EXPERIENCE, payload)).data.data
}
export async function updateExperience(
  uuid: string,
  payload: ExperiencePayload,
): Promise<DashExperience> {
  return (await axiosInstance.put(API.DASH_EXPERIENCE_ITEM(uuid), payload)).data.data
}
export async function deleteExperience(uuid: string): Promise<void> {
  await axiosInstance.delete(API.DASH_EXPERIENCE_ITEM(uuid))
}

// ── Messages ────────────────────────────────────────────────────────────
export async function getMessages(): Promise<DashMessage[]> {
  return (await axiosInstance.get(API.DASH_INBOX)).data.data
}
export async function readMessage(uuid: string): Promise<DashMessage> {
  return (await axiosInstance.get(API.DASH_MESSAGE(uuid))).data.data
}
export async function deleteMessage(uuid: string): Promise<void> {
  await axiosInstance.delete(API.DASH_MESSAGE(uuid))
}

// ── Media ───────────────────────────────────────────────────────────────
export async function uploadMedia(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<UploadedMedia> {
  const body = new FormData()
  body.append('file', file)
  const res = await axiosInstance.post(API.DASH_MEDIA, body, {
    onUploadProgress: e => {
      if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100))
    },
  })
  return res.data.data
}

export async function deleteMedia(path: string): Promise<void> {
  // Backend route takes the bare filename; strip the `projects/` prefix.
  const filename = path.split('/').pop() ?? path
  await axiosInstance.delete(API.DASH_MEDIA_ITEM(filename))
}

// ── Profile ─────────────────────────────────────────────────────────────
export async function updateProfile(payload: { name: string; email: string }): Promise<User> {
  return (await axiosInstance.put(API.DASH_PROFILE, payload)).data.data
}
