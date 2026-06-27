import { useState, useCallback } from 'react'
import { SANDBOX_ENDPOINTS } from '@/Constants/sandboxEndpoints'
import type { SandboxEndpoint } from '@/Constants/sandboxEndpoints'
import { executeEndpoint } from '@/Services/sandboxService'

interface SandboxResult {
  selected: SandboxEndpoint
  setSelected: (e: SandboxEndpoint) => void
  paramValues: Record<string, string>
  setParam: (key: string, value: string) => void
  response: unknown
  status: number | null
  duration: number | null
  isLoading: boolean
  error: string | null
  execute: () => Promise<void>
  reset: () => void
}

export function useSandbox(): SandboxResult {
  const [selected, setSelectedState] = useState<SandboxEndpoint>(SANDBOX_ENDPOINTS[0])
  const [paramValues, setParamValues] = useState<Record<string, string>>({})
  const [response, setResponse] = useState<unknown>(null)
  const [status, setStatus] = useState<number | null>(null)
  const [duration, setDuration] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setSelected = useCallback((endpoint: SandboxEndpoint) => {
    setSelectedState(endpoint)
    setParamValues({})
    setResponse(null)
    setStatus(null)
    setDuration(null)
    setError(null)
  }, [])

  const setParam = useCallback((key: string, value: string) => {
    setParamValues(prev => ({ ...prev, [key]: value }))
  }, [])

  const execute = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await executeEndpoint(selected, paramValues)
      setResponse(result.data)
      setStatus(result.status)
      setDuration(result.duration)
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status: number; data: unknown } }
      if (axiosErr.response) {
        setResponse(axiosErr.response.data)
        setStatus(axiosErr.response.status)
      } else {
        setError('Request gagal. Periksa koneksi.')
      }
    } finally {
      setIsLoading(false)
    }
  }, [selected, paramValues])

  const reset = useCallback(() => {
    setResponse(null)
    setStatus(null)
    setDuration(null)
    setError(null)
    setParamValues({})
  }, [])

  return {
    selected,
    setSelected,
    paramValues,
    setParam,
    response,
    status,
    duration,
    isLoading,
    error,
    execute,
    reset,
  }
}
