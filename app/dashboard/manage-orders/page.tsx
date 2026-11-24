'use client'

import { useState } from 'react'
import { Search, ChevronDown, ChevronRight, Info, CreditCard, Route, ChevronUp } from 'lucide-react'
import { StatCard } from '@/components/dashboard/stat-card'
import { FilterDropdown } from '@/components/dashboard/filter-dropdown'
import { ExportButton } from '@/components/shared/export-button'
import { Orders, Bt, Success, Suspended } from '@/components/icons'
import { OrderStatusChip } from '@/components/dashboard/orders/order-status-chip'
import { OrderTrackingTimeline } from '@/components/dashboard/orders/order-tracking-timeline'
import { AsyncPanel } from '@/lib/dashboard/async-panel'
import { useEndpoint, useDebouncedValue, useInfiniteEndpoint } from '@/hooks/use-endpoint'
import { ordersApi } from '@/lib/dashboard/orders-api'
import { withHasMore } from '@/lib/dashboard/paging'
import { formatNumber } from '@/lib/dashboard/format'
import { formatCurrencyFull } from '@/lib/utils/format'
import { formatJoined } from '@/lib/utils/date'
import { cn } from '@/lib/utils'
import type { ExportColumn } from '@/lib/export'
import type { OrderStatus as ChipStatus } from '@/lib/types/order'
import type { ApiOrderStatus, OrderListItem, OrderTab } from '@/lib/dashboard/orders-types'
import { FiltersDialog, type FilterField, type FilterValues } from '@/components/dashboard/filters-dialog'
import { useStationFilterOptions } from '@/hooks/use-station-filter-options'

const TABS: { key: OrderTab; label: string }[] = [
  { key: 'all', label: 'All Orders' },
  { key: 'pending', label: 'Pending' },
  { key: 'in_transit', label: 'In transit' },
  { key: 'fulfilled', label: 'Fulfilled' },
]

const PERIOD_CHOICES = [
  { value: '', label: 'All time' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last_7_days', label: 'Last 7 days' },
  { value: 'last_30_days', label: 'Last 30 days' },
  { value: 'this_week', label: 'This week' },
  { value: 'last_week', label: 'Last week' },
  { value: 'this_month', label: 'This month' },
  { value: 'last_month', label: 'Last month' },
  { value: 'this_year', label: 'This year' },
]

const PRODUCTS = ['All Products', 'PMS', 'AGO', 'DPK', 'LPG']

// the API says "loading" for orders at the depot; the chip only knows four states
const CHIP_STATUS: Record<ApiOrderStatus, ChipStatus> = {
  pending: 'pending',
  loading: 'loading',
  in_transit: 'in-transit',
  fulfilled: 'fulfilled',
  cancelled: 'cancelled',
}

interface OrderExportRow {
  id: string
  station: string
  product: string
  quantity: number
  unit: string
  totalValue: number
  status: string
}

const exportColumns: ExportColumn<OrderExportRow>[] = [
  { key: 'id', header: 'Order ID' },
  { key: 'station', header: 'Station' },
  { key: 'product', header: 'Product' },
  { key: 'quantity', header: 'Quantity', numeric: true, numFmt: '#,##0', formatter: (v) => Number(v ?? 0).toLocaleString() },
  { key: 'unit', header: 'Unit' },
  { key: 'totalValue', header: 'Total Value (NGN)', numeric: true, numFmt: '#,##0.00', formatter: (v) => formatCurrencyFull(v, { decimals: 2 }) },
  { key: 'status', header: 'Status' },
]

const toExportRow = (o: OrderListItem): OrderExportRow => ({
  id: o.order_code,
  station: o.station.name,
  product: o.product_code,
  quantity: o.quantity,
  unit: o.unit,
  totalValue: o.total_value,
  status: o.status_label,
})

export default function ManageOrdersPage() {
  const [tab, setTab] = useState<OrderTab>('all')
  const [productLabel, setProductLabel] = useState('All Products')
  const [searchText, setSearchText] = useState('')
  const search = useDebouncedValue(searchText.trim())
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [trackingOpen, setTrackingOpen] = useState(false)

  const product = productLabel === 'All Products' ? 'all' : productLabel

  const [extra, setExtra] = useState<FilterValues>({})
const { stations } = useStationFilterOptions()
const filterFields: FilterField[] = [
  { type: 'choice', key: 'period', label: 'Date placed', options: PERIOD_CHOICES },
  { type: 'search', key: 'station_id', label: 'Station', options: stations, allLabel: 'All stations', placeholder: 'Search for a station' },
]
const filters = { tab, product, search, period: extra.period, station_id: extra.station_id }
  const overview = useEndpoint('orders-overview', null, () => ordersApi.overview())
  const o = overview.data

  const list = useInfiniteEndpoint('orders-list', filters, (page) =>
    ordersApi.list({ ...filters, page, page_size: 100 }).then(withHasMore),
  )
  const rows = list.pages?.flatMap((p) => p.orders) ?? []
  const activeId = selectedId ?? rows[0]?.id ?? null // newest order until one is picked

  const detail = useEndpoint('order-detail', { activeId }, () => ordersApi.detail(activeId!), {
    enabled: !!activeId,
    keepPrevious: false,
  })

  function pick(id: string | null) {
    setSelectedId(id)
    setTrackingOpen(false)
  }

  return (
    <div className="space-y-6 bg-white p-6 border rounded-lg">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Fuel Orders Management</h1>
          <p className="mt-1 flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-red-500" /> {o ? formatNumber(o.open) : '-'} Open</span>
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-green-500" /> {o ? formatNumber(o.closed_this_month) : '-'} Closed (This Month)</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
<FiltersDialog fields={filterFields} value={extra} onApply={(v) => { setExtra(v); pick(null) }} />
          <ExportButton
            data={() => ordersApi.list({ ...filters, page_size: 1000 }).then((r) => r.orders.map(toExportRow))}
            columns={exportColumns}
            filename="fuel-orders"
            title="Fuel Orders Report"
          />
        </div>
      </div>

      <AsyncPanel state={overview} height="h-24">
        {({ cards }) => (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={<Orders />} iconBgColor="bg-[#FFDAD680]" label="Pending Orders" value={formatNumber(cards.pending)} iconPosition="right" />
            <StatCard icon={<Success />} iconBgColor="bg-green-50" label="Fulfilled (This Month)" value={formatNumber(cards.fulfilled_this_month)} iconPosition="right" />
            <StatCard icon={<Bt />} iconBgColor="bg-blue-50" label="In Transit" value={formatNumber(cards.in_transit)} iconPosition="right" />
            <StatCard icon={<Suspended />} iconBgColor="bg-[#FFDAD680]" label="Cancelled" value={formatNumber(cards.cancelled_this_month)} valueColor="text-red-500" iconPosition="right" />
          </div>
        )}
      </AsyncPanel>

      <div className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={searchText}
              maxLength={64}
              onChange={(e) => { setSearchText(e.target.value); pick(null) }}
              placeholder="Search with order ID or station"
              className="w-full rounded-lg border bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-4 text-sm">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => { setTab(t.key); pick(null) }}
                  className={tab === t.key ? 'font-semibold text-primary' : 'text-gray-400'}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <FilterDropdown
              options={PRODUCTS}
              value={productLabel}
              onChange={(label) => { setProductLabel(label); pick(null) }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          {/* LEFT: order list */}
          <div className="flex h-[500px] flex-col rounded-xl border border-gray-200 bg-white lg:col-span-4">
            <div className="border-b border-gray-100 p-4">
              <h2 className="text-sm font-semibold text-gray-700">All Orders</h2>
            </div>
            <div className="no-scrollbar flex-1 divide-y divide-gray-100 overflow-y-auto">
              <AsyncPanel state={{ data: list.pages, error: list.error, retry: list.retry }} height="h-48">
                {() =>
                  rows.length === 0 ? (
                    <p className="p-6 text-center text-sm text-gray-400">No orders match your search.</p>
                  ) : (
                    <>
                      {rows.map((order) => {
                        const isSelected = activeId === order.id
                        return (
                          <button
                            key={order.id}
                            onClick={() => pick(order.id)}
                            className={cn(
                              'flex w-full items-center justify-between p-4 text-left transition-colors',
                              isSelected ? 'border-l-4 border-primary bg-red-50/40' : 'hover:bg-gray-50',
                            )}
                          >
                            <span className="text-sm font-medium text-gray-900">#{order.order_code}</span>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </button>
                        )
                      })}
                      {list.hasMore && (
                        <button
                          type="button"
                          onClick={list.loadMore}
                          disabled={list.loadingMore}
                          className="w-full p-4 text-sm font-medium text-red-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          {list.loadingMore ? 'Loading...' : 'Load more'}
                        </button>
                      )}
                    </>
                  )
                }
              </AsyncPanel>
            </div>
          </div>

          {/* RIGHT: order details */}
          <div className="flex h-[500px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white lg:col-span-8">
            <div className="shrink-0 border-b border-gray-100 p-6">
              <h3 className="text-base font-bold text-gray-900">Order Details</h3>
            </div>

            <div className="no-scrollbar flex-1 space-y-6 overflow-y-auto p-6">
              {!activeId ? (
                list.pages ? (
                  <p className="text-center text-sm text-gray-400">No order selected.</p>
                ) : (
                  <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
                )
              ) : (
                <AsyncPanel state={detail} height="h-64">
                  {(d) => {
                    const ord = d.order
                    const dest = d.logistics.destination
                    const origin = d.logistics.origin
                    return (
                      <>
                        <div className="grid grid-cols-1 gap-y-4 gap-x-8 text-sm sm:grid-cols-2">
                          <Field label="Location" value={dest.name} />
                          <Field label="Date" value={formatJoined(ord.date)} />
                          <Field label="Product" valueNode={<ProductPill product={ord.product_code} />} />
                          <Field label="Current Status" valueNode={<OrderStatusChip status={CHIP_STATUS[ord.status]} />} />
                          <Field label="Assigned Manager" value={d.personnel?.full_name ?? '-'} />
                          <Field
                            label="Phone number"
                            valueNode={
                              d.personnel ? (
                                <a href={`tel:${d.personnel.phone.replace(/\s/g, '')}`} className="font-medium text-gray-900">
                                  {d.personnel.phone}
                                </a>
                              ) : (
                                <span className="font-medium text-gray-900">-</span>
                              )
                            }
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="rounded-xl border border-gray-100 p-4">
                            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                              <CreditCard className="h-4 w-4" /> Financial Details
                            </p>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Requested Liters</span>
                                <span className="font-medium text-gray-900">{formatNumber(ord.quantity)} {ord.unit}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Unit Price</span>
                                <span className="font-medium text-gray-900">{formatCurrencyFull(ord.unit_price, { decimals: 2 })} / {ord.unit}</span>
                              </div>
                              <div className="flex justify-between border-t border-gray-100 pt-2">
                                <span className="font-semibold text-gray-900">Total Value</span>
                                <span className="text-lg font-bold text-primary">{formatCurrencyFull(ord.total_value, { decimals: 2 })}</span>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-xl border border-gray-100 p-4">
                            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                              <Route className="h-4 w-4" /> Logistics Route
                            </p>
                            <div className="flex items-center gap-3">
                              <div className="flex-1">
                                <p className="text-xs text-gray-400">Origin Source</p>
                                <p className="text-sm font-semibold text-gray-900">{origin?.depot ?? '-'}</p>
                                <p className="text-xs text-gray-400">{origin?.terminal ?? ''}</p>
                              </div>
                              <div className="flex flex-col items-center self-stretch py-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-200" />
                                <span className="my-1 w-px flex-1 bg-red-200" />
                                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                              </div>
                              <div className="flex-1 rounded-lg bg-red-50 p-3">
                                <p className="text-xs text-gray-400">Destination Station</p>
                                <p className="text-sm font-semibold text-primary">{dest.name}</p>
                                <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                  <span className="rounded border bg-white px-1.5 py-0.5">{dest.station_code}</span>
                                  {dest.state_label}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {(ord.cancel_reason || ord.admin_note) && (
                          <div className="space-y-2 rounded-xl border border-gray-100 p-4 text-sm">
                            {ord.cancel_reason && (
                              <p><span className="text-gray-400">Cancel reason: </span><span className="font-medium text-gray-900">{ord.cancel_reason}</span></p>
                            )}
                            {ord.admin_note && (
                              <p><span className="text-gray-400">Admin note: </span><span className="font-medium text-gray-900">{ord.admin_note}</span></p>
                            )}
                          </div>
                        )}

                        <div className="border-t border-gray-100 pt-4">
                          <button
                            onClick={() => setTrackingOpen((v) => !v)}
                            className="flex w-full items-center justify-between text-sm font-semibold text-gray-900"
                          >
                            <span className="flex items-center gap-2"><Info className="h-4 w-4" /> View Order Tracking</span>
                            {trackingOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>

                          {trackingOpen && (
                            <div className="mt-4">
                              <OrderTrackingTimeline steps={d.tracking} />
                            </div>
                          )}
                        </div>
                      </>
                    )
                  }}
                </AsyncPanel>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, valueNode }: { label: string; value?: string; valueNode?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-50 py-2">
      <span className="text-gray-400">{label}</span>
      {valueNode ?? <span className="font-medium text-gray-900">{value}</span>}
    </div>
  )
}

function ProductPill({ product }: { product: string }) {
  return <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">{product}</span>
}