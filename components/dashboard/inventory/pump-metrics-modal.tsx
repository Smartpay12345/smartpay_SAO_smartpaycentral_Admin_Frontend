// components/dashboard/inventory/pump-metrics-modal.tsx
'use client'

import { useRef, useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useReceiptExport } from '@/hooks/use-receipt-export'
import { ReceiptFooter } from '@/components/dashboard/receipt-footer'
import { RedPump } from '@/components/icons'
import { AsyncPanel, type PanelState } from '@/lib/dashboard/async-panel'
import { monthShort, shiftMonth } from '@/lib/utils/date'

const PUMPS_PER_PAGE = 4

interface Pump {
  name: string
  status: string
  opening: number | null
  closing: number | null
  dispensed: number | null
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
  state: PanelState<PumpMetricsData>
  date: string // the day shown (YYYY-MM-DD)
  maxDate: string // latest pickable day (today, Lagos time)
  onDateChange: (date: string) => void
  open: boolean
  onOpenChange: (open: boolean) => void
  onBack: () => void
}

const num = (n: number | null) => (n == null ? '-' : n.toLocaleString())

export function PumpMetricsModal({ state, date, maxDate, onDateChange, open, onOpenChange, onBack }: PumpMetricsModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null)
  const [pumpPage, setPumpPage] = useState(0)
  const { handleDownload, handleShare, downloading, sharing } = useReceiptExport(
    receiptRef,
    state.data ? `pump-metrics-${state.data.stationId}` : 'pump-metrics'
  )

  const atLatestMonth = date.slice(0, 7) >= maxDate.slice(0, 7)

  function changeMonth(delta: number) {
    setPumpPage(0)
    onDateChange(shiftMonth(date, delta, maxDate))
  }

  function handleOpenChange(next: boolean) {
    if (!next) setPumpPage(0)
    onOpenChange(next)
  }

  function handleBack() {
    setPumpPage(0)
    onBack()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="!max-w-[90vw] gap-0 overflow-hidden p-0 sm:!max-w-2xl lg:!max-w-5xl">
        <div className="no-scrollbar max-h-[95vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b p-5 py-2 bg-[#E6BDB9]">
            <h2 className="text-lg font-semibold">Overview</h2>
          </div>

          <div ref={receiptRef} className="bg-white p-5">
            <AsyncPanel state={state} height="h-80">
              {(d) => {
                const pageCount = Math.max(1, Math.ceil(d.pumps.length / PUMPS_PER_PAGE))
                const page = Math.min(pumpPage, pageCount - 1)
                const visible = d.pumps.slice(page * PUMPS_PER_PAGE, (page + 1) * PUMPS_PER_PAGE)

                return (
                  <>
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

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-1 lg:grid-cols-2 mt-4">
                      {/* LEFT column */}
                      <div className="space-y-4">
                        <div className="rounded-xl border p-4 text-center">
                          <p className="text-xs uppercase tracking-wide text-gray-400">Total Amount Sales</p>
                          <p className="text-xl font-bold text-primary">{d.totalAmountSales}</p>
                        </div>

                        <div className="rounded-xl border p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <p className="text-sm font-medium">Expenses Details ({d.expenseMonth})</p>
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <button type="button" onClick={() => changeMonth(-1)} className="text-primary">▲</button>
                              {monthShort(date)}
                              <button
                                type="button"
                                onClick={() => changeMonth(1)}
                                disabled={atLatestMonth}
                                className="text-primary disabled:opacity-30"
                              >
                                ▼
                              </button>
                            </div>
                          </div>
                          <div className="space-y-3">
                            {d.expenses.length === 0 && (
                              <p className="py-4 text-center text-xs text-gray-400">No sales on this day.</p>
                            )}
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

                      {/* RIGHT column: Pump Metrics */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <RedPump />
                            <span className="font-medium">Pump Metrics</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button type="button" onClick={handleBack} className="flex items-center gap-1 text-gray-500">← Back</button>
                            {pageCount > 1 && (
                              <button
                                type="button"
                                onClick={() => setPumpPage((page + 1) % pageCount)}
                                className="flex items-center gap-1 text-primary"
                              >
                                Next →
                              </button>
                            )}
                          </div>
                        </div>

                        {d.pumps.length === 0 && (
                          <p className="py-6 text-center text-xs text-gray-400">No pumps for this station.</p>
                        )}

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {visible.map((p, i) => (
                            <div key={`${p.name}-${page}-${i}`} className="rounded-xl border p-4 py-2">
                              <div className="mb-1 flex items-center justify-between border-b py-2">
                                <p className="font-medium">{p.name}</p>
                                <span
                                  className={
                                    p.status === 'Active'
                                      ? 'rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-600'
                                      : 'rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500'
                                  }
                                >
                                  {p.status}
                                </span>
                              </div>
                              <div className="mb-2 flex justify-between text-xs text-gray-400">
                                <span>Opening (L)</span>
                                <span>Closing (L)</span>
                              </div>
                              <div className="mb-8 flex justify-between text-sm font-medium">
                                <span>{num(p.opening)}</span>
                                <span>{num(p.closing)}</span>
                              </div>
                              <p className="text-xs text-gray-400 mb-2">
                                Volume Dispensed{' '}
                                <span className="font-medium text-red-500 ml-8">
                                  {p.dispensed == null ? '-' : `${p.dispensed.toLocaleString()} L`}
                                </span>
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )
              }}
            </AsyncPanel>
          </div>

          {state.data && (
            <ReceiptFooter onShare={handleShare} onDownload={handleDownload} sharing={sharing} downloading={downloading} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}