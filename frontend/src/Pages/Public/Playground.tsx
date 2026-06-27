import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fadeUp } from '@/Animations/variants'
import { useLanguage } from '@/Context/LanguageContext'
import { useSeo, buildAlternates } from '@/Hooks/Common/useSeo'
import ChatWindow from '@/Components/Fragments/Chat/ChatWindow'
import SandboxWindow from '@/Components/Fragments/Sandbox/SandboxWindow'
import TechStackWindow from '@/Components/Fragments/TechStack/TechStackWindow'
import GitHubWindow from '@/Components/Fragments/GitHub/GitHubWindow'
import DevToolsWindow from '@/Components/Fragments/DevTools/DevToolsWindow'

type Tab = 'chat' | 'sandbox' | 'techstack' | 'github' | 'devtools'

function IconChat() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M14 2H2C1.45 2 1 2.45 1 3v8c0 .55.45 1 1 1h2v2.5L7.5 12H14c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconCode() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M5 4L1 8l4 4M11 4l4 4-4 4M9 2l-2 12"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconLayers() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 1L1 5l7 4 7-4-7-4zM1 11l7 4 7-4M1 8l7 4 7-4"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconGitHub() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  )
}

function IconWrench() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M10.5 1.5a3.5 3.5 0 00-3.46 4.02L2 10.5 2 14l3.5 0 5-5.04A3.5 3.5 0 1010.5 1.5z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <circle cx="10.5" cy="5" r="1" fill="currentColor" />
    </svg>
  )
}

export default function Playground() {
  const { t } = useLanguage()
  const { pathname } = useLocation()
  const [tab, setTab] = useState<Tab>('chat')

  useSeo({
    title: t('seo.playgroundTitle'),
    description: t('seo.playgroundDesc'),
    alternates: buildAlternates(pathname),
  })

  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'chat', label: t('playground.chatTitle'), icon: <IconChat /> },
    { id: 'sandbox', label: t('sandbox.title'), icon: <IconCode /> },
    { id: 'techstack', label: t('techstack.title'), icon: <IconLayers /> },
    { id: 'github', label: t('github.title'), icon: <IconGitHub /> },
    { id: 'devtools', label: t('devtools.title'), icon: <IconWrench /> },
  ]

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <motion.h1
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-[length:var(--text-h1)] font-bold tracking-[-0.02em] text-[var(--color-text)]"
      >
        {t('playground.title')}
      </motion.h1>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-8 flex flex-col gap-6 sm:flex-row sm:gap-8"
      >
        {/* Sidebar */}
        <nav className="flex shrink-0 flex-row flex-wrap gap-1 sm:w-48 sm:flex-col sm:flex-nowrap">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-[0.9375rem] font-medium transition-colors ${
                tab === item.id
                  ? 'bg-[var(--color-surface)] text-[var(--color-text)]'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]'
              }`}
            >
              <span
                className={
                  tab === item.id ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'
                }
              >
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {tab === 'chat' && <ChatWindow />}
          {tab === 'sandbox' && <SandboxWindow />}
          {tab === 'techstack' && <TechStackWindow />}
          {tab === 'github' && <GitHubWindow />}
          {tab === 'devtools' && <DevToolsWindow />}
        </div>
      </motion.div>
    </div>
  )
}
