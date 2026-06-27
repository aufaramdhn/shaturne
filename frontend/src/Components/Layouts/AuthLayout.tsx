import { Outlet } from 'react-router-dom'
import { LanguageProvider } from '@/Context/LanguageContext'
import { detectLang } from '@/Locales'
import AuroraBackground from '@/Components/Fragments/Backgrounds/AuroraBackground'

// Minimal centered shell for auth pages (no navbar/footer).
// /login has no :lang prefix, so we detect lang from localStorage/browser.
export default function AuthLayout() {
  const lang = detectLang()

  return (
    <LanguageProvider lang={lang}>
      <div className="relative grid min-h-dvh place-items-center px-5 py-12">
        <AuroraBackground />
        <div className="relative w-full max-w-md" style={{ zIndex: 1 }}>
          <Outlet />
        </div>
      </div>
    </LanguageProvider>
  )
}
