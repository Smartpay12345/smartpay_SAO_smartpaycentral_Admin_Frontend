import { cn } from '@/lib/utils'

interface StationProgressBarProps {
  label: string
  sold: string
  capacity: string
  percent: number
}

export function StationProgressBar({ label, sold, capacity, percent }: StationProgressBarProps) {
  const color = percent >= 80 ? 'bg-red-500' : percent >= 50 ? 'bg-orange-500' : 'bg-green-500'

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium">{sold} sold</span>
        <span className="text-gray-400">{capacity}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-gray-100">
        <div className={cn('h-1.5 rounded-full', color)} style={{ width: `${Math.min(percent, 100)}%` }} />
      </div>
      <p className="mt-1 text-xs text-gray-500">{label}</p>
    </div>
  )
}