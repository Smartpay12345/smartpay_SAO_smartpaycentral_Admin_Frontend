// lib/dashboard/inventory-types.ts
import type { PeriodInfo } from './types'

export type BranchStatus = 'healthy' | 'refill_required' | 'not_accessible' | 'setup_pending'

export interface StateCounts {
  total: number
  healthy: number
  refill_required: number
  not_accessible: number
  setup_pending: number
}

export interface InventoryStation {
  id: string
  name: string
  station_code: string
  address: string
  city: string | null
  state: string
  created_at: string
  status: BranchStatus
  status_label: string
  station_status: 'active' | 'inactive' | 'suspended'
  sales: number
  transactions: number
  previous_sales: number
  change_percent: number | null
  change_direction: 'up' | 'down' | 'flat' | null
  manager_name: string | null
  has_manager: boolean
  has_location: boolean
  low_stock_products: string[]
}

export interface StateGroup {
  state: string // "Lagos", matches the value the Add Branch form expects
  label: string // "Lagos State"
  counts: StateCounts
  stations: InventoryStation[]
}

export interface InventoryBoard {
  period: PeriodInfo
  summary: StateCounts
  groups: StateGroup[]
}

export interface StockItem {
  product_code: 'PMS' | 'AGO' | 'DPK' | 'LPG'
  product_name: string
  title: string // "Petrol (PMS)"
  unit: 'L' | 'kg'
  tanks_label: string
  stock: number | null // null = starting stock not set
  capacity: number
  percent_full: number | null
  status: 'low' | 'monitor' | 'healthy' | null
  low_stock_alert: boolean
  note: string
}

export interface StationInventory {
 station: {
  id: string; name: string; station_code: string
  address: string; city: string | null; state: string; state_label: string
  latitude: number | null; longitude: number | null
  phone: string | null;
}
  stock: StockItem[]
  day: { date: string; total_sales: number; sales_count: number }
  month_to_date: { total_sales: number; sales_count: number }
}

export type StaffStatus = 'active' | 'off_duty' | 'suspended' | 'deactivated'

export interface StaffMember {
  id: string
  full_name: string
  email: string
  phone: string
  role: string
  job_title: string | null
  is_manager: boolean
  status: StaffStatus
  status_label: string
  date_joined: string
}

export interface StationStaff {
  station: { id: string; name: string; station_code: string }
  counts: { total: number; active: number; off_duty: number; suspended: number; deactivated: number }
  staff: StaffMember[]
}

export interface DayReportPump {
  id: string
  name: string
  product_code: string
  unit: string
  status: 'active' | 'retired'
  status_label: string
  has_reading: boolean
  opening: number | null
  closing: number | null
  dispensed: number | null
  needs_review: boolean
}

export interface StationDayReport {
  station: { id: string; station_code: string; city: string | null; state_label: string }
  date: string
  total_sales: number
  sales_count: number
  products: {
    product_code: string; product_name: string; unit: string
    amount: number; quantity: number; sales: number; buyers: number
  }[]
  pumps: DayReportPump[]
  manager_report: { comment: string | null; sent_at: string; sent_by: string | null } | null
}


