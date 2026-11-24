// components/dashboard/app-users/rank-target-content.tsx
'use client'

import { useState } from 'react'
import { RANKS } from '@/lib/data/ranks'
import { getCurrentRank, getNextRank, nextRankOverallPercent, criterionPercent, isRankUnlocked } from '@/lib/rank-logic'
import { RankProgressionPanel } from './rank-progression-panel'
import { cn } from '@/lib/utils'
import type { AppUser } from '@/lib/types/app-user'

export function RankTargetContent({ user }: { user: AppUser }) {
  const currentRank = getCurrentRank(RANKS)
  const nextRank = getNextRank(RANKS, currentRank)
  const [viewedRankId, setViewedRankId] = useState(nextRank?.id ?? RANKS[0].id)

  const viewedRank = RANKS.find((r) => r.id === viewedRankId) ?? RANKS[0]
  const viewedUnlocked = isRankUnlocked(viewedRank)

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-500">
            {user.name.charAt(0)}
          </span>
          <p className="text-sm font-semibold text-gray-900">{user.name}</p>
        </div>

        <div className="rounded-xl bg-slate-900 p-4 text-white">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>CURRENT RANK</span>
            <span>NEXT RANK TO</span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-lg font-semibold">{currentRank?.name ?? 'None'}</span>
            <span className="text-right">
              <span className="text-lg font-semibold text-amber-400">{nextRankOverallPercent(nextRank)}%</span>
              <span className="ml-1 text-xs uppercase text-slate-400">{nextRank?.name ?? '—'}</span>
            </span>
          </div>
        </div>

        <div className="space-y-4 rounded-xl border p-4">
          {!viewedUnlocked && viewedRank.id !== currentRank?.id && (
            <p className="text-xs text-gray-400">
              Showing requirements for <span className="font-medium text-gray-700">{viewedRank.name}</span>
              {viewedRank.id !== nextRank?.id && ' (locked — complete earlier ranks first)'}
            </p>
          )}
          {viewedRank.criteria.map((c) => {
            const percent = criterionPercent(c)
            return (
              <div key={c.key}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-gray-700">{c.label}</span>
                  <span className="text-gray-900">
                    {c.unit}{c.current.toLocaleString()} / {c.unit}{c.target.toLocaleString()} <span className="text-gray-400">{percent}%</span>
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-gray-100">
                  <div className={cn('h-1.5 rounded-full', percent >= 100 ? 'bg-green-500' : 'bg-red-500')} style={{ width: `${percent}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <RankProgressionPanel selectedRankId={viewedRankId} onSelectRank={setViewedRankId} />
    </div>
  )
}