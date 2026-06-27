import { motion } from 'framer-motion'
import { fadeUp } from '@/Animations/variants'
import type { Message } from '@/Hooks/useChat'
import { useLanguage } from '@/Context/LanguageContext'

interface Props {
  message: Message
}

export default function ChatMessage({ message }: Props) {
  const { t } = useLanguage()
  const isUser = message.role === 'user'

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-raised)] font-[var(--font-mono)] text-[0.6875rem] text-[var(--color-accent)]">
        {isUser ? t('playground.youLabel') : t('playground.aiLabel')}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-[0.9375rem] leading-relaxed ${
          isUser
            ? 'bg-[var(--color-accent)] text-[oklch(15%_0.024_265)]'
            : 'bg-[var(--color-surface-raised)] text-[var(--color-text)]'
        }`}
      >
        {message.content}
      </div>
    </motion.div>
  )
}
