import { useState, useEffect, useCallback } from 'react'
import {
  getDashSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from '@/Services/Dashboard/dashboardService'
import type { DashSkill, SkillPayload } from '@/Services/Dashboard/dashboardService'

function mapApiErrors(err: unknown): Record<string, string> {
  const e = err as { response?: { data?: { errors?: Record<string, string[]> } } }
  const raw = e.response?.data?.errors ?? {}
  return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, v[0]]))
}

export function useDashSkills() {
  const [items, setItems] = useState<DashSkill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      setItems(await getDashSkills())
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

  async function create(payload: SkillPayload): Promise<boolean> {
    setSaving(true)
    setErrors({})
    try {
      await createSkill(payload)
      await load()
      return true
    } catch (err) {
      setErrors(mapApiErrors(err))
      return false
    } finally {
      setSaving(false)
    }
  }

  async function update(uuid: string, payload: SkillPayload): Promise<boolean> {
    setSaving(true)
    setErrors({})
    try {
      await updateSkill(uuid, payload)
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
    await deleteSkill(uuid)
    await load()
  }

  return { items, isLoading, saving, errors, clearErrors, create, update, remove }
}
