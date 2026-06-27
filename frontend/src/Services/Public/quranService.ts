import api from '@/Services/Common/axiosInstance'
import { API } from '@/Constants/apiEndpoints'

export interface QuranVerse {
  surah_number: number
  ayah_number: number
  surah_name_arabic: string
  surah_name_latin: string
  arabic: string
  transliteration: string
  translation: string
}

export interface QuranGuidanceResult {
  reflection: string
  verses: QuranVerse[]
}

export async function getQuranGuidance(feeling: string): Promise<QuranGuidanceResult> {
  const res = await api.post<{ data: QuranGuidanceResult }>(
    API.QURAN,
    { feeling },
    { timeout: 35000 },
  )
  return res.data.data
}
