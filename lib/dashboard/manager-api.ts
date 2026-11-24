import { call } from './call'
import type { ManagersList, ManagerDetail, ManagerAction, ManagerStatusResult } from './manager-types'

export const managersApi = {
  list: (p: { search?: string; status?: string; state?: string; station_id?: string; page?: number; page_size?: number } = {}) =>
    call<ManagersList>('managers-list', { ...p, search: p.search?.trim() || undefined }),
  detail: (manager_id: string) => call<ManagerDetail>('manager-detail', { manager_id }),
  setStatus: (manager_id: string, action: ManagerAction) =>
    call<ManagerStatusResult>('manager-status', { manager_id, action }),
}