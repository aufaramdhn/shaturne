import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/Animations/variants'
import { useLanguage } from '@/Context/LanguageContext'
import ChatWindow from '@/Components/Fragments/Chat/ChatWindow'
import SandboxWindow from '@/Components/Fragments/Sandbox/SandboxWindow'

type Tab = 'chat' | 'sandbox'

export default function Playground() {
  const { t } = useLanguage()
  const [tab, setTab] = useState<Tab>('chat')

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-4xl px-5 py-24"
    >
      <motion.h1
        variants={fadeUp}
        className="text-[length:var(--text-h1)] font-bold tracking-[-0.02em] text-[var(--color-text)]"
      >
        {t('playground.title')}
      </motion.h1>

      {/* Tab switcher */}
      <motion.div
        variants={fadeUp}
        className="mt-6 flex w-fit gap-1 rounded-xl bg-[var(--color-surface)] p-1"
      >
        {(['chat', 'sandbox'] as Tab[]).map(tabId => (
          <button
            key={tabId}
            onClick={() => setTab(tabId)}
            className={`rounded-lg px-5 py-2 text-[0.875rem] font-medium transition-colors ${
              tab === tabId
                ? 'bg-[var(--color-accent)] text-[oklch(15%_0.024_265)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            {tabId === 'chat' ? t('playground.chatTitle') : t('sandbox.title')}
          </button>
        ))}
      </motion.div>

      <motion.div variants={fadeUp} className="mt-6">
        {tab === 'chat' ? <ChatWindow /> : <SandboxWindow />}
      </motion.div>
    </motion.section>
  )
}
