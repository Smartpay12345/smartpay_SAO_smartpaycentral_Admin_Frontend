// lib/types/settlement-admin.ts
// Request/response types for the five SmartPay super admin settlement endpoints.

export type PeriodKey =
  | 'all_time'
  | 'today'
  | 'yesterday'
  | 'last_7_days'
  | 'last_30_days'
  | 'this_week'
  | 'last_week'
  | 'this_month'
  | 'last_month'
  | 'this_year'
  | 'custom'

/** startDate / endDate (YYYY-MM-DD) are only used when key === 'custom'. */
export interface PeriodSelection {
  key: PeriodKey
  startDate: string
  endDate: string
}

export type SaoStatus = 'completed' | 'pending' | 'failed'
export type SaoStatusFilter = SaoStatus | 'all'

export interface SettlementFilterState {
  period: PeriodSelection
  status: SaoStatusFilter
  search: string
}

export interface PeriodInfo {
  key: PeriodKey
  start_date: string | null
  end_date: string | null
  compared_to: Record<string, unknown> | null
}

export interface Pagination {
  page: number
  page_size: number
  total: number
  total_pages: number
  showing_from: number
  showing_to: number
}

/* ---------------------------------- SAO fuel --------------------------------- */

export interface BankDestination {
  bank_name: string
  account_name: string
  account_number_masked: string
  label: string
}

export interface SaoAccount {
  id: string
  bank_name: string
  bank_code: string
  account_name: string
  account_number_masked: string
  label: string
  nickname: string | null
  status: string
  activated_at: string
  created_at: string
}

export interface SaoOverview {
  period: PeriodInfo
  all_settlement: { amount: number; count: number }
  pending: { amount: number; count: number }
  failed_count: number
  needs_review_count: number
  account: SaoAccount | null
}

export interface SaoSettlement {
  id: string
  reference: string
  amount: number
  status: SaoStatus
  status_label: string
  needs_review: boolean
  destination: BankDestination | null
  kind: 'withdrawal' | 'sale'
  gross_amount: number
  fee: number
  source: 'manual' | 'auto' | null
  station: string | null
  transaction_id: string | null
  time: string
  completed_at: string | null
}

export interface SaoSettlementList {
  period: PeriodInfo
  pagination: Pagination
  settlements: SaoSettlement[]
}

export interface SaoSettlementAttempt {
  attempt: number
  result: 'success' | 'failed' | 'pending'
  time: string
}

export interface SaoSettlementDetail extends SaoSettlement {
  created_at: string
  attempts: SaoSettlementAttempt[]
  status_note: string | null
}

export interface SaoSettlementDetailResponse {
  settlement: SaoSettlementDetail
}

/* ---------------------------------- SmartPay --------------------------------- */

export interface ProfitIncome {
  service_charge: number
  stamp_duty: number
  withdrawal_fee: number
}

export interface ProfitCosts {
  cashback: number
  deposit_fees: number
}

export interface ProfitOverview {
  period: PeriodInfo
  all_settlement: { amount: number; change_percent: number | null }
  income: ProfitIncome
  costs: ProfitCosts
}

export interface ProfitDay {
  date: string // Lagos calendar day, YYYY-MM-DD
  profit: number
  fuel_sales: number
  income: ProfitIncome
  costs: ProfitCosts
}

export interface ProfitDaily {
  period: PeriodInfo
  pagination: Pagination
  days: ProfitDay[]
}
