import axiosInstance from '@/Services/Common/axiosInstance'
import { API } from '@/Constants/apiEndpoints'

export interface ContactPayload {
  name: string
  email: string
  message: string
  honeypot?: string
}

export async function sendMessage(payload: ContactPayload): Promise<void> {
  await axiosInstance.post(API.CONTACT, payload)
}
