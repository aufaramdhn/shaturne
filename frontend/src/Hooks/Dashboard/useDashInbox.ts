import { useState, useEffect, useCallback } from 'react'
import { getMessages, readMessage, deleteMessage } from '@/Services/Dashboard/dashboardService'
import type { DashMessage } from '@/Services/Dashboard/dashboardService'

export function useDashInbox() {
  const [items, setItems] = useState<DashMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      setItems(await getMessages())
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function markRead(uuid: string): Promise<void> {
    await readMessage(uuid)
    await load()
  }

  async function remove(uuid: string): Promise<void> {
    await deleteMessage(uuid)
    await load()
  }

  return { items, isLoading, markRead, remove }
}
