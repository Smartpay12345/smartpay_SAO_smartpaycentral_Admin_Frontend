// lib/dashboard/settlement-types.ts

import { PeriodInfo, Pagination } from "./types"

export type SettlementStatus = 'completed' | 'pending' | 'failed'

export interface SettlementAccount {
  id: string
  bank_name: string
  bank_code: string
  account_name: string
  account_number_masked: string
  label: string // "GTBank **** 4589"
  nickname: string | null
  status: 'active' | 'pending' | 'inactive'
  activated_at: string | null
  created_at: string
}

export interface SettlementItem {
  id: string
  reference: string
  amount: number // withdrawals: what the bank receives (gross_amount minus fee)
  status: SettlementStatus
  status_label: 'Completed' | 'Pending' | 'Failed'
  needs_review: boolean
  destination: { bank_name: string; account_name: string; account_number_masked: string; label: string }
  station: { id: string; name: string } | null // null for withdrawals
  transaction_id: string | null // null for withdrawals
  time: string
  completed_at: string | null
  kind: 'withdrawal' | 'sale' // "sale" only on old per-sale payouts
  gross_amount: number | null // null on old sale payouts
  fee: number // 0 on old records
  source: 'manual' | 'auto' | null
}

export interface WalletOverview {
  wallet: { balance: number; sales_today: number; in_transit: number; total_sales: number; total_withdrawn: number }
  withdrawal: { mode: 'manual' | 'automatic'; auto_time: string; min_amount: number; fee: number; can_withdraw: boolean }
  account: SettlementAccount | null
}

// export type WalletEntryType = 'sale' | 'cashback' | 'withdrawal' | 'withdrawal_reversal'



// export interface WalletEntry {
//   id: string
//   type: WalletEntryType
//   type_label: string // ready to show: Sale, Customer cashback, Withdrawal, Withdrawal returned
//   direction: 'credit' | 'debit'
//   amount: number
//   balance_after: number
//   description: string
//   reference_type: string | null
//   reference_id: string | null
//   time: string
// }

// export interface WalletEntries {
//   period: PeriodInfo
//   pagination: Pagination
//   entries: WalletEntry[]
// }

// export type WithdrawRequest = ({ amount: number } | { all: true }) & { idempotency_key: string }

// export interface WithdrawResult {
//   withdrawal: {
//     id: string; reference: string; amount: number; fee: number; you_receive: number
//     status: SettlementStatus; duplicate: boolean
//   }
// }



// export interface SettlementAccounts {
//   active: SettlementAccount | null
//   pending: SettlementAccount | null
// }

// export interface VerifyResult {
//   verification_token: string
//   expires_in_seconds: number
//   bank_name: string
//   bank_code: string
//   account_number_masked: string
//   account_name: string
//   name_matches: boolean
//   message: string
// }

export interface AdminSettlementOverview {
  period: PeriodInfo
  all_settlement: { amount: number; count: number }
  pending: { amount: number; count: number }
  failed_count: number
  needs_review_count: number
  account: SettlementAccount | null
}

// same as your SettlementItem, but destination can be null (payout not sent to a bank yet)
export type AdminSettlementItem = Omit<SettlementItem, 'destination'> & {
  destination: SettlementItem['destination'] | null
}

export interface AdminSettlementList {
  period: PeriodInfo
  pagination: Pagination
  settlements: AdminSettlementItem[]
}

export interface AdminSettlementDetail extends AdminSettlementItem {
  created_at: string
  attempts: { attempt: number; result: 'success' | 'failed' | 'pending'; time: string }[]
  status_note: string | null
}

export interface ProfitBreakdown {
  income: { service_charge: number; stamp_duty: number; withdrawal_fee: number }
  costs: { cashback: number; deposit_fees: number }
}

export interface ProfitOverview extends ProfitBreakdown {
  period: PeriodInfo
  all_settlement: { amount: number; change_percent: number | null }
}

export interface ProfitDay extends ProfitBreakdown {
  date: string // YYYY-MM-DD, Lagos day
  profit: number
  fuel_sales: number
}

export interface ProfitDaily {
  period: PeriodInfo
  pagination: Pagination
  days: ProfitDay[]
}