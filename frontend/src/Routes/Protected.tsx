import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/Redux/Store'
import { ROUTES } from '@/Constants/routes'

// UX guard only — real authorization is enforced server-side via Laravel Policies.
export default function Protected() {
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth)

  if (isLoading) return null // Wait for /me to resolve before redirecting

  return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />
}
