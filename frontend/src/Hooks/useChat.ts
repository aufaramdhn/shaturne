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

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([])
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
      setMessages(prev => [...prev, userMsg])
      setIsLoading(true)

      try {
        const reply = await sendMessage(text.trim())
        const aiMsg: Message = {
          id: crypto.randomUUID(),
          role: 'ai',
          content: reply,
          ts: Date.now(),
        }
        setMessages(prev => [...prev, aiMsg])
      } catch {
        setError('Gagal mengirim pesan. Coba lagi.')
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading],
  )

  const clear = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return { messages, isLoading, error, send, clear }
}
