import { Outlet } from 'react-router-dom'
import AuroraBackground from '@/Components/Fragments/AuroraBackground'

// Minimal centered shell for auth pages (no navbar/footer).
export default function AuthLayout() {
  return (
    <div className="relative grid min-h-dvh place-items-center px-5 py-12">
      <AuroraBackground />
      <div className="relative w-full max-w-md" style={{ zIndex: 1 }}>
        <Outlet />
      </div>
    </div>
  )
}
