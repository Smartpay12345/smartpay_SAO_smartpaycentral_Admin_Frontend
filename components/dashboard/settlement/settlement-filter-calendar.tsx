// components/dashboard/settlement/settlement-filter-calendar.tsx
'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SettlementFilterCalendarProps {
  open: boolean
  onClose: () => void
  initialMonth: number
  initialYear: number
  onApply?: (start: string, end: string) => void
  onClear?: () => void
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const CURRENT_YEAR = new Date().getFullYear()
const YEAR_RANGE = Array.from({ length: 12 }, (_, i) => CURRENT_YEAR - i)

export function SettlementFilterCalendar({ open, onClose, initialMonth, initialYear, onApply, onClear }: SettlementFilterCalendarProps) {
  const [month, setMonth] = useState(initialMonth)
  const [year, setYear] = useState(initialYear)
  const [rangeStart, setRangeStart] = useState<string | null>(null)
  const [rangeEnd, setRangeEnd] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [monthPanelOpen, setMonthPanelOpen] = useState(false)
  const [yearPanelOpen, setYearPanelOpen] = useState(false)


  if (!open) return null

  const monthName = MONTHS[month]
  const firstDayOfMonth = (new Date(year, month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const cells: { day: number; current: boolean }[] = []
  for (let i = firstDayOfMonth - 1; i >= 0; i--) cells.push({ day: daysInPrevMonth - i, current: false })
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, current: true })
  while (cells.length % 7 !== 0) cells.push({ day: cells.length, current: false })

  function changeMonth(delta: number) {
    let newMonth = month + delta
    let newYear = year
    if (newMonth < 0) { newMonth = 11; newYear -= 1 }
    if (newMonth > 11) { newMonth = 0; newYear += 1 }
    setMonth(newMonth)
    setYear(newYear)
  }

  function closeAll() {
    onClose()
    setMonthPanelOpen(false)
    setYearPanelOpen(false)
  }

  const toIso = (day: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  function pickDay(day: number) {
    const iso = toIso(day)
    setError('')
    if (!rangeStart || rangeEnd) {        // first click, or starting a new range
      setRangeStart(iso)
      setRangeEnd(null)
      return
    }
    const [start, end] = iso < rangeStart ? [iso, rangeStart] : [rangeStart, iso]
    const days = (Date.parse(end) - Date.parse(start)) / 86_400_000 + 1
    if (days > 366) {                     // the API accepts 366 days at most
      setError('Choose a range of 366 days or less.')
      setRangeStart(null)
      return
    }
    setRangeStart(start)
    setRangeEnd(end)
    onApply?.(start, end)
    closeAll()
  }

  function clearRange() {
    setRangeStart(null)
    setRangeEnd(null)
    setError('')
    onClear?.()
    closeAll()
  }

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={() => { if (!rangeEnd) setRangeStart(null); closeAll() }} />

      <div className="absolute right-0 top-full z-40 mt-2 w-[300px] rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
        <div className="mb-3 flex items-center justify-between">
          <div className="relative flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); setMonthPanelOpen((v) => !v); setYearPanelOpen(false) }}
              className="flex items-center gap-1 font-medium text-gray-900"
            >
              {monthName} <ChevronDown className="h-3 w-3 text-red-500" />
            </button>

            {monthPanelOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute left-0 top-full z-50 mt-1 max-h-52 w-32 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg"
              >
                {MONTHS.map((m, i) => (
                  <button
                    key={m}
                    onClick={() => { setMonth(i); setMonthPanelOpen(false) }}
                    className={cn(
                      'block w-full px-3 py-1.5 text-left text-sm',
                      i === month ? 'bg-red-500 font-medium text-white' : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => changeMonth(-1)} className="text-red-500">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 9V3M6 3L3 6M6 3l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </button>

            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setYearPanelOpen((v) => !v); setMonthPanelOpen(false) }}
                className="flex items-center gap-1 text-sm text-gray-900"
              >
                {year} <ChevronDown className="h-3 w-3 text-red-500" />
              </button>

              {yearPanelOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full z-50 mt-1 max-h-52 w-20 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg"
                >
                  {YEAR_RANGE.map((y) => (
                    <button
                      key={y}
                      onClick={() => { setYear(y); setYearPanelOpen(false) }}
                      className={cn(
                        'block w-full py-2 text-sm',
                        y === year ? 'bg-red-500 font-medium text-white' : 'text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <p className={cn('mb-2 h-4 text-center text-xs', error ? 'text-red-600' : 'text-gray-400')}>
          {error || (!rangeStart ? 'Select a start day' : !rangeEnd ? 'Now select an end day' : '')}
        </p>

        <div className="grid grid-cols-7 gap-1 text-center text-xs" onClick={(e) => e.stopPropagation()}>
          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
            <span key={d} className="py-1 text-gray-400">{d}</span>
          ))}
          {cells.map((c, i) => {
            const iso = c.current ? toIso(c.day) : ''
            const isEdge = c.current && (iso === rangeStart || iso === rangeEnd)
            const inRange = c.current && !!rangeStart && !!rangeEnd && iso > rangeStart && iso < rangeEnd

            return (
              <button
                key={i}
                disabled={!c.current}
                onClick={() => c.current && pickDay(c.day)}
                className={cn(
                  'mx-auto flex h-7 w-7 items-center justify-center rounded-md text-sm',
                  isEdge
                    ? 'bg-red-500 font-medium text-white'
                    : inRange
                      ? 'bg-red-50 text-gray-900'
                      : c.current ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300'
                )}
              >
                {c.day}
              </button>
            )
          })}
        </div>
        <button onClick={clearRange} className="mt-3 w-full text-center text-sm font-medium text-red-500">
          Show all dates
        </button>
      </div>
    </>
  )
}