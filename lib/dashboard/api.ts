import { authedPost } from '@/lib/auth/store'
import {RevenueSummary, CashbackBreakdown, PeriodFilter,} from './types'

type Change = number | null // null -> show "-", never 0%

export interface SummaryResponse {
  total_sales: { amount: number; change_percent: Change }
  transactions: { count: number; change_percent: Change }
  litres_sold: { litres: number; lpg_kg: number; change_percent: Change }
  gross_profit: { amount: number; change_percent: Change }
}
export interface ChartResponse {
  points: { start: string; label: string; deposit: number; cashback: number }[]
  totals: { deposit: number; cashback: number }
}
export interface TodayResponse {
  deposit: { today: { amount: number; change_percent: Change }; this_month: { amount: number; change_percent: Change } }
  cashback: { today: { amount: number; change_percent: Change }; this_month: { amount: number; change_percent: Change } }
  sales_today: { count: number; amount: number; change_percent: Change }
}

export const getSummary = (period: string) => authedPost<SummaryResponse>('smartpay-admin-dashboard-summary', { period })
export const getRevenueChart = (period: string) => authedPost<ChartResponse>('smartpay-admin-revenue-chart', { period })
export const getToday = () => authedPost<TodayResponse>('smartpay-admin-dashboard-today', {})



export interface SalesOverviewResponse {
  total_sales: { amount: number; change_percent: Change }
  litres_sold: { litres: number; lpg_kg: number; change_percent: Change }
  transactions: { count: number; change_percent: Change }
  sales_growth: { change_percent: Change }
  products: {
    code: 'PMS' | 'AGO' | 'DPK' | 'LPG'
    name: string
    sales: number
    quantity: number
    unit: 'L' | 'kg'
    transactions: number
    share_percent: number
  }[]
  top_product: { code: string; name: string; share_percent: number } | null
}

export interface PeakHoursResponse {
  slots: { label: string; sales: number; transactions: number; share_percent: number; is_peak: boolean }[]
  peak: { label: string; range: string; sales: number } | null
}

export const getSalesOverview = (period: string) =>
  authedPost<SalesOverviewResponse>('smartpay-admin-sales-overview', { period })
export const getPeakHours = (period: string) =>
  authedPost<PeakHoursResponse>('smartpay-admin-sales-peak-hours', { period })

export const revenueSummary = (filter: PeriodFilter) =>
  authedPost<RevenueSummary>('smartpay-admin-revenue-summary', filter)

export const cashbackBreakdown = (filter: PeriodFilter) =>
  authedPost<CashbackBreakdown>('smartpay-admin-cashback-breakdown', filter)

