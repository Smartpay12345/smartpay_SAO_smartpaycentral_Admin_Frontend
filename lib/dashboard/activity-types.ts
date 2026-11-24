// lib/dashboard/activity-types.ts
export interface ActivityItem {
  id: string
  time: string
  user: { id: string | null; name: string; role: string; type: 'admin' | 'staff' | 'system'; initials: string }
  action: { category: string; category_label: string; title: string; detail: string | null }
  target: { kind: string; label: string; station_id: string | null }
  ip_address: string | null
  status: 'success' | 'failed'
  status_label: string
}

export interface ActivityList {
  pagination: { page: number; page_size: number; total: number; total_pages: number; showing_from: number; showing_to: number }
  activities: ActivityItem[]
}