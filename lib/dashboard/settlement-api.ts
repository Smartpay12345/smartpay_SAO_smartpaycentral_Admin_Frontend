// lib/dashboard/settlement-api.ts
import { authedPost } from '@/lib/auth/store'
import type {
  AdminSettlementOverview,
  AdminSettlementList,
  ProfitDaily,
  ProfitOverview,
  AdminSettlementDetail,
} from './settlement-types'


type PeriodArgs = { period?: string; start_date?: string; end_date?: string }


const callAdmin = <T>(endpoint: string, body: object = {}) =>
  authedPost<T>(`smartpay-admin-${endpoint}`, body)

export const adminSettlementApi = {
  saoOverview: (p: PeriodArgs = {}) => callAdmin<AdminSettlementOverview>('sao-settlement-overview', p),

  saoList: (p: PeriodArgs & { status?: string; search?: string; page?: number; page_size?: number } = {}) =>
    callAdmin<AdminSettlementList>('sao-settlements-list', {
      ...p,
      status: p.status === 'all' ? undefined : p.status,
      search: p.search?.trim() || undefined,
    }),

  saoDetail: (id: string) =>
    callAdmin<{ settlement: AdminSettlementDetail }>('sao-settlement-detail', { id }),

  profitOverview: (p: PeriodArgs = {}) => callAdmin<ProfitOverview>('profit-overview', p),

  profitDaily: (p: PeriodArgs & { page?: number; page_size?: number } = {}) =>
    callAdmin<ProfitDaily>('profit-daily', p),
}