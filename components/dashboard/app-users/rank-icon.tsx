// components/dashboard/app-users/rank-icon.tsx
import { User, Flag, Star, Crown, Trophy } from 'lucide-react'
import type { Rank } from '@/lib/types/rank'

const ICONS: Record<Rank['icon'], React.ComponentType<{ className?: string }>> = {
  aspirant: User,
  pioneer: Flag,
  pinnacle: Star,
  celebrity: Crown,
  legendary: Trophy,
}

export function RankIcon({ rank, className }: { rank: Rank; className?: string }) {
  const Icon = ICONS[rank.icon]
  return <Icon className={className} />
}