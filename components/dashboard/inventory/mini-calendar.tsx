'use client'

import { useState } from 'react'
import { parseIso, toIso } from '@/lib/utils/date'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface MiniCalendarProps {
  selectedDate: string            // YYYY-MM-DD
  maxDate: string                 // latest pickable day (today)
  onSelectDate: (date: string) => void
}


import { RedDown, RedUp } from '@/components/icons'
const YEAR_RANGE = Array.from({ length: 11 }, (_, i) => 2020 + i) // 2020–2030, adjust as needed

export function MiniCalendar({ selectedDate, maxDate, onSelectDate }: MiniCalendarProps) {
  const initial = parseIso(selectedDate)
  const [month, setMonth] = useState(initial.m - 1)
  const [year, setYear] = useState(initial.y)

  const monthName = new Date(year, month).toLocaleString('default', { month: 'long' })
  const firstDayOfMonth = (new Date(year, month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const cells: { day: number; current: boolean }[] = []
  for (let i = firstDayOfMonth - 1; i >= 0; i--) cells.push({ day: daysInPrevMonth - i, current: false })
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, current: true })

  let nextMonthDay = 1
  while (cells.length % 7 !== 0) cells.push({ day: nextMonthDay++, current: false })

  function changeMonth(delta: number) {
    let newMonth = month + delta
    let newYear = year
    if (newMonth < 0) { newMonth = 11; newYear -= 1 }
    if (newMonth > 11) { newMonth = 0; newYear += 1 }
    setMonth(newMonth)
    setYear(newYear)
  }

  return (
    <div className="rounded-xl border p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex shrink-0 items-center gap-2">
          <p className="w-20 shrink-0 text-center font-medium">{monthName}</p>
          <button onClick={() => changeMonth(-1)} className="shrink-0 text-gray-400">
            <RedUp />
          </button>
          <button onClick={() => changeMonth(1)} className="shrink-0 text-red-500">
            <RedDown />
          </button>
        </div>

        <Select value={String(year)} onValueChange={(v) => { if (typeof v === 'string' && v) setYear(Number(v)) }}>
          <SelectTrigger className="h-7 w-[80px] shrink-0 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end" className="min-w-[80px]">
            {YEAR_RANGE.map((y) => (
              <SelectItem key={y} value={String(y)}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
          <span key={d} className="py-1 text-gray-400">{d}</span>
        ))}
        {cells.map((c, i) => {
          if (!c.current) return <span key={i} className="py-1.5 text-gray-300">{c.day}</span>
          const iso = toIso({ y: year, m: month + 1, d: c.day })
          const selected = iso === selectedDate
          const future = iso > maxDate
          return (
            <button
              key={i}
              type="button"
              disabled={future}
              onClick={() => onSelectDate(iso)}
              className={selected
                ? 'mx-auto flex h-7 w-7 items-center justify-center rounded-md bg-primary font-medium text-primary-foreground'
                : `py-1.5 ${future ? 'text-gray-300' : 'text-gray-700'}`}
            >
              {c.day}
            </button>
          )
        })}
      </div>
    </div>
  )
}