'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type {PeriodLabel} from '@/lib/dashboard/period'

const periods: PeriodLabel[] = ['Day', 'Week', 'Month', 'Year']

interface PeriodToggleProps {
  value?: PeriodLabel
  onChange?: (period: PeriodLabel) => void
}

export function PeriodToggle({ value, onChange }: PeriodToggleProps) {
  const [internal, setInternal] = useState<PeriodLabel>('Month')
  const active = value ?? internal

  function select(p: PeriodLabel) {
    setInternal(p)
    onChange?.(p)
  }

  return (
    <div className="flex gap-1 rounded-lg bg-gray-100 p-1 text-xs">
      {periods.map((p) => (
        <button
          key={p}
          onClick={() => select(p)}
          className={cn(
            'rounded-md px-2.5 py-1 font-medium transition-colors',
            active === p ? 'bg-white shadow-sm' : 'text-gray-500'
          )}
        >
          {p}
        </button>
      ))}
    </div>
  )
}