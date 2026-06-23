import { useEffect, useState } from 'react'
import { getSkills } from '@/Services/Public/skillService'
import type { ApiSkill } from '@/Services/Public/skillService'

export interface SkillGroupData {
  category: string
  items: string[]
}

export function useSkills() {
  const [groups, setGroups] = useState<SkillGroupData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    getSkills()
      .then(skills => {
        if (!active) return
        setGroups(groupByCategory(skills))
        setIsLoading(false)
      })
      .catch(() => {
        if (active) {
          setError('Gagal memuat keahlian.')
          setIsLoading(false)
        }
      })
    return () => {
      active = false
    }
  }, [])

  return { groups, isLoading, error }
}

function groupByCategory(skills: ApiSkill[]): SkillGroupData[] {
  const map = new Map<string, string[]>()
  for (const skill of skills) {
    const list = map.get(skill.category) ?? []
    list.push(skill.name)
    map.set(skill.category, list)
  }
  return Array.from(map, ([category, items]) => ({ category, items }))
}
