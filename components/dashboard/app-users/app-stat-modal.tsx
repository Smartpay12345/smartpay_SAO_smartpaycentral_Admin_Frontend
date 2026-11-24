'use client'

import type { RefObject } from 'react'
import type { appUsersApi } from '@/lib/dashboard/app-users-api'
import { AnchoredPanel } from './anchored-panel'

type AppStats = Awaited<ReturnType<typeof appUsersApi.overview>>['app_stats']

export function AppStatModal({
  anchorRef,
  onClose,
  stats,
}: {
  anchorRef: RefObject<HTMLElement | null>
  onClose: () => void
  stats?: AppStats
}) {
  const total = stats?.registered_users ?? 0
  const pct = (n = 0) => (total > 0 ? Math.min(100, (n / total) * 100) : 0)
  const fmt = (n?: number) => (n === undefined ? '—' : n.toLocaleString('en-NG'))

  return (
    <AnchoredPanel anchorRef={anchorRef} onClose={onClose} className="w-[260px]">
      <p className="mb-4 text-base font-semibold text-gray-900">App Stats</p>
      <div className="space-y-3">
        <StatBar label="iPhone Active User" value={fmt(stats?.ios_users)} percent={pct(stats?.ios_users)} color="bg-blue-600" />
        <StatBar label="Android Active User" value={fmt(stats?.android_users)} percent={pct(stats?.android_users)} color="bg-green-500" />
        <StatBar label="Registered Users" value={fmt(stats?.registered_users)} percent={total > 0 ? 100 : 0} color="bg-gray-800" />
      </div>
    </AnchoredPanel>
  )
}

function StatBar({ label, value, percent, color }: { label: string; value: string; percent: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-gray-500">{value}</span>
        <span className="font-medium text-gray-900">{label}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-gray-100">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}