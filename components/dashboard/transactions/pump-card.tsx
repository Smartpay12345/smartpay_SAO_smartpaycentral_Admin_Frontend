import { MoreVertical } from 'lucide-react'
import { InOut } from '@/components/icons'


interface PumpCardProps {
  name: string
  noOfSales: number
  initial: string
  remaining: string
  percent: number
}

export function PumpCard({ name, noOfSales, initial, remaining, percent }: PumpCardProps) {
  return (
    <div className="rounded-xl border p-4">
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <p className="font-medium">{name}</p>
         <InOut className='text-[#9CA3AF]'/>
        </div>
        <button>
          <MoreVertical className="h-4 w-4 text-gray-400" />
        </button>
      </div>
      <p className="mb-3 text-xs text-gray-400">Initial Record before sales today</p>

      <p className="mb-1 text-sm font-medium">{noOfSales} no of sales</p>
      <div className="h-1.5 w-full rounded-full bg-gray-100">
        <div className="h-1.5 rounded-full bg-green-500" style={{ width: `${Math.min(percent, 100)}%` }} />
      </div>
      <div className="mt-1 flex justify-between text-xs text-gray-400">
        <span>of {initial} Initial</span>
        <span>of {remaining} remaining</span>
      </div>
    </div>
  )
}