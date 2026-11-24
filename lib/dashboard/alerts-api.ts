// lib/dashboard/alerts-api.ts
import { call } from './call'
import type { AlertsList, AlertsSummary, AlertTab, AlertPriorityFilter } from './alerts-types'

export const ALERT_KEYS = { summary: 'alerts-summary', list: 'alerts-list' } as const

export interface AlertsListParams {
  tab?: AlertTab
  priority?: AlertPriorityFilter
  page?: number
  page_size?: number
}

export const alertsApi = {
  summary: () => call<AlertsSummary>('alerts-summary'),
  list: (p: AlertsListParams = {}) => call<AlertsList>('alerts-list', p),
  markRead: (body: { alert_id: string } | { all: true }) =>
    call<{ ok: boolean; unread: number }>('alerts-read', body),
}