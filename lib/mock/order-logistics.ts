import type { FuelOrder, OrderStatus, OrderTrackingStep } from '@/lib/types/order'

const ORIGINS: Record<string, { source: string; address: string }> = {
  'Lagos State': { source: 'Apapa Main Depot', address: 'Lagos Terminal A' },
  FCT: { source: 'Suleja Depot', address: 'Abuja Terminal B' },
  'Oyo State': { source: 'Ibadan Depot', address: 'Ibadan Terminal C' },
}
const DEFAULT_ORIGIN = ORIGINS['Lagos State']

// placeholder timestamps — real version comes from an order_events table
export function buildTracking(status: OrderStatus): OrderTrackingStep[] {
  const placed = { label: 'Order Placed', date: 'Oct 23, 09:00 AM' }
  const loading = { label: 'Loading at Depot', date: 'Oct 24, 08:30 AM' }
  const transit = { label: 'In-Transit', date: 'Oct 24, 14:30 PM' }
  const delivered = { label: 'Delivered', date: 'Oct 25, 11:15 AM' }
  const later = (label: string) => ({ label, date: 'Pending', done: false })

  switch (status) {
    case 'pending':
      return [{ ...placed, done: true, current: true }, later(loading.label), later(transit.label), later(delivered.label)]
    case 'loading':
      return [
        { ...placed, done: true },
        { ...loading, date: `${loading.date} (Last update)`, done: true, current: true },
        later(transit.label),
        later(delivered.label),
      ]
    case 'in-transit':
      return [
        { ...placed, done: true },
        { ...loading, done: true },
        { ...transit, date: `${transit.date} (Last update)`, done: true, current: true },
        later(delivered.label),
      ]
    case 'fulfilled':
      return [
        { ...placed, done: true },
        { ...loading, done: true },
        { ...transit, done: true },
        { ...delivered, date: `${delivered.date} (Last update)`, done: true },
      ]
    case 'cancelled':
      return [
        { ...placed, done: true },
        { label: 'Cancelled', date: 'Oct 23, 16:40 PM (Last update)', done: true, current: true },
      ]
  }
}

export function withMockLogistics(order: FuelOrder): FuelOrder {
  const origin = ORIGINS[order.stationState] ?? DEFAULT_ORIGIN
  return {
    ...order,
    originSource: order.originSource ?? origin.source,
    originAddress: order.originAddress ?? origin.address,
    tracking: buildTracking(order.status),
  }
}