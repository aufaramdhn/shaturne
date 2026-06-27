import api from './Common/axiosInstance'

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
  const res = await api.post<{ data: QuranGuidanceResult }>('/quran', { feeling })
  return res.data.data
}
