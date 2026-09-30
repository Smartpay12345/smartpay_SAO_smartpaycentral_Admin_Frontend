// components/dashboard/orders/logistics-route-card.tsx
import type { FuelOrder } from '@/lib/types/order'
import { Route } from 'lucide-react'
export function LogisticsRouteCard({ order }: { order: FuelOrder }) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <p className="mb-4 flex items-center gap-2 text-sm font-semibold">
        <Route className='h-3.5 w-3.5 text-[#6B7280] rotate-90' /> Logistics Route
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-6">
        <div className="flex flex-1 flex-col justify-center">
          <p className="text-sm text-gray-500">Origin Source</p>
          <p className="mt-1 text-sm font-semibold">{order.originSource}</p>
          <p className="text-sm text-gray-500">{order.originAddress}</p>
        </div>

        {/* mobile: short vertical line between the stacked blocks */}
        <span className="mx-auto h-6 w-px bg-red-200 sm:hidden" />

        {/* sm+: dot, line, pin between the side-by-side blocks */}
        <div className="hidden flex-col items-center py-1 sm:flex">
          <span className="h-2 w-2 rounded-full bg-red-200" />
          <span className="my-1 w-px flex-1 bg-red-200" />
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none" className="text-primary">
            <path
              d="M8 1C4.7 1 2 3.6 2 6.9c0 4.4 6 11.6 6 11.6s6-7.2 6-11.6C14 3.6 11.3 1 8 1z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle cx="8" cy="7" r="2" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="flex-1 rounded-lg bg-red-50 p-4">
          <p className="text-sm text-gray-500">Destination Station</p>
          <p className="mt-1 text-sm font-semibold text-primary">{order.station}</p>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span className="rounded border bg-white px-1.5 py-0.5 text-gray-600">{order.stationCode}</span>
            {order.stationState}
          </p>
        </div>
      </div>
    </div>
  )
}