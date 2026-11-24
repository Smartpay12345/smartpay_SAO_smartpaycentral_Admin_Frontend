import { call } from './call'
import type { PeriodFilter } from './types'
import type { TransactionsOverview, TransactionsList, TransactionDetail, DepositsList, DepositDetail } from './transactions-types'

type Page = { page?: number; page_size?: number }

export const transactionsApi = {
  overview: (p: PeriodFilter) => call<TransactionsOverview>('transactions-overview', p),
  list: (p: PeriodFilter & Page & { category?: string; status?: string; product?: string; station_id?: string; search?: string }) =>
    call<TransactionsList>('transactions-list', { ...p, search: p.search?.trim() || undefined }),
  detail: (id: string) => call<TransactionDetail>('transaction-detail', { id }),
  deposits: (p: PeriodFilter & Page & { search?: string }) =>
    call<DepositsList>('deposits-list', { ...p, search: p.search?.trim() || undefined }),
  depositDetail: (id: string) => call<DepositDetail>('deposit-detail', { id }),
}