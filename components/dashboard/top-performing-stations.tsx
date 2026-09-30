import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Station {
  name: string
  sales: string
  liters: string
  txn: number
}

export function TopPerformingStations({ stations }: { stations: Station[] }) {
  return (
    <div className="flex flex-col rounded-xl border bg-white px-4 py-2">
      <div className="mb-3 flex items-center justify-between">
      <h2 className="text-[13px] font-[750] leading-[24px] text-foreground text-[#111827]">
  Top Performing Stations
</h2>
        <button className="flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-gray-500">
          This Week <ChevronDown className="h-3 w-3" />
        </button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-gray-400">
            <th className="pb-2 font-normal">STATION</th>
            <th className="pb-2 font-normal">SALES (₦)</th>
            <th className="pb-2 font-normal">LITERS SOLD</th>
            <th className="pb-2 font-normal">TXN</th>
          </tr>
        </thead>
        <tbody>
          {stations.map((s) => (
            <tr key={s.name} className="border-t text-[#111827]">
              <td className="py-2 font-medium">{s.name}</td>
              <td className="py-2 text-[#1F2937] font-[450] text-[14px] font-medium">{s.sales}</td>
              <td className="py-2 text-[14px] font-[400] leading-[20px] text-[#4B5563]">{s.liters}</td>
              <td className="py-2 text-[14px] font-[300] leading-[40px] text-[#4B5563]">{s.txn}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button variant="outline" className="mt-4 w-full text-[#E50019]">
        View All Stations
      </Button>
    </div>
  )
}