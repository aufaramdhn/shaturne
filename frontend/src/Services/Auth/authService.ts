import axiosInstance from '@/Services/Common/axiosInstance'
import { API } from '@/Constants/apiEndpoints'
import type { User } from '@/Redux/Features/AuthSlice'

// Sanctum SPA cookie flow: fetch CSRF cookie → POST login (axios auto-sends
// X-XSRF-TOKEN from the XSRF-TOKEN cookie). Session cookie authenticates the rest.

export async function csrf(): Promise<void> {
  await axiosInstance.get(API.CSRF)
}

export async function login(email: string, password: string): Promise<User> {
  await csrf()
  const res = await axiosInstance.post(API.LOGIN, { email, password })
  return res.data.data as User
}

export async function logout(): Promise<void> {
  await axiosInstance.post(API.LOGOUT)
}

export async function fetchMe(): Promise<User> {
  const res = await axiosInstance.get(API.ME)
  return res.data.data as User
}
