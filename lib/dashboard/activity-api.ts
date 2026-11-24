// lib/dashboard/activity-api.ts
import { call } from './call'
import type { ActivityList } from './activity-types'

export const ACTIVITY_KEY = 'activity-list'

export interface ActivityParams {
  period?: string
  category?: string
  status?: 'success' | 'failed'
  user_type?: 'admin' | 'staff' | 'system'
  station_id?: string
  search?: string
  start_date?: string
  end_date?: string
  page?: number
  page_size?: number
}

export const activityApi = {
  list: (p: ActivityParams = {}) =>
    call<ActivityList>('activity-list', { ...p, search: p.search?.trim() || undefined }),
}