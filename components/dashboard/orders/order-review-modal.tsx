// components/dashboard/orders/order-review-modal.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { ordersStore } from '@/lib/store/orders-store'
import type { FuelOrder } from '@/lib/types/order'
import { BackButton } from '@/components/back-button'
import { Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OrderReviewModalProps {
  order: FuelOrder | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderReviewModal({ order, open, onOpenChange }: OrderReviewModalProps) {
  const router = useRouter()
  const [accepting, setAccepting] = useState(false)

  if (!order) return null
  const o = order

  async function handleAccept() {
    setAccepting(true)
    // placeholder — real version is a Supabase edge function that inserts
    // into `orders` and removes from `order_requests` in one transaction
    await new Promise((r) => setTimeout(r, 700))
    ordersStore.acceptOrder(o.id)
    toast.success(`${o.id} accepted — now showing in Fuel Orders Management`)
    setAccepting(false)
    onOpenChange(false)
    router.push('/dashboard/manage-orders')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[90vw] gap-0 overflow-hidden p-0 sm:!max-w-xl">
        <div className="no-scrollbar max-h-[95vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b p-5 py-3">
            <h2 className="text-lg font-semibold">Fuel Order Request</h2>
          </div>

          <div className="space-y-4 p-5">
            <div className="flex justify-end gap-3">
              <BackButton/>
              <Button onClick={handleAccept} disabled={accepting} className="bg-red-600 hover:bg-red-700">
                {accepting ? 'Accepting...' : 'Accept Order'}
              </Button>
            </div>

            <div className="rounded-xl border p-4 shadow">
              <p className="mb-3 flex items-center gap-2 text-sm font-medium">
              <Info className='h-3 w-3' /> Order Information
              </p>
              <div className="space-y-2 text-sm">
                <Row label="Product Type" value={o.productFullName} />
                <Row label="Date Requested" value={o.dateRequested} />
                <Row label="Expected Delivery" value={o.expectedDelivery} showBorder={false} />
                <Row label="Order ID" value={o.id} showBorder={false} />
              </div>
            </div>

            <div className="rounded-xl border border-[#FCDBD8] shadow p-4">
              <p className="mb-3 flex items-center gap-2 text-sm font-medium">
                <span>▤</span> Financial Details
              </p>
              <div className="space-y-2 text-sm">
                <Row label="Requested Liters" value={o.requestedLiters} />
                <Row label="Unit Price" value={o.unitPrice} />
                <div className="flex items-center justify-between pt-2">
                  <span className="font-medium">Total Value</span>
                  <span className="text-lg font-bold text-primary">{o.totalValue}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border p-4">
              <p className="mb-3 flex items-center gap-2 text-sm font-medium">
                <span>⇄</span> Logistics Route
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex-1 rounded-lg border p-3">
                  <p className="text-xs text-gray-400">Assigned Personnel</p>
                  <div className="mt-1 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Station Manager</p>
                      <p className="text-sm font-medium">{o.managerName}</p>
                    </div>
                    <span className="text-primary">📞</span>
                  </div>
                </div>
                <div className="rounded-lg bg-red-50 p-3 sm:flex-1">
                  <p className="text-xs text-gray-400">Destination Station</p>
                  <p className="text-sm font-medium text-primary">{o.station}</p>
                  <p className="text-xs text-gray-400">{o.stationCode} · {o.stationState}</p>
                </div>
              </div>
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

interface RowProps {
  label: string
  value: string
  showBorder?: boolean // Optional prop to control the border
}

function Row({ label, value, showBorder = true }: RowProps) {
  return (
    <div className={cn(
      "flex items-center justify-between py-0.5", 
      showBorder && "border-b border-[#FCDBD8]" // Only applies border if true
    )}>
      <span className="text-gray-400">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}