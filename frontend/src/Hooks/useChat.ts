import { useState, useCallback } from 'react'
import { sendMessage } from '@/Services/chatService'

export interface Message {
  id: string
  role: 'user' | 'ai'
  content: string
  ts: number
}

interface UseChatReturn {
  messages: Message[]
  isLoading: boolean
  error: string | null
  send: (text: string) => Promise<void>
  clear: () => void
}

const SESSION_KEY = 'shaturne_chat'

function loadMessages(): Message[] {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as Message[]) : []
  } catch {
    return []
  }
}

function saveMessages(msgs: Message[]): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(msgs))
  } catch {
    // sessionStorage not available (e.g. private mode quota)
  }
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>(loadMessages)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return
      setError(null)

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: text.trim(),
        ts: Date.now(),
      }
      setMessages(prev => {
        const next = [...prev, userMsg]
        saveMessages(next)
        return next
      })
      setIsLoading(true)

      try {
        const reply = await sendMessage(text.trim())
        const aiMsg: Message = {
          id: crypto.randomUUID(),
          role: 'ai',
          content: reply,
          ts: Date.now(),
        }
        setMessages(prev => {
          const next = [...prev, aiMsg]
          saveMessages(next)
          return next
        })
      } catch {
        setError('Gagal mengirim pesan. Coba lagi.')
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading],
  )

  const clear = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY)
    setMessages([])
    setError(null)
  }, [])

  return { messages, isLoading, error, send, clear }
}
