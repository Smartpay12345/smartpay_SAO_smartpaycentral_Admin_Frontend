// components/dashboard/orders/order-status-chip.tsx
import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/lib/types/order'

const config: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-red-50 text-red-500' },
  loading: { label: 'Loading', className: 'bg-orange-50 text-orange-500' },
  'in-transit': { label: 'In-Transit', className: 'bg-blue-50 text-blue-600' },
  fulfilled: { label: 'Fulfilled', className: 'bg-green-50 text-green-600' },
  cancelled: { label: 'Cancelled', className: 'bg-red-50 text-red-600' },
}

export function OrderStatusChip({ status }: { status: OrderStatus }) {
  const c = config[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium', c.className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {c.label}
    </span>
  )
}