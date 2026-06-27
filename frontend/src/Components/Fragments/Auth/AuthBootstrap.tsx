import { useAuthCheck } from '@/Hooks/Auth/useAuthCheck'

// Resolves the session on boot (GET /me). Renders nothing.
export default function AuthBootstrap() {
  useAuthCheck()
  return null
}
