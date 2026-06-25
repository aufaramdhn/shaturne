import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/Redux/Store'
import { ROUTES } from '@/Constants/routes'

// Redirect already-authenticated users away from /login.
// Render the outlet while loading so the form is visible immediately — once
// the session check resolves the user is redirected to dashboard if authenticated.
export default function PublicOnly() {
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth)

  if (isLoading) return <Outlet />

  return isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : <Outlet />
}
