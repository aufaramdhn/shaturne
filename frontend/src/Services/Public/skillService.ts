import axiosInstance from '@/Services/Common/axiosInstance'
import { API } from '@/Constants/apiEndpoints'

export interface ApiSkill {
  uuid: string
  name: string
  category: string
  proficiency: number
  icon: string | null
}

export async function getSkills(): Promise<ApiSkill[]> {
  const res = await axiosInstance.get(API.SKILLS)
  return res.data.data as ApiSkill[]
}
