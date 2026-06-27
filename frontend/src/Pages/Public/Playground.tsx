import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp } from '@/Animations/variants'
import { useLanguage } from '@/Context/LanguageContext'
import ChatWindow from '@/Components/Fragments/Chat/ChatWindow'
import SandboxWindow from '@/Components/Fragments/Sandbox/SandboxWindow'

type Tab = 'chat' | 'sandbox'

interface NavItem {
  id: Tab
  label: string
  icon: React.ReactNode
}

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

export default function Playground() {
  const { t } = useLanguage()
  const [tab, setTab] = useState<Tab>('chat')

  const navItems: NavItem[] = [
    { id: 'chat', label: t('playground.chatTitle'), icon: <IconChat /> },
    { id: 'sandbox', label: t('sandbox.title'), icon: <IconCode /> },
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
        {/* Sidebar — desktop vertical, mobile horizontal */}
        <nav className="flex shrink-0 flex-row gap-1 sm:w-48 sm:flex-col">
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
        <div className="min-w-0 flex-1">{tab === 'chat' ? <ChatWindow /> : <SandboxWindow />}</div>
      </motion.div>
    </div>
  )
}
