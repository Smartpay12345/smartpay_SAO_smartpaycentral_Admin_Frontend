import type { PeriodInfo } from './types'

export type ApiOrderStatus = 'pending' | 'loading' | 'in_transit' | 'fulfilled' | 'cancelled'
export type OrderTab = 'all' | 'pending' | 'in_transit' | 'fulfilled' | 'cancelled'

export interface OrdersOverview {
  month: { start_date: string; end_date: string }
  open: number
  closed_this_month: number
  new_orders: number
  cards: { pending: number; fulfilled_this_month: number; in_transit: number; loading: number; cancelled_this_month: number }
  placed_this_month: number
}

export interface OrderCore {
  id: string; order_code: string
  product_code: 'PMS' | 'AGO' | 'DPK' | 'LPG'; product_name: string; product_full_name: string
  quantity: number; unit: 'L' | 'kg'; unit_price: number; total_value: number
  status: ApiOrderStatus; status_label: string
  date: string; expected_delivery: string | null; last_updated: string
}

export interface OrderListItem extends OrderCore {
  station: { id: string; name: string; station_code: string; location: string }
}

export interface OrdersList {
  tab: string
  period: PeriodInfo | null
  pagination: { page: number; page_size: number; total: number; total_pages: number; showing_from: number; showing_to: number }
  orders: OrderListItem[]
}

export interface OrderDetail {
  order: OrderCore & { cancel_reason: string | null; admin_note: string | null }
  personnel: { id: string; manager_id: string; full_name: string; title: string; phone: string; email: string; avatar_url: string | null; status: string } | null
  logistics: {
    origin: { depot: string; terminal: string } | null
    destination: { id: string; name: string; station_code: string; address: string; city: string | null; state: string; state_label: string }
  }
  tracking: { key: string; label: string; state: 'done' | 'current' | 'upcoming'; at: string | null; note?: string | null }[]
}

export interface TrackingStep {
  key: string
  label: string
  state: 'done' | 'current' | 'upcoming'
  at: string | null
  note?: string | null
}