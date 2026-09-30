// components/dashboard/period-toggle.tsx
'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

const periods = ['Day', 'Week', 'Month', 'Year']

export function PeriodToggle() {
  const [active, setActive] = useState('Month')

  return (
    <div className="flex gap-1 rounded-lg bg-gray-100 p-1 text-xs">
      {periods.map((p) => (
        <button
          key={p}
          onClick={() => setActive(p)}
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