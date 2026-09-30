// app/dashboard/manage-orders/[id]/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button, buttonVariants } from '@/components/ui/button'
import { useOrder, ordersStore } from '@/lib/store/orders-store'
import { UpdateStatusModal } from '@/components/dashboard/orders/update-status-modal'
import { LogisticsRouteCard } from '@/components/dashboard/orders/logistics-route-card'
import { OrderTrackingTimeline } from '@/components/dashboard/orders/order-tracking-timeline'
import { cn } from '@/lib/utils'
import { ArrowLeft, Download, Pencil, Truck, Info, Users, Phone, User } from 'lucide-react'

export default function OrderDetailsPage() {
  const params = useParams<{ id: string }>()
  const orderId = decodeURIComponent(params.id)
  const order = useOrder(orderId)
  const [statusModalOpen, setStatusModalOpen] = useState(false)

  if (!order) {
    return <div className="rounded-xl border bg-white p-8 text-center text-gray-500">Order not found.</div>
  }

  const statusBannerColor =
    order.status === 'in-transit' || order.status === 'fulfilled'
      ? 'border-green-200 bg-green-50 text-green-600'
      : order.status === 'cancelled'
        ? 'border-red-200 bg-red-50 text-red-600'
        : 'border-orange-200 bg-orange-50 text-orange-600'

  const doneSteps = order.tracking?.filter((t) => t.done) ?? []
  const lastUpdate = doneSteps[doneSteps.length - 1]?.date.replace(' (Last update)', '') ?? '—'

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Order Details</h1>
          <p className="text-sm text-gray-500">{order.id}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/manage-orders" className={cn(buttonVariants({ variant: 'outline' }))}>
            <ArrowLeft className='text-primary'/>Back
          </Link>
          <button className={cn(buttonVariants({ variant: 'outline' }))}><Download/> Download Invoice</button>
          <Button onClick={() => setStatusModalOpen(true)}><Pencil/> Update Status</Button>
        </div>
      </div>

      <div className={cn('flex items-center justify-between gap-4 rounded-xl border p-4', statusBannerColor)}>
        <div className="flex items-center  gap-3">
          <Truck />
          <div>
            <p className="text-xs">Current Status</p>
            <p className="font-semibold capitalize">{order.status.replace('-', ' ')}</p>
          </div>
        </div>
        <p className="text-right text-xs">
          Last updated
          <br />
          {lastUpdate}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border bg-white p-5">
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <Info/> Order Information
            </p>
            <div className="divide-y divide-red-100">
              <DetailRow label="Product Type" value={order.productFullName} />
              <DetailRow label="Date Requested" value={order.dateRequested} />
              <DetailRow label="Expected Delivery" value={order.expectedDelivery} />
            </div>
          </div>

          <div className="rounded-xl border border-red-200 bg-white p-5">
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <span>▤</span> Financial Details
            </p>
            <div className="divide-y divide-red-100">
              <DetailRow label="Requested Liters" value={order.requestedLiters} />
              <DetailRow label="Unit Price" value={order.unitPrice} />
              <div className="flex items-center justify-between pt-3">
                <span className="text-sm font-semibold">Total Value</span>
                <span className="text-xl font-bold text-primary sm:text-2xl">{order.totalValue}</span>
              </div>
            </div>
          </div>

          <LogisticsRouteCard order={order} />
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border bg-white p-5">
            <p className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <Users className='h-3.5 text-[#6B7280] w-3.5' /> Assigned Personnel
            </p>
            <div className="flex items-center justify-between border-b border-red-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFE9E7]
                "><User className='h-5 w-5 text-[#6B7280] ' /></span>
                <div>
                  <p className="text-xs text-gray-400">Station Manager</p>
                  <p className="text-sm font-semibold">{order.managerName}</p>
                </div>
              </div>
              <a href={`tel:${order.managerPhone.replace(/\s/g, '')}`} className="text-primary">
                <Phone/>
              </a>
            </div>
          </div>

          {order.tracking && (
            <div className="rounded-xl border bg-white p-5">
              <p className="mb-4 flex items-center gap-2 text-sm font-semibold">
                <span>⌁</span> Order Tracking
              </p>
              <OrderTrackingTimeline steps={order.tracking} />
            </div>
          )}
        </div>
      </div>

      <UpdateStatusModal
        open={statusModalOpen}
        onOpenChange={setStatusModalOpen}
        currentStatus={order.status}
        onUpdate={(status) => ordersStore.updateOrderStatus(order.id, status)}
      />
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  )
}