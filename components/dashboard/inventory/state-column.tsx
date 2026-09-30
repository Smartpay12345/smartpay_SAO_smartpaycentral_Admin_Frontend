import { BranchCard } from './branch-card'
import type { Branch } from '@/lib/types/inventory'


interface StateColumnProps {
  stateName: string
  stateKey: string
  counts: { total: number; healthy: number; issues: number }
  branches: Branch[]
  onBranchClick: (branch: Branch) => void
  onAddBranch: (stateKey: string) => void
}

export function StateColumn({ stateName, stateKey, counts, branches, onBranchClick, onAddBranch }: StateColumnProps) {
  return (
    <div className="w-72 shrink-0 snap-start">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span>{stateName}</span>
          <span className="text-green-600">{String(counts.total).padStart(2, '0')}</span>
          <span className="text-orange-500">{String(counts.healthy).padStart(2, '0')}</span>
          <span className="text-red-500">{String(counts.issues).padStart(2, '0')}</span>
        </div>
        <button
          onClick={() => onAddBranch(stateKey)}
          className="flex h-5 w-5 items-center justify-center rounded-full border text-gray-400 hover:bg-gray-50"
        >
          {/* swap for your Figma "+" icon if lucide's doesn't match exactly */}
          +
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {branches.map((b) => (
          <BranchCard key={b.id} branch={b} onClick={() => onBranchClick(b)} />
        ))}
      </div>
    </div>
  )
}