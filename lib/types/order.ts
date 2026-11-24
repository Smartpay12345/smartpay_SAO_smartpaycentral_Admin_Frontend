// lib/types/order.ts
export interface OrderTrackingStep {
  label: string
  date: string
  done: boolean
  current?: boolean
}

export type OrderStatus = 'pending' | 'loading' | 'in-transit' | 'fulfilled' | 'cancelled'

export interface FuelOrder {
  id: string
  station: string
  stationCode: string
  stationState: string
  product: 'PMS' | 'AGO' | 'DPK' | 'LPG'
  date: string
  status: OrderStatus
  requestedLiters: string
  unitPrice: string
  totalValue: string
  assignedManager: string
  managerPhone: string
  originSource: string
  originAddress: string
  tracking: OrderTrackingStep[]
}