// lib/dashboard/alerts-types.ts
export type AlertTab = 'all' | 'unread' | 'system'
export type AlertPriorityFilter = 'all' | 'high' | 'medium' | 'low'
export type AlertIconKey = 'warning' | 'order' | 'user_plus' | 'station' | 'report' | 'clock' | 'bell'
export type AlertTarget = 'station' | 'manager' | 'order' | 'settlement' | 'daily_report'

export interface AlertAction {
  label: string
  target: AlertTarget
  id: string | null
  station_id: string | null
  date: string | null
}

export interface AlertItem {
  id: string
  kind: string
  category: 'operational' | 'system'
  icon: AlertIconKey
  priority: 'high' | 'medium' | 'low'
  priority_label: string
  is_high_priority: boolean
  title: string
  message: string
  time: string
  is_read: boolean
  resolved: boolean
  station: { id: string; name: string } | null
  action: AlertAction | null
}

export interface AlertsList {
  counts: { all: number; unread: number; system: number; system_unread: number; high_unread: number }
  has_more: boolean
  pagination: { page: number; page_size: number; total: number; total_pages: number; showing_from: number; showing_to: number }
  alerts: AlertItem[]
}

export interface AlertsSummary { unread: number; high_unread: number; total: number }