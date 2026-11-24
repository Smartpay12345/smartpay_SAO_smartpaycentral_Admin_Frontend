// components/dashboard/trend.tsx
import { ArrowDown } from 'lucide-react'
import { Arr } from '@/components/icons'
import { comparisonLabel, formatChange } from '@/lib/dashboard/format'
import type { PeriodInfo } from '@/lib/dashboard/types'

// builds the `trend` prop your StatCard already takes
export function buildTrend(change: number | null, key: PeriodInfo['key']) {
  const { text, direction } = formatChange(change)
  return {
    icon: direction === 'up' ? <Arr /> : direction === 'down' ? <ArrowDown className="h-3 w-3 text-red-600" /> : <span />,
    changeValue: text, // "—" when there is nothing to compare with
    changeValueColor: direction === 'up' ? 'text-green-600' : direction === 'down' ? 'text-red-600' : 'text-gray-400',
    changeLabel: change === null ? '' : (comparisonLabel(key) ?? ''),
    changeLabelColor: 'text-gray-400',
  }
}

export function trendPill(percent: number | null | undefined) {
  const rounded = percent == null ? null : Number(percent.toFixed(1))
  if (rounded === null || rounded === 0) {
    return { trendDirection: 'none' as const, trendValue: rounded === 0 ? '0%' : undefined }
  }
  return { trendDirection: rounded > 0 ? ('up' as const) : ('down' as const), trendValue: `${Math.abs(rounded)}%` }
}