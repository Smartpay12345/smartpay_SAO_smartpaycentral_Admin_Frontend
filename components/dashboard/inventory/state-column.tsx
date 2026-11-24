import { BranchCard } from './branch-card'
import type { Branch } from '@/lib/types/inventory'

interface StateColumnProps {
  stateName: string
  counts: { healthy: number; refill: number; notAccessible: number }
  branches: Branch[]
  onBranchClick: (branch: Branch) => void
}

export function StateColumn({ stateName, counts, branches, onBranchClick }: StateColumnProps) {
  return (
    <div className="w-72 shrink-0 snap-start">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span>{stateName}</span>
          <span className="text-green-600 text-[9px] bg-[#EBE8E3] rounded-full items-center justify-center flex h-6 w-6 p-3">{String(counts.healthy).padStart(2, '0')}</span>
          <span className="text-orange-500 text-[9px] bg-[#EBE8E3] rounded-full items-center justify-center flex h-6 w-6 p-3">{String(counts.refill).padStart(2, '0')}</span>
          <span className="text-red-500 text-[9px] bg-[#EBE8E3] rounded-full items-center justify-center flex h-6 w-6 p-3">{String(counts.notAccessible).padStart(2, '0')}</span>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {branches.map((b) => (
          <BranchCard key={b.id} branch={b} onClick={() => onBranchClick(b)} />
        ))}
      </div>
    </div>
  )
}