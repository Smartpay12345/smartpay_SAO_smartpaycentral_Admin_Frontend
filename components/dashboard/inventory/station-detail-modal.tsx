'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FuelStockCard } from './fuel-stock-card'
import { MiniCalendar } from './mini-calendar'
import type { FuelStock } from '@/lib/types/inventory'
import { Diesel, Liter, Pump, Cooking } from '@/components/icons'

interface StationDetailData {
  name: string
  fuelStocks: FuelStock[]
  todayDate: string
  totalSales: string
  noOfSales: number
  monthTotal: string
}

interface StationDetailModalProps {
  station: StationDetailData | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onManageStation: () => void
  onCheckOrder: () => void
  onViewOverview: () => void
}

const FUEL_ICONS: Record<FuelStock['fuelType'], React.ReactNode> = {
  ago: <Diesel className='h-4 w-4' />,
  dpk: <Liter className='h-4 w-4 text-[#006926]' />,
  pms: <Pump className='h-4 w-4' />,
  lpg: <Cooking className='h-4 w-4' />,
}

export function StationDetailModal({
  station,
  open,
  onOpenChange,
  onManageStation,
  onCheckOrder,
  onViewOverview,
}: StationDetailModalProps) {
  if (!station) return null
  const s = station

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[90vw] gap-0 overflow-hidden p-0 sm:!max-w-2xl">
        <div className="no-scrollbar max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b p-2 bg-[#E6BDB9]">
            <div>
              <h2 className="text-lg font-bold">This Station</h2>
              <p className="text-xs text-gray-400">A statistic of this station inventory</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
            <div className="space-y-4">
              {s.fuelStocks.map((f) => (
                <FuelStockCard key={f.label} stock={f} icon={FUEL_ICONS[f.fuelType]} />
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <Button onClick={onManageStation} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Station Management
                </Button>
                <Button onClick={onCheckOrder} className="flex-1">Check Order</Button>
              </div>

            <div>
  <p className="mb-2 text-sm font-medium">Today</p>
  
  
  <div className="relative flex items-center justify-between gap-3 p-4 pl-6">
 
    <div className="absolute bottom-3 left-3 top-3 w-1.5 rounded-full bg-red-500 p-0 -ml-2" />

    {/* Date */}
    <div>
      <p className="text-4xl text-[#EA6B6B] font-bold leading-none">{s.todayDate.split(' ')[0]}</p>
      <p className="text-xs font-semibold text-[#EA6B6B]">{s.todayDate.split(' ')[1]}</p>
    </div>

    {/* Sales Info */}
    <div className="ml-2">
      <p className="text-xs font-medium text-red-500">Total Sales</p>
      <p className="font-semibold">{s.totalSales}</p>
      <p className="text-xs font-bold">
        No. of sales : <span className="font-semibold text-primary">{s.noOfSales}</span>
      </p>
    </div>

    {/* Arrow Button */}
    <button onClick={onViewOverview} className="text-gray-400">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </button>
  </div>

  <p className="mt-2 text-center text-xs text-green-600">↗ ₦{s.monthTotal} This Month So Far</p>
</div>



              <MiniCalendar initialMonth={7} initialYear={2026} highlightDay={24} />
            </div>
          </div>

          <div className="border-t bg-red-50/40 px-5 py-3 text-center">
            <p className="text-xs text-gray-400">Powered by smartpay</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}