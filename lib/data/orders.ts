// lib/data/orders.ts
import type { FuelOrder } from '@/lib/types/order'

export const MOCK_ORDERS: FuelOrder[] = [
  {
    id: '#ORD-2023-8901',
    station: 'SAO Abuja Central',
    stationCode: 'SAO-IJK-042',
    stationState: 'Lagos State',
    product: 'PMS',
    date: 'Oct 23, 10:00 AM',
    status: 'in-transit',
    requestedLiters: '33,000 L',
    unitPrice: '₦620.00 / L',
    totalValue: '₦20,460,000',
    assignedManager: 'Akorede Rukayat',
    managerPhone: '+234 7033 30 3653',
    originSource: 'Apapa Main Depot',
    originAddress: 'Lagos Terminal A',
    tracking: [
      { label: 'Order Placed', date: 'Oct 23, 09:00 AM', done: true },
      { label: 'Loading at Depot', date: 'Oct 24, 08:30 AM', done: true },
      { label: 'In-Transit', date: 'Oct 24, 14:30 PM (Last update)', done: true, current: true },
      { label: 'Delivered', date: 'Pending', done: false },
    ],
  },
  // repeat shape for the other rows — same placeholder-repetition pattern Figma shows
  // (every row literally reads #ORD-2023-8901 in the screenshot; worth confirming
  // with your designer whether that's intentional or a duplicated-layer artifact)
]