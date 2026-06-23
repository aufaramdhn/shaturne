import axiosInstance from '@/Services/Common/axiosInstance'
import { API } from '@/Constants/apiEndpoints'
import type { Project } from '@/Redux/Features/ProjectSlice'

// Envelope §9: { success, data, message } — read `.data.data`.

export async function getProjects(): Promise<Project[]> {
  const res = await axiosInstance.get(API.PROJECTS)
  return res.data.data as Project[]
}

export async function getProject(slug: string): Promise<Project> {
  const res = await axiosInstance.get(API.PROJECT_DETAIL(slug))
  return res.data.data as Project
}
