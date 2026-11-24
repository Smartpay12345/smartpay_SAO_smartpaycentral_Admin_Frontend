// lib/types/rank.ts
export interface RankCriterion {
  key: string
  label: string
  current: number
  target: number
  unit: string // '₦' prefix amounts formatted separately, this is just for display math
}

export interface Rank {
  id: number
  name: string
  icon: 'aspirant' | 'pioneer' | 'pinnacle' | 'celebrity' | 'legendary'
  iconBg: string
  criteria: RankCriterion[]
}