'use client'

import { useSyncExternalStore } from 'react'
import type { FuelOrder, OrderStatus } from '@/lib/types/order'
import { withMockLogistics } from '@/lib/mock/order-logistics'

// 1. Rename this to `seedOrders`
const seedOrders: FuelOrder[] = [
  { id: '#ORD-2023-8901', station: 'SAO Ikeja Branch', stationCode: 'SAO-IJK-042', stationState: 'Lagos State', product: 'PMS', productFullName: 'PMS - Premium Motor Spirit', quantity: '33,000', unit: 'L', date: 'Oct 24, 09:30 AM', status: 'pending', unitPrice: '₦620.00 / L', totalValue: '₦20,460,000', requestedLiters: '33,000 L', dateRequested: 'Oct 23, 2023', expectedDelivery: 'Oct 25, 2023', managerName: 'Sarah Ahmed', managerPhone: '+234 801 234 5678', originSource: 'Apapa Main Depot', originAddress: 'Lagos Terminal A', tracking: [
    { label: 'Order Placed', date: 'Oct 23, 09:00 AM', done: true },
    { label: 'Loading at Depot', date: 'Oct 24, 08:30 AM', done: true },
    { label: 'In-Transit', date: 'Oct 24, 14:30 PM (Last update)', done: true, current: true },
    { label: 'Delivered', date: 'Pending', done: false },
  ]},
  { id: '#ORD-2023-8898', station: 'SAO Lekki Phase 1', stationCode: 'SAO-LKI-018', stationState: 'Lagos State', product: 'AGO', productFullName: 'AGO - Automotive Gas Oil', quantity: '15,000', unit: 'L', date: 'Oct 23, 14:15 PM', status: 'in-transit', unitPrice: '₦780.00 / L', totalValue: '₦11,700,000', requestedLiters: '15,000 L', dateRequested: 'Oct 22, 2023', expectedDelivery: 'Oct 24, 2023', managerName: 'Ibrahim Suleiman', managerPhone: '+234 802 345 6789' },
  { id: '#ORD-2023-8895', station: 'SAO Abuja Central', stationCode: 'SAO-ABJ-009', stationState: 'FCT', product: 'PMS', productFullName: 'PMS - Premium Motor Spirit', quantity: '45,000', unit: 'L', date: 'Oct 23, 10:00 AM', status: 'loading', unitPrice: '₦620.00 / L', totalValue: '₦27,900,000', requestedLiters: '45,000 L', dateRequested: 'Oct 21, 2023', expectedDelivery: 'Oct 24, 2023', managerName: 'Chidinma Okafor', managerPhone: '+234 803 456 7890' },
  { id: '#ORD-2023-8890', station: 'SAO Victoria Island', stationCode: 'SAO-VIL-005', stationState: 'Lagos State', product: 'LPG', productFullName: 'LPG - Liquefied Petroleum Gas', quantity: '10,000', unit: 'Kg', date: 'Oct 22, 16:45 PM', status: 'fulfilled', unitPrice: '₦950.00 / Kg', totalValue: '₦9,500,000', requestedLiters: '10,000 Kg', dateRequested: 'Oct 20, 2023', expectedDelivery: 'Oct 22, 2023', managerName: 'Robert Chen', managerPhone: '+234 804 567 8901' },
  { id: '#ORD-2023-8885', station: 'SAO Surulere', stationCode: 'SAO-SUR-011', stationState: 'Lagos State', product: 'DPK', productFullName: 'DPK - Dual Purpose Kerosene', quantity: '5,000', unit: 'L', date: 'Oct 21, 08:20 AM', status: 'cancelled', unitPrice: '₦710.00 / L', totalValue: '₦3,550,000', requestedLiters: '5,000 L', dateRequested: 'Oct 19, 2023', expectedDelivery: 'Oct 21, 2023', managerName: 'Elena Rodriguez', managerPhone: '+234 805 678 9012' },
]

// 2. Remove `let` here so it reassigns properly using the `seedOrders` reference
let orders: FuelOrder[] = seedOrders.map(withMockLogistics)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let pendingRequests: FuelOrder[] = Array.from({ length: 12 }, (_, i) => ({
  id: '#ORD-2023-8901',
  station: 'SAO Ikeja Branch',
  stationCode: 'SAO-IJK-042',
  stationState: 'Lagos State',
  product: 'PMS',
  productFullName: 'PMS - Premium Motor Spirit',
  quantity: '33,000',
  unit: 'L',
  date: 'Oct 24, 09:30 AM',
  status: 'pending',
  unitPrice: '₦620.00 / L',
  totalValue: '₦20,460,000',
  requestedLiters: '33,000 L',
  dateRequested: 'Oct 23, 2023',
  expectedDelivery: 'Oct 25, 2023',
  managerName: 'Sarah Ahmed',
  managerPhone: '+234 801 234 5678',
}))

type Listener = () => void
const listeners = new Set<Listener>()
function emitChange() {
  listeners.forEach((l) => l())
}

export const ordersStore = {
  getOrders: () => orders,
  getPendingRequests: () => pendingRequests,
  getOrder: (id: string) => orders.find((o) => o.id === id) ?? null,
  subscribe: (listener: Listener) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
acceptOrder: (id: string) => {
  const req = pendingRequests.find((o) => o.id === id)
  if (!req) return
  pendingRequests = pendingRequests.filter((o) => o.id !== id)
  orders = [withMockLogistics({ ...req, status: 'loading' }), ...orders]
  emitChange()
},
updateOrderStatus: (id: string, status: OrderStatus) => {
  orders = orders.map((o) => (o.id === id ? withMockLogistics({ ...o, status }) : o))
  emitChange()
},
}

export function useOrders() {
  return useSyncExternalStore(
    ordersStore.subscribe,
    ordersStore.getOrders,
    ordersStore.getOrders // server snapshot
  )
}

export function usePendingRequests() {
  return useSyncExternalStore(
    ordersStore.subscribe,
    ordersStore.getPendingRequests,
    ordersStore.getPendingRequests // server snapshot
  )
}

export function useOrder(id: string) {
  const getSnapshot = () => ordersStore.getOrder(id)
  return useSyncExternalStore(ordersStore.subscribe, getSnapshot, getSnapshot)
}