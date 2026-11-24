'use client'

import type { Branch } from '@/lib/types/inventory'
import { cn } from '@/lib/utils'
import { ArrowUp, ArrowDown } from '@/components/icons'

const statusStyles = {
  healthy: 'bg-[#008532] text-[#FFFFFF]',
  'refill-required': 'bg-[#E66B15] text-[#ffffff]',
  'not-accessible': 'bg-[#E11D2E] text-[#ffffff]',
  'setup-pending': 'bg-gray-400 text-white',
}

const statusLabel = {
  healthy: 'Healthy',
  'refill-required': 'Refill Required',
  'not-accessible': 'Not Accessible',
  'setup-pending': 'Setup Pending',
}

interface BranchCardProps {
  branch: Branch
  onClick: () => void
}

export function BranchCard({ branch, onClick }: BranchCardProps) {
  return (
    <div onClick={onClick} className="w-full cursor-pointer rounded-xl border bg-white p-4">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          {/* TODO: swap for the Figma station-icon asset */}
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500">🏢</span>
          <div>
            <p className="text-sm font-bold">{branch.name}</p>
            <p className="text-xs text-gray-400">Created {branch.createdDate}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs">
          {branch.percentChange === null || branch.changeDirection === null ? (
            <span className="font-medium text-gray-400">-</span>
          ) : (
            <>
              <span
                className={cn(
                  'flex items-center gap-0.5 font-medium',
                  branch.changeDirection === 'up' ? 'text-green-600' : branch.changeDirection === 'down' ? 'text-red-500' : 'text-gray-400'
                )}
              >
                {branch.changeDirection === 'up' && <ArrowUp className="h-3 w-3" />}
                {branch.changeDirection === 'down' && <ArrowDown className="h-3 w-3" />}
                {Math.abs(branch.percentChange)}%
              </span>
              <span className="text-gray-400">{branch.vsLabel}</span>
            </>
          )}
        </div>
        <span className={cn('rounded-full px-4 py-2 text-xs font-medium', statusStyles[branch.status])}>
          {statusLabel[branch.status]}
        </span>
      </div>
    </div>
  )
}