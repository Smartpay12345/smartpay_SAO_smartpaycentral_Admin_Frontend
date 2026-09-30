// app/dashboard/manage-orders/page.tsx
'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/dashboard/stat-card'
import { FilterDropdown } from '@/components/dashboard/filter-dropdown'
import { ExportButton } from '@/components/shared/export-button'
import { Pagination } from '@/components/dashboard/pagination'
import { OrderStatusBadge } from '@/components/dashboard/orders/order-status-badge'
import { ProductChip } from '@/components/dashboard/orders/product-chip'
import { useOrders } from '@/lib/store/orders-store'
import type { ExportColumn } from '@/lib/export'
import type { FuelOrder, OrderStatus } from '@/lib/types/order'
import { Orders, Bt, Success, Rt, Icon, Suspended } from '@/components/icons'

const tabs: { key: 'all' | OrderStatus; label: string }[] = [
  { key: 'all', label: 'All Orders' },
  { key: 'pending', label: 'Pending' },
  { key: 'in-transit', label: 'In transit' },
  { key: 'fulfilled', label: 'Fulfilled' },
]

const exportColumns: ExportColumn<FuelOrder>[] = [
  { key: 'id', header: 'Order ID' },
  { key: 'station', header: 'Station' },
  { key: 'product', header: 'Product' },
  { key: 'quantity', header: 'Quantity' },
  { key: 'status', header: 'Status' },
]

export default function ManageOrdersPage() {
  const router = useRouter()
  const orders = useOrders()
  const [tab, setTab] = useState<'all' | OrderStatus>('all')
  const [search, setSearch] = useState('')
  const [productFilter, setProductFilter] = useState('All Products')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesTab = tab === 'all' || o.status === tab
      const matchesProduct = productFilter === 'All Products' || o.product === productFilter
      const matchesSearch =
        search.trim() === '' ||
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.station.toLowerCase().includes(search.toLowerCase())
      return matchesTab && matchesProduct && matchesSearch
    })
  }, [orders, tab, productFilter, search])

  const pendingCount = orders.filter((o) => o.status === 'pending').length
  const fulfilledCount = orders.filter((o) => o.status === 'fulfilled').length
  const inTransitCount = orders.filter((o) => o.status === 'in-transit').length
  const cancelledCount = orders.filter((o) => o.status === 'cancelled').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Fuel Orders Management</h1>
          <p className="mt-1 flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-red-500" /> {pendingCount} Open</span>
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-green-500" /> {fulfilledCount} Closed (This Month)</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <FilterDropdown icon={<Icon/>}  options={['All Filters', 'By Station', 'By Product']} value="Filters" onChange={() => {}} />
          <ExportButton data={orders} columns={exportColumns} filename="fuel-orders" title="Fuel Orders Report" />
          <Button onClick={() => router.push('/dashboard/manage-orders/new')} className="bg-white text-primary border-red hover:bg-red-100">
            <Rt/> New Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Orders/>} iconBgColor="bg-[#FFDAD680]" label="Pending Orders" value={String(pendingCount)} iconPosition='right' />
        <StatCard icon={<Success/>} iconBgColor="bg-green-50" label="Fulfilled (This Month)" value={String(fulfilledCount)} iconPosition='right' />
        <StatCard icon={<Bt/>} iconBgColor="bg-blue-50" label="In Transit" value={String(inTransitCount)} iconPosition='right' />
        <StatCard icon={<Suspended/>} iconBgColor="bg-[#FFDAD680]" label="Cancelled" value={String(cancelledCount)} valueColor="text-red-500" iconPosition='right' />
      </div>

      <div className="rounded-xl border bg-white p-4">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-6 overflow-x-auto border-b text-sm lg:border-b-0">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={
                  tab === t.key
                    ? 'shrink-0 whitespace-nowrap border-b-2 border-primary pb-2 font-medium text-primary'
                    : 'shrink-0 whitespace-nowrap pb-2 text-gray-400'
                }
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order ID or Station..."
              className="w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm outline-none sm:w-64"
            />
            <FilterDropdown options={['All Products', 'PMS', 'AGO', 'DPK', 'LPG']} value={productFilter} onChange={setProductFilter} />
          </div>
        </div>

<div className="overflow-hidden rounded-xl border border-border bg-card">
  <div className="overflow-x-auto">
    <table className="w-full min-w-[900px] text-sm">
      <thead>
        <tr className="text-left text-xs font-medium text-[#5D3F3D] bg-[#E6BDB9]">
          <th className="py-3.5 px-4 font-semibold whitespace-nowrap">ORDER ID</th>
          <th className="py-3.5 px-4 font-semibold whitespace-nowrap">STATION</th>
          <th className="py-3.5 px-4 font-semibold whitespace-nowrap">PRODUCT</th>
          <th className="py-3.5 px-4 font-semibold whitespace-nowrap">QUANTITY</th>
          <th className="py-3.5 px-4 font-semibold whitespace-nowrap">DATE</th>
          <th className="py-3.5 px-4 font-semibold whitespace-nowrap">STATUS</th>
          <th className="py-3.5 px-4 font-semibold whitespace-nowrap text-right">ACTIONS</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {filtered.map((o, i) => (
          <tr key={`${o.id}-${i}`} className="border-b border-[#E6BDB9] transition-colors hover:bg-muted/50">
            <td className="py-4 px-4 font-medium whitespace-nowrap">{o.id}</td>
            <td className="py-4 px-4 whitespace-nowrap">{o.station}</td>
            <td className="py-4 px-4 whitespace-nowrap"><ProductChip product={o.product} /></td>
            <td className="py-4 px-4 whitespace-nowrap">{o.quantity} {o.unit}</td>
            <td className="py-4 px-4 text-gray-500 whitespace-nowrap">{o.date}</td>
            <td className="py-4 px-4 whitespace-nowrap"><OrderStatusBadge status={o.status} /></td>
            <td className="py-4 px-4 whitespace-nowrap text-right">
              <button
                onClick={() => router.push(`/dashboard/manage-orders/${encodeURIComponent(o.id)}`)}
                className="font-medium text-[#5D3F3D] hover:underline"
              >
                Learn more
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

        <div className="mt-4">
          <Pagination currentPage={page} totalPages={20} totalItems={97} itemsPerPage={5} onPageChange={setPage} />
        </div>
      </div>
    </div>
  )
}