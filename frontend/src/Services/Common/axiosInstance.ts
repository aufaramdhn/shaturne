import axios from 'axios'
import { ENV } from '@/Config/env'
import { API } from '@/Constants/apiEndpoints'
import { getApiLocale } from '@/Services/Common/locale'

const axiosInstance = axios.create({
  baseURL: ENV.API_URL,
  withCredentials: true, // required for Sanctum cookie auth
  headers: { Accept: 'application/json' },
})

// Tag every request with the active UI locale so the API resolves translatable
// content for the right language (Accept-Language can't be overridden in-browser).
axiosInstance.interceptors.request.use(config => {
  config.params = { lang: getApiLocale(), ...config.params }
  return config
})

// Track CSRF refresh to avoid infinite retry loop
let isRefreshingCsrf = false

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    // 419 = CSRF token mismatch — refresh cookie and retry once
    if (error.response?.status === 419 && !originalRequest._csrfRetry) {
      if (isRefreshingCsrf) return Promise.reject(error)
      isRefreshingCsrf = true
      originalRequest._csrfRetry = true
      try {
        await axios.get(API.CSRF, { baseURL: ENV.API_URL, withCredentials: true })
        return axiosInstance(originalRequest)
      } finally {
        isRefreshingCsrf = false
      }
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
