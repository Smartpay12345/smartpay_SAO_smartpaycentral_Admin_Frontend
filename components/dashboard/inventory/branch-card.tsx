'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Branch } from '@/lib/types/inventory'
import { cn } from '@/lib/utils'
import { ArrowUp, ArrowDown } from '@/components/icons'

const statusStyles = {
  healthy: 'bg-green-50 text-green-600',
  'refill-required': 'bg-orange-50 text-orange-600',
  'not-accessible': 'bg-red-50 text-red-600',
}

const statusLabel = {
  healthy: 'Healthy',
  'refill-required': 'Refill Required',
  'not-accessible': 'Not Accessible',
}

interface BranchCardProps {
  branch: Branch
  onClick: () => void
}

export function BranchCard({ branch, onClick }: BranchCardProps) {
  const isPositive = branch.percentChange >= 1

  return (
    <div
      onClick={onClick}
      className="w-full cursor-pointer rounded-xl border bg-white p-4"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          {/* TODO: swap for the Figma station-icon asset */}
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500">🏢</span>
          <div>
            <p className="text-sm font-medium">{branch.name}</p>
            <p className="text-xs text-gray-400">Created {branch.createdDate}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button onClick={(e) => e.stopPropagation()} className="text-gray-400">
                ⋯
              </button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit Branch</DropdownMenuItem>
            <DropdownMenuItem>Deactivate</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
   <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs">
          <span className={cn('flex items-center gap-0.5 font-medium', isPositive ? 'text-green-600' : 'text-red-500')}>
            {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {Math.abs(branch.percentChange)}%
          </span>
          <span className="text-gray-400">vs last month</span>
        </div>
        <span className={cn('rounded-full px-4 py-2 text-xs font-medium', statusStyles[branch.status])}>
          {statusLabel[branch.status]}
        </span>
      </div>
    </div>
  )
}