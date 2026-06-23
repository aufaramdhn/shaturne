import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '@/Redux/Store'
import { setUser, clearUser } from '@/Redux/Features/AuthSlice'
import { fetchMe } from '@/Services/Auth/authService'

// Runs once on app boot: resolve the session cookie via GET /me, then hydrate
// auth state. 401 → not logged in (clearUser).
export function useAuthCheck() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    let active = true
    fetchMe()
      .then(user => {
        if (active) dispatch(setUser(user))
      })
      .catch(() => {
        if (active) dispatch(clearUser())
      })
    return () => {
      active = false
    }
  }, [dispatch])
}
