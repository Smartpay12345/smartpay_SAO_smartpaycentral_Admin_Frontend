// lib/dashboard/period.ts
import type { PeriodKey } from './types'
import type { PeriodFilter } from './types'

export type PeriodLabel = 'Day' | 'Week' | 'Month' | 'Year'

export const PERIOD_BY_LABEL: Record<PeriodLabel, Exclude<PeriodKey, 'custom'>> = {
  Day: 'today',
  Week: 'this_week',
  Month: 'this_month',
  Year: 'this_year',
}

export const PERIOD_TEXT: Record<PeriodLabel, string> = {
  Day: 'Today',
  Week: 'This Week',
  Month: 'This Month',
  Year: 'This Year',
}

export type StandardPeriodKey = Exclude<PeriodKey, 'custom'>

// options for the Revenue vs Cashback dropdown
export const PERIOD_CHOICES: { label: string; key: StandardPeriodKey }[] = [
  { label: 'Today', key: 'today' },
  { label: 'This Week', key: 'this_week' },
  { label: 'Last Week', key: 'last_week' },
  { label: 'This Month', key: 'this_month' },
  { label: 'Last Month', key: 'last_month' },
  { label: 'This Year', key: 'this_year' },
  { label: 'All Time', key: 'all_time' },
]

export type Quarter = 1 | 2 | 3 | 4

export function currentQuarter(): { quarter: Quarter; year: number } {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Lagos', year: 'numeric', month: '2-digit' }).formatToParts(new Date())
  const year = Number(parts.find((p) => p.type === 'year')?.value)
  const month = Number(parts.find((p) => p.type === 'month')?.value)
  return { quarter: (Math.floor((month - 1) / 3) + 1) as Quarter, year }
}

export function quarterFilter(quarter: Quarter, year: number): PeriodFilter {
  const startMonth = (quarter - 1) * 3 + 1
  const endMonth = startMonth + 2
  const lastDay = new Date(Date.UTC(year, endMonth, 0)).getUTCDate()
  const pad = (n: number) => String(n).padStart(2, '0')
  return { period: 'custom', start_date: `${year}-${pad(startMonth)}-01`, end_date: `${year}-${pad(endMonth)}-${pad(lastDay)}` }
}

export const currentQuarterFilter = (): PeriodFilter => {
  const { quarter, year } = currentQuarter()
  return quarterFilter(quarter, year)
}

