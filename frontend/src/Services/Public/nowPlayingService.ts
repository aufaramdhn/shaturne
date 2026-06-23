import axiosInstance from '@/Services/Common/axiosInstance'
import { API } from '@/Constants/apiEndpoints'

export interface NowPlaying {
  is_playing: boolean
  track?: string
  artist?: string
  album_image?: string | null
  url?: string | null
  progress_ms?: number
  duration_ms?: number
}

export async function fetchNowPlaying(): Promise<NowPlaying> {
  return (await axiosInstance.get(API.NOW_PLAYING)).data.data
}
