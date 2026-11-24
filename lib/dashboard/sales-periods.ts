// lib/dashboard/sales-periods.ts
import type { StandardPeriodKey } from './period'

export const SALES_PERIODS = [
  { label: 'Today so far', key: 'today' },
  { label: 'Yesterday', key: 'yesterday' },
  { label: 'Last 7 days', key: 'last_7_days' },
  { label: 'Last 30 days', key: 'last_30_days' },
  { label: 'This week', key: 'this_week' },
  { label: 'Last week', key: 'last_week' },
  { label: 'This month', key: 'this_month' },
  { label: 'Last month', key: 'last_month' },
  { label: 'This year', key: 'this_year' },
  { label: 'All time', key: 'all_time' },
] as const satisfies readonly { label: string; key: StandardPeriodKey }[]

export type SalesPeriodKey = (typeof SALES_PERIODS)[number]['key']

export const periodLabel = (key: SalesPeriodKey) =>
  SALES_PERIODS.find((p) => p.key === key)?.label ?? ''