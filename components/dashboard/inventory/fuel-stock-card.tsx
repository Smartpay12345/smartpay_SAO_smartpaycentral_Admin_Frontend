import { cn } from '@/lib/utils'
import type { FuelStock } from '@/lib/types/inventory'

const statusColor = {
  healthy: 'bg-green-500',
  low: 'bg-[#1E5EAC]',
  critical: 'bg-[#BA1A1A]',
  monitor: 'bg-[#916F6C]',
  pending: 'bg-gray-300'
}

const badgeColor = {
  healthy: ' bg-[#53E16F33] text-green-600',
  low: 'bg-[#A8C8FF33] text-[#E6BDB94D]',
  critical: 'bg-red-50 text-red-600',
  monitor: 'bg-gray-100 text-gray-500',
  pending: 'bg-gray-100 text-gray-500'
}

export function FuelStockCard({ stock, icon }: { stock: FuelStock; icon?: React.ReactNode }) {
  const percent = stock.current != null && stock.capacity ? Math.round((stock.current / stock.capacity) * 100) : 0

  const isCritical = stock.status === 'critical'

  return (
    <div className={cn('rounded-xl border p-4', isCritical && 'border-red-200 bg-red-50/40')}>
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="font-medium">{stock.label}</p>
          <p className="text-xs text-gray-400">{stock.tank}</p>
        </div>
        
        <span className={cn('flex h-10 w-10 items-center justify-center rounded-full', badgeColor[stock.status])}>
          {icon ?? '⛽'}
        </span>
      </div>

      <div className="mb-1 flex items-end justify-between">
        <p className={cn('text-lg font-semibold', isCritical && 'text-red-600')}>
        {stock.current == null ? '—' : stock.current.toLocaleString()} {stock.unit}
        </p>
        <p className="text-xs text-gray-400">of {stock.capacity != null && `of ${stock.capacity.toLocaleString()}${stock.unit}`}</p>
      </div>

      <div className="h-1.5 w-full rounded-full bg-gray-100">
        <div className={cn('h-1.5 rounded-full', statusColor[stock.status])} style={{ width: `${Math.min(percent, 100)}%` }} />
      </div>

      <p className={cn('mt-1 text-xs', isCritical ? 'text-red-500' : 'text-gray-400')}>{stock.note}</p>
    </div>
  )
}