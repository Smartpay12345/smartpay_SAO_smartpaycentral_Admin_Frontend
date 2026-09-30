'use client'

import { useRef, useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { useReceiptExport } from '@/hooks/use-receipt-export'
import { ReceiptFooter } from '@/components/dashboard/receipt-footer'
import { StationProgressBar } from './station-progress-bar'
import { PumpCard } from './pump-card'

interface Product {
  label: string
  sold: string
  capacity: string
  percent: number
}

interface Pump {
  name: string
  noOfSales: number
  initial: string
  remaining: string
  percent: number
}

interface StationDetail {
  id: string
  location: string
  managerName: string
  products: Product[]
  pumps: Pump[]
}

interface StationDetailModalProps {
  station: StationDetail | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PAGE_SIZE = 4

export function StationDetailModal({ station, open, onOpenChange }: StationDetailModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(0)

  const { handleDownload, handleShare, downloading, sharing } = useReceiptExport(
    receiptRef,
    station ? `station-${station.id}` : 'station'
  )
  if (!station) return null

  const s = station

  const totalPages = Math.ceil(s.products.length / PAGE_SIZE)
  const visibleProducts = s.products.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="!max-w-[90vw] gap-0 overflow-hidden p-0 sm:!max-w-xl lg:!max-w-3xl"
      >
        <div className="no-scrollbar max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b p-5">
            <h2 className="text-base font-semibold sm:text-lg">{s.id}, {s.location}</h2>
            <button onClick={() => onOpenChange(false)} className="shrink-0 rounded-full p-1 hover:bg-gray-100">
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          <div ref={receiptRef} className="bg-white">
            <div className="flex items-center justify-end gap-2 px-5 pt-4">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 font-medium text-primary">
                  {s.managerName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="font-semibold text-[#11182]">Manager</p>
                <p className="text-medium text-[#6B7280]">{s.managerName}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
              {/* left: station inventory */}
              <div className="rounded-xl border p-4">
                <div className="mb-1 flex items-center justify-between">
                  <p className="font-semibold">This Station</p>
                  <button className="rounded-md border px-2 py-0.5 text-xs text-gray-500">All</button>
                </div>
                <p className="mb-4 text-xs text-gray-400">A statistic of this station inventory</p>

                <div className="space-y-4">
                  {visibleProducts.map((p) => (
                    <StationProgressBar key={p.label} {...p} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <button
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="flex items-center gap-1 text-gray-500 disabled:opacity-40"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" /> Back
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={page === totalPages - 1}
                      className="flex items-center gap-1 text-primary disabled:opacity-40"
                    >
                      Next <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* right: pump cards */}
              <div className="space-y-4">
                {s.pumps.map((pump, i) => (
                  <PumpCard key={i} {...pump} />
                ))}
              </div>
            </div>
          </div>

          <ReceiptFooter onShare={handleShare} onDownload={handleDownload} sharing={sharing} downloading={downloading} />
        </div>
      </DialogContent>
    </Dialog>
  )
}