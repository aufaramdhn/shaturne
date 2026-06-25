import { useFetch } from '@/Hooks/Dashboard/useFetch'
import { getOverview } from '@/Services/Dashboard/dashboardService'

export function useOverview() {
  return useFetch(getOverview)
}
