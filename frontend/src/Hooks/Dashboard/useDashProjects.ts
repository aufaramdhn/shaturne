import { useState, useEffect, useCallback } from 'react'
import {
  getDashProjects,
  createProject,
  updateProject,
  deleteProject,
  uploadMedia,
  deleteMedia,
} from '@/Services/Dashboard/dashboardService'
import type { DashProject, ProjectPayload } from '@/Services/Dashboard/dashboardService'

function mapApiErrors(err: unknown): Record<string, string> {
  const e = err as { response?: { data?: { errors?: Record<string, string[]> } } }
  const raw = e.response?.data?.errors ?? {}
  return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, v[0]]))
}

export function useDashProjects() {
  const [items, setItems] = useState<DashProject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      setItems(await getDashProjects())
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

  async function create(payload: ProjectPayload): Promise<boolean> {
    setSaving(true)
    setErrors({})
    try {
      await createProject(payload)
      await load()
      return true
    } catch (err) {
      setErrors(mapApiErrors(err))
      return false
    } finally {
      setSaving(false)
    }
  }

  async function update(uuid: string, payload: ProjectPayload): Promise<boolean> {
    setSaving(true)
    setErrors({})
    try {
      await updateProject(uuid, payload)
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
    await deleteProject(uuid)
    await load()
  }

  return {
    items,
    isLoading,
    saving,
    errors,
    clearErrors,
    create,
    update,
    remove,
    uploadMedia,
    deleteMedia,
  }
}
