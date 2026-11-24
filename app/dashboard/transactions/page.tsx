// app/dashboard/transactions/overview/page.tsx
'use client'

import { useState } from 'react'
import { FilterDropdown } from '@/components/dashboard/filter-dropdown'
import { DateNav } from '@/components/dashboard/transactions/date-nav'
import { TransactionDetailPanel } from '@/components/dashboard/transactions/transaction-detail-panel'
import { STATUS_STYLE } from '@/lib/data/txn-status-colors'
import { AsyncPanel } from '@/lib/dashboard/async-panel'
import { useEndpoint, useDebouncedValue, useInfiniteEndpoint } from '@/hooks/use-endpoint'
import { transactionsApi } from '@/lib/dashboard/transactions-api'
import { formatCurrencyFull } from '@/lib/utils/format'
import { formatDayLabel, lagosToday, shiftDay } from '@/lib/utils/date'
import { Search } from 'lucide-react'
import { ExportButton } from '@/components/shared/export-button'
import type { ExportColumn } from '@/lib/export'
import type { PeriodFilter } from '@/lib/dashboard/types'
import { cn } from '@/lib/utils'
import { toTxn, toDepositTxn } from '@/lib/dashboard/transactions-mappers'
import type { TxnStatus } from '@/lib/types/transaction-overview'

interface ExportRow {
  date: string
  category: string
  reference: string
  status: string
}

const exportColumns: ExportColumn<ExportRow>[] = [
  { key: 'date', header: 'Date' },
  { key: 'category', header: 'Category' },
  { key: 'reference', header: 'Reference' },
  { key: 'status', header: 'Status' },
]

const MAX_EXPORT_PAGES = 50 // 50 pages x 100 rows = 5,000 rows, a safety limit

const TABS = [
  { key: 'purchase', label: 'Purchase', totalLabel: 'Total Purchased' },
  { key: 'deposit', label: 'Deposit', totalLabel: 'Total Deposit' },
  { key: 'bill', label: 'Explore/ Bill Payment', totalLabel: 'Total Bill payment' },
] as const

type TabKey = (typeof TABS)[number]['key']

interface Row { id: string; ref: string; status: TxnStatus }

const STATUS_KEY: Record<string, string | undefined> = { 'All Status': undefined, Completed: 'completed', Pending: 'pending', Failed: 'failed' }

export default function TransactionsOverviewPage() {
  const [tab, setTab] = useState<TabKey>('purchase')
  const [searchText, setSearchText] = useState('')
  const debounced = useDebouncedValue(searchText.trim())
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [day, setDay] = useState(lagosToday) // the day on the date nav
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const status = STATUS_KEY[statusFilter]

  const period: PeriodFilter = { period: 'custom', start_date: day, end_date: day }
  // purchases and bills reject searches shorter than 4 characters
  const search = tab === 'deposit' || debounced.length >= 4 ? debounced : ''

  const overview = useEndpoint('transactions-overview', period, () => transactionsApi.overview(period))
  const o = overview.data
  const total = o ? { purchase: o.purchase.amount, deposit: o.deposit.amount, bill: o.bill_payment.amount }[tab] : null

  const fetchRows = (page: number) =>
    tab === 'deposit'
      ? transactionsApi.deposits({ ...period, search, page, page_size: 100 }).then((r) => ({
        has_more: r.pagination.page < r.pagination.total_pages,
        rows: r.deposits.map((d): Row => ({ id: d.id, ref: d.reference, status: d.status })),
      }))
      : transactionsApi
        .list({ ...period, category: tab === 'bill' ? 'bill' : 'fuel', status, search, page, page_size: 100 })
        .then((r) => ({
          has_more: r.pagination.page < r.pagination.total_pages,
          rows: r.transactions.map((t): Row => ({ id: t.id, ref: t.transaction_id, status: t.status })),
        }))

  const list = useInfiniteEndpoint('transactions-rows', { tab, day, search, status }, fetchRows)

  // deposits are always completed, so Pending / Failed shows none
  const rows = (list.pages?.flatMap((p) => p.rows) ?? []).filter((r) => tab !== 'deposit' || !status || r.status === status)
  const selected = rows.find((r) => r.id === selectedId) ?? rows[0]

  const txnDetail = useEndpoint('transaction-detail', { id: selected?.id }, () => transactionsApi.detail(selected!.id),
    { enabled: tab !== 'deposit' && !!selected, keepPrevious: false })
  const depositDetail = useEndpoint('deposit-detail', { id: selected?.id }, () => transactionsApi.depositDetail(selected!.id),
    { enabled: tab === 'deposit' && !!selected, keepPrevious: false })

  const active = tab === 'deposit' ? depositDetail : txnDetail
  const panelState = {
    data: tab === 'deposit'
      ? depositDetail.data && toDepositTxn(depositDetail.data)
      : txnDetail.data && toTxn(txnDetail.data),
    error: active.error,
    retry: active.retry,
  }

  function handleTabChange(key: TabKey) {
    setTab(key)
    setSelectedId(null)
  }

  const currentTabConfig = TABS.find((t) => t.key === tab)!

  async function loadExportRows(): Promise<ExportRow[]> {
    const all: Row[] = []
    for (let page = 1; page <= MAX_EXPORT_PAGES; page++) {
      const r = await fetchRows(page)
      all.push(...r.rows)
      if (!r.has_more) break
    }
    return all
      .filter((r) => tab !== 'deposit' || !status || r.status === status) // same rule as the list
      .map((r) => ({
        date: day,
        category: currentTabConfig.label,
        reference: r.ref,
        status: r.status.charAt(0).toUpperCase() + r.status.slice(1),
      }))
  }

  return (
    <div className="space-y-4 bg-white p-6 border rounded-xl">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl font-semibold">General Transactions Overview</h1>
          <p className="text-sm text-gray-500">View and manage all fuel and service transactions across stations.</p>
        </div>
        <div className="flex items-center gap-3">
          <DateNav
            label={formatDayLabel(day)}
            onPrev={() => setDay(shiftDay(day, -1))}
            onNext={() => setDay(shiftDay(day, 1))}
            nextDisabled={day >= lagosToday()}
          />



          <ExportButton
            data={loadExportRows}
            columns={exportColumns}
            filename={`${tab}-transactions-${day}`}
            title={`${currentTabConfig.label} Transactions - ${day}`}
            disabled={rows.length === 0}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 border-b lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-6 text-sm">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => handleTabChange(t.key)}
              className={tab === t.key ? 'border-b-2 border-primary pb-2 font-medium text-primary' : 'pb-2 text-gray-400'}
            >
              {t.label}
            </button>
          ))}
        </div>
        {currentTabConfig.totalLabel} <span className="font-semibold text-gray-900">{total === null ? '-' : formatCurrencyFull(total)}</span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={searchText} onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search with Ref/Transaction number here"
            className="w-full rounded-lg border bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none"
          />
        </div>
        <FilterDropdown options={['All Status', 'Completed', 'Pending', 'Failed']} value={statusFilter} onChange={setStatusFilter} />
      </div>

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        <div className="no-scrollbar h-[600px] overflow-y-auto rounded-xl border bg-white lg:col-span-4">
          <AsyncPanel state={{ data: list.pages, error: list.error, retry: list.retry }} height="h-48">
            {() => (
              <>
                {rows.map((t) => {
                  const s = STATUS_STYLE[t.status]
                  const isSelected = t.id === selected?.id
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedId(t.id)}
                      className={cn(
                        'flex w-full items-center justify-between border-l-4 border-b border-gray-50 p-4 text-left text-sm',
                        isSelected ? cn(s.border, s.bgSelected) : 'border-l-transparent hover:bg-gray-50'
                      )}
                    >
                      {t.ref}
                    </button>
                  )
                })}
                {rows.length === 0 && (
                  <p className="p-6 text-center text-sm text-gray-400">No transactions match your search.</p>
                )}
                {list.hasMore && (
                  <button type="button" onClick={list.loadMore} disabled={list.loadingMore}
                    className="w-full p-4 text-sm font-medium text-red-500 hover:bg-gray-50 disabled:opacity-50">
                    {list.loadingMore ? 'Loading...' : 'Load more'}
                  </button>
                )}
              </>
            )}
          </AsyncPanel>
        </div>

        <div className="no-scrollbar h-[600px] overflow-y-auto rounded-xl border bg-white p-5 lg:col-span-8">
          {selected ? (
            <AsyncPanel state={panelState} height="h-64">
              {(txn) => <TransactionDetailPanel txn={txn} />}
            </AsyncPanel>
          ) : (
            <p className="p-6 text-center text-sm text-gray-400">Select a transaction to view details.</p>
          )}
        </div>
      </div>
    </div>
  )
}