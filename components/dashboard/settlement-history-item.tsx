import { Landmark } from 'lucide-react'
import { StatusBadge } from './status-badge'

interface SettlementHistoryItemProps {
  destination: string
  date: string
  reference: string
  amount: string
  status: string
}

export function SettlementHistoryItem({ destination, date, reference, amount, status }: SettlementHistoryItemProps) {
  return (
    <div className="flex items-center justify-between border-b py-3 last:border-b-0">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50">
          <Landmark className="h-4 w-4 text-primary" />
        </span>
        <div>
          <p className="text-sm font-medium">To {destination}</p>
          <p className="text-xs text-gray-400">{date} • Ref: {reference}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-sm font-medium">{amount}</p>
        <StatusBadge status={status} />
      </div>
    </div>
  )
}