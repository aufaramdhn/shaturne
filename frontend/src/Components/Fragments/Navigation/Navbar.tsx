import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ROUTES, localePath } from '@/Constants/routes'
import { useLanguage } from '@/Context/LanguageContext'
import ThemeToggle from './ThemeToggle'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar() {
  const { lang, t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { to: localePath(lang, ROUTES.HOME), label: t('nav.home'), end: true },
    { to: localePath(lang, ROUTES.PROJECTS), label: t('nav.projects'), end: false },
    { to: localePath(lang, ROUTES.CONTACT), label: t('nav.contact'), end: false },
    { to: localePath(lang, ROUTES.PLAYGROUND), label: t('nav.playground'), end: false },
  ]

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'rounded-lg px-3 py-2 text-[0.9375rem] underline-offset-[6px] transition-colors duration-200',
      isActive
        ? 'text-[var(--color-text)] underline decoration-[var(--color-accent)] decoration-2'
        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
    ].join(' ')

  return (
    <header
      className={[
        'sticky top-0 z-[var(--z-sticky)] transition-colors duration-300',
        scrolled || menuOpen
          ? 'border-b border-[var(--color-border)] bg-[var(--color-bg)]/95'
          : 'border-b border-transparent bg-transparent',
      ].join(' ')}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          to={localePath(lang, ROUTES.HOME)}
          className="font-[var(--font-display)] text-[1.35rem] font-bold tracking-[-0.02em] text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)]"
        >
          Shaturne
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Desktop links */}
          <ul className="hidden items-center md:flex">
            {links.map(link => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.end} className={linkClass}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <LanguageSwitcher />
          <ThemeToggle />

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(o => !o)}
            className="grid h-11 w-11 place-items-center rounded-lg text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface)] md:hidden"
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300 ${
                  menuOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 block h-0.5 w-5 -translate-y-1/2 bg-current transition-opacity duration-200 ${
                  menuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300 ${
                  menuOpen ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-0'
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-bg)]/95 md:hidden"
          >
            <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4 sm:px-8">
              {links.map(link => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.end}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      [
                        'block rounded-lg px-3 py-3 text-[1.0625rem] transition-colors',
                        isActive
                          ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                          : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
                      ].join(' ')
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
