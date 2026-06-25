import { useState } from 'react'
import { useAuth } from '@/Hooks/Auth/useAuth'
import { updateProfile } from '@/Services/Dashboard/dashboardService'

function mapApiErrors(err: unknown): Record<string, string> {
  const e = err as { response?: { data?: { errors?: Record<string, string[]> } } }
  const raw = e.response?.data?.errors ?? {}
  return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, v[0]]))
}

export function useProfile() {
  const { user, applyUser } = useAuth()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function save(name: string, email: string): Promise<boolean> {
    setSaving(true)
    setSaved(false)
    setErrors({})
    try {
      const updated = await updateProfile({ name, email })
      applyUser(updated)
      setSaved(true)
      window.setTimeout(() => setSaved(false), 2500)
      return true
    } catch (err) {
      setErrors(mapApiErrors(err))
      return false
    } finally {
      setSaving(false)
    }
  }

  return { user, saving, saved, errors, save }
}
