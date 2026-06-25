import axiosInstance from '@/Services/Common/axiosInstance'
import { API } from '@/Constants/apiEndpoints'

export interface ContributionDay {
  date: string
  contributionCount: number
  weekday: number
}

export interface ContributionWeek {
  firstDay: string
  contributionDays: ContributionDay[]
}

export interface ContributionData {
  weeks: ContributionWeek[]
  totalContributions: number
  availableYears: number[]
}

export async function getContributions(year: number): Promise<ContributionData> {
  const res = await axiosInstance.get(API.GITHUB_CONTRIBUTIONS(year))
  return res.data.data as ContributionData
}
