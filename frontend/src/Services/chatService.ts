import axiosInstance from '@/Services/Common/axiosInstance'
import { API } from '@/Constants/apiEndpoints'

export async function sendMessage(message: string): Promise<string> {
  const res = await axiosInstance.post<{ success: boolean; data: { reply: string } }>(API.CHAT, {
    message,
  })
  return res.data.data.reply
}
