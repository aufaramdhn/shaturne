import { useState, useEffect, useCallback } from 'react'
import {
  getDashExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} from '@/Services/Dashboard/dashboardService'
import type { DashExperience, ExperiencePayload } from '@/Services/Dashboard/dashboardService'

function mapApiErrors(err: unknown): Record<string, string> {
  const e = err as { response?: { data?: { errors?: Record<string, string[]> } } }
  const raw = e.response?.data?.errors ?? {}
  return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, v[0]]))
}

export function useDashExperience() {
  const [items, setItems] = useState<DashExperience[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      setItems(await getDashExperience())
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  function clearErrors() {
    setErrors({})
  }

  async function create(payload: ExperiencePayload): Promise<boolean> {
    setSaving(true)
    setErrors({})
    try {
      await createExperience(payload)
      await load()
      return true
    } catch (err) {
      setErrors(mapApiErrors(err))
      return false
    } finally {
      setSaving(false)
    }
  }

  async function update(uuid: string, payload: ExperiencePayload): Promise<boolean> {
    setSaving(true)
    setErrors({})
    try {
      await updateExperience(uuid, payload)
      await load()
      return true
    } catch (err) {
      setErrors(mapApiErrors(err))
      return false
    } finally {
      setSaving(false)
    }
  }

  async function remove(uuid: string): Promise<void> {
    await deleteExperience(uuid)
    await load()
  }

  return { items, isLoading, saving, errors, clearErrors, create, update, remove }
}
