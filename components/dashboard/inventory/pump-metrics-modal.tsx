// components/dashboard/inventory/pump-metrics-modal.tsx
'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useReceiptExport } from '@/hooks/use-receipt-export'
import { ReceiptFooter } from '@/components/dashboard/receipt-footer'
import { useRef, useState } from 'react'
import { RedPump } from '@/components/icons'

interface Pump {
    name: string
    status: string
    opening: number
    closing: number
    dispensed: number
}

interface ExpenseLine {
    product: string
    amount: string
    liters: string
    buyer: number
}

interface PumpMetricsData {
    stationId: string
    location: string
    totalAmountSales: string
    expenseMonth: string
    expenses: ExpenseLine[]
    pumps: Pump[]
}

interface PumpMetricsModalProps {
    data: PumpMetricsData | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onBack: () => void
}

export function PumpMetricsModal({ data, open, onOpenChange, onBack }: PumpMetricsModalProps) {
    const receiptRef = useRef<HTMLDivElement>(null)
    const [monthOffset, setMonthOffset] = useState(0)
    const { handleDownload, handleShare, downloading, sharing } = useReceiptExport(
        receiptRef,
        data ? `pump-metrics-${data.stationId}` : 'pump-metrics'
    )


    const baseMonth = new Date(2026, 7) // August 2026, matching your Figma's data
    const displayedMonth = new Date(baseMonth.getFullYear(), baseMonth.getMonth() + monthOffset)
    const monthLabel = displayedMonth.toLocaleString('default', { month: 'short' })

    if (!data) return null
    const d = data

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>

            <DialogContent className="!max-w-[90vw] gap-0 overflow-hidden p-0 sm:!max-w-2xl lg:!max-w-5xl">
                <div className="no-scrollbar max-h-[95vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b p-5 py-2 bg-[#E6BDB9]">
                        <h2 className="text-lg font-semibold">Overview</h2>

                    </div>


                    <div ref={receiptRef} className="bg-white p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">This Station</p>
                                <p className="text-xs text-gray-400">A statistic of this station inventory</p>
                            </div>
                            <div className="text-right text-xs text-gray-400">
                                <p>Station ID : {d.stationId}</p>
                                <p>{d.location}</p>
                            </div>

                        </div>
                   
<div className="grid grid-cols-1 gap-5 sm:grid-cols-1 lg:grid-cols-2  mt-4">
  {/* LEFT column — unchanged */}
  <div className="space-y-4">
    <div className="rounded-xl border p-4 text-center">
      <p className="text-xs uppercase tracking-wide text-gray-400">Total Amount Sales</p>
      <p className="text-xl font-bold text-primary">{d.totalAmountSales}</p>
    </div>

    <div className="rounded-xl border p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium">Expenses Details ({d.expenseMonth})</p>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <button onClick={() => setMonthOffset((o) => o - 1)} className="text-primary">▲</button>
          {monthLabel}
          <button onClick={() => setMonthOffset((o) => o + 1)} className="text-primary">▼</button>
        </div>
      </div>
      <div className="space-y-3">
        {d.expenses.map((e) => (
          <div key={e.product} className="flex items-center justify-between text-sm">
            <div>
              <p className="font-medium text-primary">{e.product}</p>
              <p className="text-xs text-gray-400">{e.liters}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">{e.amount}</p>
              <p className="text-xs text-gray-400">Buyer: {e.buyer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* RIGHT column — Pump Metrics header now lives here, above the pump grid */}
  <div className="space-y-4">
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <RedPump />
        <span className="font-medium">Pump Metrics</span>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="flex items-center gap-1 text-gray-500">← Back</button>
        <button className="flex items-center gap-1 text-primary">Next →</button>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 ">
      {d.pumps.map((p, i) => (
        <div key={i} className="rounded-xl border p-4 py-2">
          <div className="mb-1 flex items-center justify-between  border-b py-2">
            <p className="font-medium">{p.name}</p>
            <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-600">{p.status}</span>
          </div>
          <div className="mb-2 flex justify-between text-xs text-gray-400">
            <span>Opening (L)</span>
            <span>Closing (L)</span>
          </div>
          <div className="mb-8 flex justify-between text-sm font-medium">
            <span>{p.opening.toLocaleString()}</span>
            <span>{p.closing.toLocaleString()}</span>
          </div>
          <p className="text-xs text-gray-400 mb-2">
            Volume Dispensed <span className="font-medium text-red-500 ml-8">{p.dispensed.toLocaleString()} L</span>
          </p>
        </div>
      ))}
    </div>
  </div>
</div>
                    </div>

                    <ReceiptFooter onShare={handleShare} onDownload={handleDownload} sharing={sharing} downloading={downloading} />
                </div>
            </DialogContent>
        </Dialog>
    )
}