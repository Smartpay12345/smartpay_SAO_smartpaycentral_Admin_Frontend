// lib/dashboard/manager-types.ts
export type ManagerStatus = 'active' | 'off_duty' | 'suspended' | 'removed'
export type ManagerAction = 'suspend' | 'unsuspend' | 'remove' | 'restore'

export interface ManagerStation {
  id: string
  name: string
  station_code: string
  address?: string
  city: string | null
  state: string
  state_label: string
  region: string
  location: string // "Ibadan, Oyo"
}

export interface ManagerListItem {
  id: string
  manager_id: string // MGR-1001
  full_name: string
  email: string
  phone: string
  level: string
  avatar_url: string | null
  status: ManagerStatus
  status_label: string
  online: boolean
  last_active_at: string | null
  joined_at: string
  station: ManagerStation | null // a removed manager may no longer have a station
}

export interface ManagersList {
  stats: { total_managers: number; active: number; off_duty: number; suspended: number; removed: number; locations: number }
  pagination: { page: number; page_size: number; total: number; total_pages: number; showing_from: number; showing_to: number }
  managers: ManagerListItem[]
}

export interface ManagerDetail {
  manager: {
    id: string; manager_id: string; full_name: string; email: string; phone: string
    home_address: string | null; level: string; avatar_url: string | null
    status: ManagerStatus; status_label: string; online: boolean
    last_active_at: string | null
    tenure: { joined_at: string; joined_year: number; years: number; months: number; label: string }
  }
   station: ManagerStation & { address: string }
  totals: { since: string; volume_litres: number; gas_kg: number; revenue: number; app_sales_amount: number; cash_sales_amount: number }
  other_active_managers_at_station: number
  staff_count: number
  actions: { can_suspend: boolean; can_unsuspend: boolean; can_remove: boolean; can_restore: boolean }
}

export interface ManagerStatusResult {
  manager: { id: string; status: ManagerStatus; status_label: string; suspended_at?: string | null }
  station_active_managers: number
  login_blocked: boolean | null
}

export interface PhotoSlot {
  photo_path: string
  upload_url: string
  token: string
  bucket: string
  content_type: string
  max_bytes: number
}