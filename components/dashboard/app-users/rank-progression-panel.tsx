// components/dashboard/app-users/rank-progression-panel.tsx
import { Lock, CheckCircle2 } from 'lucide-react'
import { RANKS } from '@/lib/data/ranks'
import { isRankUnlocked } from '@/lib/rank-logic'
import { RankIcon } from './rank-icon'
import { cn } from '@/lib/utils'

interface RankProgressionPanelProps {
  selectedRankId: number
  onSelectRank: (id: number) => void
}

export function RankProgressionPanel({ selectedRankId, onSelectRank }: RankProgressionPanelProps) {
  return (
    <div className="rounded-xl border bg-slate-900 p-4 text-white">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-semibold">Rank Progression</p>
        <span className="text-xs text-slate-400">{RANKS.length} Ranks</span>
      </div>
      <div className="space-y-2">
        {RANKS.map((rank) => {
          const unlocked = isRankUnlocked(rank)
          const isSelected = rank.id === selectedRankId
          return (
            <button
              key={rank.id}
              onClick={() => onSelectRank(rank.id)}
              className={cn(
                'flex w-full items-center justify-between rounded-lg p-2.5',
                isSelected ? 'bg-slate-800 ring-1 ring-slate-600' : 'hover:bg-slate-800/60'
              )}
            >
              <div className="flex items-center gap-3">
                <span className={cn('flex h-8 w-8 items-center justify-center rounded-full', rank.iconBg)}>
                  <RankIcon rank={rank} className="h-4 w-4 text-white" />
                </span>
                <div className="text-left">
                  <p className="text-xs text-slate-400">{rank.id}</p>
                  <p className="text-sm font-medium">{rank.name}</p>
                </div>
              </div>
              {unlocked ? (
                <CheckCircle2 className="h-4 w-4 text-green-400" />
              ) : (
                <Lock className="h-4 w-4 text-slate-500" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}