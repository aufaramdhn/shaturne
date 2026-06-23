import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ROUTES } from '@/Constants/routes'
import { useAuth } from '@/Hooks/Auth/useAuth'
import { useSeo } from '@/Hooks/Common/useSeo'
import ThemeToggle from '@/Components/Fragments/ThemeToggle'

const NAV = [
  { to: ROUTES.DASHBOARD, label: 'Overview', icon: 'grid', end: true },
  { to: ROUTES.DASHBOARD_PROJECTS, label: 'Proyek', icon: 'folder', end: false },
  { to: ROUTES.DASHBOARD_SKILLS, label: 'Keahlian', icon: 'spark', end: false },
  { to: ROUTES.DASHBOARD_EXPERIENCE, label: 'Pengalaman', icon: 'case', end: false },
  { to: ROUTES.DASHBOARD_INBOX, label: 'Pesan', icon: 'inbox', end: false },
  { to: ROUTES.DASHBOARD_PROFILE, label: 'Profil', icon: 'user', end: false },
]

export default function DashboardLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  useSeo({ title: 'Dashboard — Shaturne', noindex: true })

  function handleLogout() {
    logout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  const sidebar = (
    <div className="flex h-full flex-col gap-1 p-4">
      <Link
        to={ROUTES.DASHBOARD}
        className="px-3 py-2 font-[var(--font-display)] text-[1.35rem] font-bold tracking-[-0.02em] text-[var(--color-text)]"
      >
        Shaturne
      </Link>
      <span className="mb-3 px-3 font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
        Dashboard
      </span>
      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.9375rem] transition-colors',
                isActive
                  ? 'bg-[var(--color-accent)]/12 text-[var(--color-accent)]'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text)]',
              ].join(' ')
            }
          >
            <Icon name={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.9375rem] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-error)]"
      >
        <Icon name="logout" />
        Keluar
      </button>
    </div>
  )

  return (
    <div className="min-h-dvh bg-[var(--color-bg)]">
      {/* Static sidebar (lg+) */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-[var(--color-border)] bg-[var(--color-surface)]/40 lg:block">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{ zIndex: 'var(--z-backdrop)' }}
              className="fixed inset-0 bg-black/50 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ zIndex: 'var(--z-modal)' }}
              className="fixed inset-y-0 left-0 w-64 border-r border-[var(--color-border)] bg-[var(--color-surface)] lg:hidden"
            >
              {sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-[var(--z-sticky)] flex h-16 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 px-5 sm:px-6">
          <button
            type="button"
            aria-label="Buka menu"
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-lg text-[var(--color-text)] hover:bg-[var(--color-surface)] lg:hidden"
          >
            <Icon name="grid" />
          </button>
          <div className="flex flex-1 items-center justify-end gap-3">
            <span className="hidden text-[0.875rem] text-[var(--color-text-muted)] sm:inline">
              {user?.email}
            </span>
            <ThemeToggle />
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-5 py-8 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function Icon({ name }: { name: string }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  switch (name) {
    case 'grid':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      )
    case 'folder':
      return (
        <svg {...common}>
          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
      )
    case 'spark':
      return (
        <svg {...common}>
          <path d="M12 3v18M3 12h18M6 6l12 12M18 6L6 18" />
        </svg>
      )
    case 'case':
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      )
    case 'inbox':
      return (
        <svg {...common}>
          <path d="M3 12h5l2 3h4l2-3h5" />
          <path d="M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
        </svg>
      )
    case 'user':
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      )
    case 'logout':
      return (
        <svg {...common}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
        </svg>
      )
    default:
      return null
  }
}
