'use client'

import { useState } from 'react'
import { Pagination } from '@/components/dashboard/pagination'
import { OrderReviewModal } from '@/components/dashboard/orders/order-review-modal'
import { usePendingRequests } from '@/lib/store/orders-store'
import type { FuelOrder } from '@/lib/types/order'
import { BackButton } from '@/components/back-button'
import { Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export default function NewOrderPage() {
  const pendingRequests = usePendingRequests()
  const [selected, setSelected] = useState<FuelOrder | null>(null)
  const [page, setPage] = useState(1)

  return (
    <div className="space-y-6">
      <div className='flex justify-between'>
        <div>
        <h1 className="text-xl font-semibold">New Order</h1>
        <p className="text-sm text-gray-500">{pendingRequests.length} list order</p>

        </div>
        <div className='flex gap-4'>
        <BackButton/>
        <button className={cn(buttonVariants({ variant: 'outline' }))}><Download/> Download Invoice</button>

        </div>
      </div>

      <div className="rounded-xl border bg-white p-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="text-left text-xs text-[#5D3F3D]">
                <th className="py-2 font-normal">ORDER ID</th>
                <th className="py-2 font-normal">STATION</th>
                <th className="py-2 font-normal">DATE</th>
                <th className="py-2 font-normal">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.map((req, i) => (
                <tr key={`${req.id}-${i}`} className="">
                  <td className="py-3 font-medium text-[#291716]">{req.id}</td>
                  <td className="py-3 tesxt-[#291716]">{req.station}</td>
                  <td className="py-3 text-[#5D3F3D]">{req.date}</td>
                  <td className="py-3">
                    <button 
  onClick={() => setSelected(req)} 
  className="font-medium text-[#5D3F3D] hover:text-primary hover:underline transition-colors"
>
  Check
</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <Pagination currentPage={page} totalPages={3} totalItems={pendingRequests.length} itemsPerPage={5} onPageChange={setPage} />
        </div>
      </div>

      <OrderReviewModal
        key={selected?.id ?? 'none'}
        order={selected}
        open={selected !== null}
        onOpenChange={(o) => !o && setSelected(null)}
      />
    </div>
  )
}