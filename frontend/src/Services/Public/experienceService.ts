import axiosInstance from '@/Services/Common/axiosInstance'
import { API } from '@/Constants/apiEndpoints'

export interface ApiExperience {
  uuid: string
  title: string
  organization: string
  start_date: string | null
  end_date: string | null
  description: string | null
  type: string
}

export async function getExperiences(): Promise<ApiExperience[]> {
  const res = await axiosInstance.get(API.EXPERIENCE)
  return res.data.data as ApiExperience[]
}
