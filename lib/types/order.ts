export type OrderStatus = 'pending' | 'loading' | 'in-transit' | 'fulfilled' | 'cancelled'

export interface OrderTrackingStep {
  label: string
  date: string
  done: boolean
  current?: boolean
}

export interface FuelOrder {
  id: string
  station: string
  stationCode: string
  stationState: string
  product: 'PMS' | 'AGO' | 'DPK' | 'LPG'
  productFullName: string
  quantity: string
  unit: string
  date: string
  status: OrderStatus
  unitPrice: string
  totalValue: string
  requestedLiters: string
  dateRequested: string
  expectedDelivery: string
  managerName: string
  managerPhone: string
  originSource?: string
  originAddress?: string
  tracking?: OrderTrackingStep[]
}