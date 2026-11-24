// components/dashboard/settlement/settlement-entry-row.tsx — white-bg version
import { Landmark } from 'lucide-react'
import { StatusBadge } from '@/components/dashboard/status-badge'
import type { SettlementEntry } from '@/lib/types/settlement'

export function SettlementEntryRow({ entry }: { entry: SettlementEntry }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-3 last:border-b-0">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50">
          <Landmark className="h-4 w-4 text-primary" />
        </span>
        <div>
          <p className="text-sm font-medium text-gray-900">To {entry.destination}</p>
          <p className="text-xs text-gray-400">{entry.date} • Ref: {entry.reference}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-sm font-medium text-gray-900">{entry.amount}</p>
        <StatusBadge status={entry.status} />
      </div>
    </div>
  )
}