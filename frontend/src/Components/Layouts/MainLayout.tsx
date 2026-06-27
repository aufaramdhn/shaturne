import { useEffect } from 'react'
import { Navigate, useLocation, useOutlet, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { isLang, DEFAULT_LANG } from '@/Locales'
import { LanguageProvider } from '@/Context/LanguageContext'
import Navbar from '@/Components/Fragments/Navigation/Navbar'
import Footer from '@/Components/Fragments/Navigation/Footer'
import AuroraBackground from '@/Components/Fragments/Backgrounds/AuroraBackground'

// Public template (§3). Reads the :lang route param, validates it, and provides
// the language context. Navbar + Footer persist; only page content transitions.

export default function MainLayout() {
  const location = useLocation()
  const outlet = useOutlet()
  const { lang } = useParams()

  // Reset scroll on route change.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  if (!isLang(lang)) return <Navigate to={`/${DEFAULT_LANG}`} replace />

  return (
    <LanguageProvider lang={lang}>
      <div className="relative flex min-h-dvh flex-col">
        <AuroraBackground />
        <div className="relative flex min-h-dvh flex-col" style={{ zIndex: 1 }}>
          <Navbar />
          <main className="flex-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                }}
                exit={{ opacity: 0, y: -8, transition: { duration: 0.2, ease: 'easeIn' } }}
              >
                {outlet}
              </motion.div>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      </div>
    </LanguageProvider>
  )
}
