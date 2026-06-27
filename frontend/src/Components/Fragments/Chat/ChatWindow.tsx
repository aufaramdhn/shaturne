import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/Context/LanguageContext'
import { useChat } from '@/Hooks/useChat'
import ChatMessage from './ChatMessage'
import ChatInput from '@/Components/Elements/ChatInput'

export default function ChatWindow() {
  const { t } = useLanguage()
  const { messages, isLoading, error, send, clear } = useChat()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex h-[600px] flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
        <div>
          <h2 className="text-[length:var(--text-h3)] font-bold text-[var(--color-text)]">
            {t('playground.chatTitle')}
          </h2>
          <p className="mt-0.5 text-[0.8125rem] text-[var(--color-text-muted)]">
            {t('playground.chatSubtitle')}
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clear}
            className="text-[0.8125rem] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
          >
            {t('playground.clearButton')}
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {messages.length === 0 && (
          <p className="text-center text-[0.9375rem] text-[var(--color-text-muted)]">
            {t('playground.welcomeMessage')}
          </p>
        )}
        <div className="flex flex-col gap-4">
          {messages.map(msg => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="flex gap-2 pl-11">
              {[0, 1, 2].map(i => (
                <motion.span
                  key={i}
                  className="h-2 w-2 rounded-full bg-[var(--color-accent)]"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          )}
          {error && (
            <p role="alert" className="text-center text-[0.875rem] text-[var(--color-error)]">
              {error}
            </p>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <ChatInput onSend={send} disabled={isLoading} />
    </div>
  )
}
