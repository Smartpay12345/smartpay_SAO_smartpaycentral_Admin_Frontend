// components/dashboard/broadcast/schedule-pickers.tsx
'use client'

import { useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react'
import { toDateKey } from '@/lib/utils/broadcast-utils'
import type { TimeValue } from '@/lib/types/broadcast'
import { cn } from '@/lib/utils'

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

interface ScheduleCalendarProps {
  selected: Date | null
  onSelect: (d: Date) => void
  scheduledDates: string[]
  badgeLabel?: string
}

export function ScheduleCalendar({ selected, onSelect, scheduledDates, badgeLabel }: ScheduleCalendarProps) {
  const [today] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), d.getDate())
  })
  const [view, setView] = useState({ month: today.getMonth(), year: today.getFullYear() })

  const leading = (new Date(view.year, view.month, 1).getDay() + 6) % 7 // Monday-first
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()
  const daysInPrev = new Date(view.year, view.month, 0).getDate()

  const cells: { date: Date; current: boolean }[] = []
  for (let i = leading; i > 0; i--) cells.push({ date: new Date(view.year, view.month - 1, daysInPrev - i + 1), current: false })
  for (let d = 1; d <= daysInMonth; d++) cells.push({ date: new Date(view.year, view.month, d), current: true })
  while (cells.length % 7 !== 0) {
    const next = cells.length - leading - daysInMonth + 1
    cells.push({ date: new Date(view.year, view.month + 1, next), current: false })
  }

  const atCurrentMonth = view.year === today.getFullYear() && view.month === today.getMonth()
  const title = new Date(view.year, view.month).toLocaleString('en-US', { month: 'long', year: 'numeric' })

  function shift(delta: number) {
    setView((v) => {
      const d = new Date(v.year, v.month + delta, 1)
      return { month: d.getMonth(), year: d.getFullYear() }
    })
  }

  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          {badgeLabel && <span className="rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-medium text-red-500">{badgeLabel}</span>}
        </div>
        <div className="flex items-center gap-1 text-gray-500">
          <button type="button" aria-label="Previous month" disabled={atCurrentMonth} onClick={() => shift(-1)} className="rounded p-1 hover:bg-gray-200 disabled:opacity-30">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button type="button" aria-label="Next month" onClick={() => shift(1)} className="rounded p-1 hover:bg-gray-200">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((d, i) => (
          <span key={d} className={cn('py-1 text-[11px]', i >= 5 ? 'text-red-500' : 'text-gray-400')}>{d}</span>
        ))}
        {cells.map(({ date, current }) => {
          const key = toDateKey(date)
          const disabled = !current || date < today
          const isSelected = selected !== null && toDateKey(selected) === key
          const isScheduled = scheduledDates.includes(key)
          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(date)}
              className={cn(
                'mx-auto flex h-8 w-8 items-center justify-center rounded-md text-xs',
                isSelected
                  ? 'bg-red-600 font-semibold text-white'
                  : disabled
                    ? 'text-gray-300'
                    : isScheduled
                      ? 'bg-red-100 text-red-600'
                      : 'text-gray-700 hover:bg-gray-200'
              )}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>

      <div className="mt-3 flex items-center gap-4 text-[11px] text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-600" />
          First Launch ({selected ? selected.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'pick a date'})
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-red-100" /> Scheduled Cycles
        </span>
      </div>
    </div>
  )
}

interface TimeSpinnerProps {
  value: TimeValue
  onChange: (v: TimeValue) => void
}

export function TimeSpinner({ value, onChange }: TimeSpinnerProps) {
  const pad = (n: number) => String(n).padStart(2, '0')
  const stepHour = (d: number) => onChange({ ...value, hour: ((value.hour - 1 + d + 12) % 12) + 1 })
  const stepMinute = (d: number) => onChange({ ...value, minute: (value.minute + d * 5 + 60) % 60 })

  const arrow = 'text-gray-400 hover:text-gray-700'

  return (
    <div className="flex items-center justify-center gap-3 rounded-lg border bg-white p-3">
      <div className="flex flex-col items-center">
        <button type="button" aria-label="Increase hour" onClick={() => stepHour(1)} className={arrow}><ChevronUp className="h-4 w-4" /></button>
        <span className="text-3xl font-semibold tabular-nums text-gray-900">{pad(value.hour)}</span>
        <button type="button" aria-label="Decrease hour" onClick={() => stepHour(-1)} className={arrow}><ChevronDown className="h-4 w-4" /></button>
        <span className="text-[10px] text-gray-400">HRS</span>
      </div>

      <span className="pb-4 text-2xl font-semibold text-gray-900">:</span>

      <div className="flex flex-col items-center">
        <button type="button" aria-label="Increase minute" onClick={() => stepMinute(1)} className={arrow}><ChevronUp className="h-4 w-4" /></button>
        <span className="text-3xl font-semibold tabular-nums text-gray-900">{pad(value.minute)}</span>
        <button type="button" aria-label="Decrease minute" onClick={() => stepMinute(-1)} className={arrow}><ChevronDown className="h-4 w-4" /></button>
        <span className="text-[10px] text-gray-400">MIN</span>
      </div>

      <div className="flex flex-col gap-1">
        {(['AM', 'PM'] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange({ ...value, period: p })}
            className={cn('rounded px-2 py-1 text-xs font-medium', value.period === p ? 'bg-red-600 text-white' : 'text-gray-500 hover:bg-gray-100')}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  )
}