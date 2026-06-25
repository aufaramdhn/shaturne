import axios from 'axios'
import { ENV } from '@/Config/env'
import { API } from '@/Constants/apiEndpoints'
import { getApiLocale } from '@/Services/Common/locale'

const axiosInstance = axios.create({
  baseURL: ENV.API_URL,
  withCredentials: true, // required for Sanctum cookie auth
  headers: { Accept: 'application/json' },
})

function getXsrfToken(): string | undefined {
  const match = document.cookie.split('; ').find(r => r.startsWith('XSRF-TOKEN='))
  return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : undefined
}

// Tag every request with locale + XSRF token.
// Axios injects XSRF automatically for same-origin only; cross-origin (5173→8000) needs manual injection.
axiosInstance.interceptors.request.use(config => {
  config.params = { lang: getApiLocale(), ...config.params }
  const xsrf = getXsrfToken()
  if (xsrf) config.headers['X-XSRF-TOKEN'] = xsrf
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
        const xsrf = getXsrfToken()
        if (xsrf) originalRequest.headers['X-XSRF-TOKEN'] = xsrf
        return axiosInstance(originalRequest)
      } finally {
        isRefreshingCsrf = false
      }
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
