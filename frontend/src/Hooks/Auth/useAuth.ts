import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/Redux/Store'
import { setUser, clearUser } from '@/Redux/Features/AuthSlice'
import type { User } from '@/Redux/Features/AuthSlice'
import { login as apiLogin, logout as apiLogout } from '@/Services/Auth/authService'

// Components go through this, never dispatch directly (§8).
export function useAuth() {
  const dispatch = useDispatch<AppDispatch>()
  const { user, isAuthenticated, isLoading } = useSelector((s: RootState) => s.auth)

  // Throws on failure — caller shows the error.
  async function login(email: string, password: string): Promise<void> {
    const u = await apiLogin(email, password)
    dispatch(setUser(u))
  }

  async function logout(): Promise<void> {
    try {
      await apiLogout()
    } finally {
      dispatch(clearUser())
    }
  }

  // Update auth state after a profile change (no re-fetch needed).
  function applyUser(updated: User): void {
    dispatch(setUser(updated))
  }

  return { user, isAuthenticated, isLoading, login, logout, applyUser }
}
