import axiosInstance from '@/Services/Common/axiosInstance'
import type { SandboxEndpoint, SandboxParam } from '@/Constants/sandboxEndpoints'

function buildUrl(path: string, params: SandboxParam[], values: Record<string, string>): string {
  let url = path
  const queryParams: Record<string, string> = {}

  for (const param of params) {
    const value = values[param.key]
    if (!value) continue

    if (param.inPath) {
      url = url.replace(`:${param.key}`, encodeURIComponent(value))
    } else {
      queryParams[param.key] = value
    }
  }

  const qs = new URLSearchParams(queryParams).toString()
  return qs ? `${url}?${qs}` : url
}

export async function executeEndpoint(
  endpoint: SandboxEndpoint,
  paramValues: Record<string, string>,
): Promise<{ data: unknown; status: number; duration: number }> {
  const url = buildUrl(endpoint.path, endpoint.params, paramValues)
  const start = performance.now()

  const res = await axiosInstance.get(url)
  const duration = Math.round(performance.now() - start)

  return { data: res.data, status: res.status, duration }
}
