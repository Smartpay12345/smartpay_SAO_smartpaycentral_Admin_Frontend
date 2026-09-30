import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/lib/types/order'
import { 
  Clock, 
  Check, 
  X 
} from 'lucide-react'
import { BTank, RLoad } from '@/components/icons'

const config: Record<OrderStatus, { label: string; className: string; icon: React.ReactNode }> = {
  pending: { 
    label: 'Pending', 
    className: 'bg-red-50 text-red-500', 
    icon: <Clock className="h-3 w-3" /> 
  },
  loading: { 
    label: 'Loading', 
    className: 'bg-orange-50 text-orange-500', 
    icon: <RLoad className="h-2 w-2" /> 
  },
  'in-transit': { 
    label: 'In-Transit', 
    className: 'bg-blue-50 text-blue-600', 
    icon: <BTank className="h-3 w-3" /> 
  },
  fulfilled: { 
    label: 'Fulfilled', 
    className: 'bg-green-50 text-green-600', 
    icon: <Check className="h-3 w-3" /> 
  },
  cancelled: { 
    label: 'Cancelled', 
    className: 'bg-red-50 text-red-600', 
    icon: <X className="h-3 w-3" /> 
  },
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const c = config[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium', c.className)}>
      {c.icon}
      {c.label}
    </span>
  )
}