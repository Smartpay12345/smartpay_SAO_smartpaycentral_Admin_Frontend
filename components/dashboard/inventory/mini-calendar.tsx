'use client'

import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface MiniCalendarProps {
  initialMonth: number
  initialYear: number
  highlightDay: number
}
import { RedDown, RedUp } from '@/components/icons'
const YEAR_RANGE = Array.from({ length: 11 }, (_, i) => 2020 + i) // 2020–2030, adjust as needed

export function MiniCalendar({ initialMonth, initialYear, highlightDay }: MiniCalendarProps) {
  const [month, setMonth] = useState(initialMonth)
  const [year, setYear] = useState(initialYear)

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
        {cells.map((c, i) => (
          <span
            key={i}
            className={
              c.current && c.day === highlightDay
                ? 'mx-auto flex h-7 w-7 items-center justify-center rounded-md bg-primary font-medium text-primary-foreground'
                : `py-1.5 ${c.current ? 'text-gray-700' : 'text-gray-300'}`
            }
          >
            {c.day}
          </span>
        ))}
      </div>
    </div>
  )
}