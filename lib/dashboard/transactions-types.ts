import type { PeriodInfo } from './types'

type Change = number | null
export type TxnStatus = 'completed' | 'pending' | 'failed' | 'expired' | 'cancelled'
interface Paging { page: number; page_size: number; total: number; total_pages: number; showing_from: number; showing_to: number }
interface Station { id: string; name: string; station_code: string; city?: string | null; address?: string; state?: string; location: string }
interface Customer {
  id: string; full_name: string; avatar_url: string | null
  virtual_account: { account_number: string; account_name: string; bank_name: string } | null
}

export interface TransactionsOverview {
  period: PeriodInfo
  purchase: { amount: number; count: number; change_percent: Change }
  deposit: { amount: number; count: number; change_percent: Change }
  bill_payment: { amount: number; count: number; change_percent: Change }
}

export interface TxnListItem {
  id: string; kind: 'fuel' | 'bill'; transaction_id: string
  status: TxnStatus; status_label: string; amount: number
  quantity: number | null; unit: 'L' | 'kg' | null; unit_price: number | null
  product_code: string | null; product_name: string | null; category: string; pump: string | null
  provider: string | null; biller_code: string | null; customer_identifier: string | null
  station: Station | null; customer_name: string; time: string
}
export interface TransactionsList { period: PeriodInfo; pagination: Paging; transactions: TxnListItem[] }

export interface DepositListItem {
  id: string; reference: string; status: 'completed'; status_label: string; amount: number; time: string
  customer: { id: string; full_name: string; avatar_url: string | null; virtual_account_number: string | null }
}
export interface DepositsList { period: PeriodInfo; pagination: Paging; deposits: DepositListItem[] }

export interface TransactionDetail {
  transaction: TxnListItem & {
    purchase_reference: string; cashback: number
    created_at: string; confirmed_at?: string | null; updated_at?: string | null
    customer_identifier_name?: string | null; meter_type?: string | null; failure_reason?: string | null
    managers: unknown[]
  }
  customer: Customer
}

export interface DepositDetail {
  deposit: {
    id: string; reference: string; status: string; status_label: string
    amount: number; amount_sent: number | null; fee: number | null; session_id: string | null; time: string
    from: { name: string; bank: string; account_number: string } | null
    to: { account_number: string; account_name: string; bank_name: string }
  }
  customer: Customer
}