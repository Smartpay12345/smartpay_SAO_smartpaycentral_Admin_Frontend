import { ChevronDown } from 'lucide-react'

interface StationRank {
  name: string
  amount: string
  percent: number
}

export function BestSellingStation({ stations }: { stations: StationRank[] }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="font-medium">Best Selling Station</h2>
        <button className="flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-gray-500">
          Q1 <ChevronDown className="h-3 w-3" />
        </button>
      </div>
      <p className="mb-4 text-xs text-gray-400">A statistic of your Top 3 regional sales</p>
      <div className="space-y-4">
        {stations.map((s) => (
          <div key={s.name}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span>{s.name}</span>
              <span className="text-gray-400">{s.amount}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-100">
              <div className="h-1.5 rounded-full bg-orange-500" style={{ width: `${s.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}