// app/dashboard/settlement/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Filter, ChevronDown, ArrowLeft } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { ExportButton } from '@/components/shared/export-button'
import { SettlementFilterCalendar } from '@/components/dashboard/settlement/settlement-filter-calendar'
import { SettlementEntryRow } from '@/components/dashboard/settlement/settlement-entry-row'
import { ProfitDayRow } from '@/components/dashboard/settlement/profit-day-row' // NEW
import { Pager } from '@/components/dashboard/settlement/pager' // NEW
import { settlementAccounts, TAB_ACCENT } from '@/lib/data/settlement-accounts'
import { useEndpoint } from '@/hooks/use-endpoint' // NEW
import { AsyncPanel } from '@/lib/dashboard/async-panel' // NEW
import { adminSettlementApi } from '@/lib/dashboard/settlement-api' // NEW
import { formatNaira } from '@/lib/dashboard/format'
import type { SettlementEntry } from '@/lib/types/settlement'
import type { ProfitDay } from '@/lib/dashboard/settlement-types' // NEW
import type { ExportColumn } from '@/lib/export'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toEntry } from '@/lib/dashboard/settlement-entry'

const exportColumns: ExportColumn<SettlementEntry>[] = [
  { key: 'destination', header: 'Destination' },
  { key: 'date', header: 'Date' },
  { key: 'reference', header: 'Reference' },
  { key: 'amount', header: 'Amount' },
  { key: 'status', header: 'Status' },
]

// NEW: SmartPay tab export
const profitExportColumns: ExportColumn<ProfitDay>[] = [
  { key: 'date', header: 'Date' },
  { key: 'fuel_sales', header: 'Fuel sales' },
  { key: 'profit', header: 'Profit' },
]



export default function SettlementPage() {
  const [tab, setTab] = useState<'smartpay' | 'sao'>('smartpay')
  const [filterOpen, setFilterOpen] = useState(false)
  const [saoPage, setSaoPage] = useState(1)
  const [profitPage, setProfitPage] = useState(1)
  const [range, setRange] = useState<{ start: string; end: string } | null>(null)
  const today = new Date()

  // no range picked = send nothing, the API defaults to all_time
  const period = range ? { period: 'custom', start_date: range.start, end_date: range.end } : {}
  const rangeKey = range ? `${range.start}_${range.end}` : 'all'

  const pickRange = (start: string, end: string) => { setRange({ start, end }); setSaoPage(1); setProfitPage(1) }
  const clearRange = () => { setRange(null); setSaoPage(1); setProfitPage(1) }
  const fmt = (d: string) =>
    new Date(`${d}T12:00:00Z`).toLocaleDateString('en-NG', { timeZone: 'Africa/Lagos', day: 'numeric', month: 'short', year: 'numeric' })

  const saoOverview = useEndpoint(`sao-settlement-overview-${rangeKey}`, null, () =>
    adminSettlementApi.saoOverview(period))
  const saoList = useEndpoint(`sao-settlements-list-${rangeKey}-${saoPage}`, null, () =>
    adminSettlementApi.saoList({ ...period, page: saoPage }))
  const profitOverview = useEndpoint(`profit-overview-${rangeKey}`, null, () =>
    adminSettlementApi.profitOverview(period))
  const profitDaily = useEndpoint(`profit-daily-${rangeKey}-${profitPage}`, null, () =>
    adminSettlementApi.profitDaily({ ...period, page: profitPage }))

  return (
    <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Settlement Account</h1>
          <p className="text-sm text-gray-500">Settlement funds to your linked accounts.</p>
        </div>
        <Link href="/dashboard/revenue-analytics" className='flex'>
          <Button variant="secondary">
            <ArrowLeft className="mr-2 h-4 w-4 text-[#E50019]" />
            Back
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row items-center justify-between border-b border-gray-200">
        <div className="flex gap-6">
          {(['smartpay', 'sao'] as const).map((key) => {
            const isActive = tab === key
            const tabAccent = TAB_ACCENT[key]
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={cn('relative pb-3 text-sm font-medium', isActive ? tabAccent.text : 'text-gray-400')}
              >
                {settlementAccounts[key].label}
                {isActive && <span className={cn('absolute bottom-0 left-0 right-0 h-0.5', tabAccent.dot)} />}
              </button>
            )
          })}
        </div>

        <div className="flex gap-3 pb-3">
          <div className="relative">
            <button
              onClick={() => setFilterOpen((v) => !v)}
              className={cn(buttonVariants({ variant: 'secondary' }), 'gap-2 text-black-500 border border-[#6B728080]')}
            >
              <Filter className="h-4 w-4" /> Filters <ChevronDown className="h-4 w-4" />
            </button>
            <SettlementFilterCalendar
              open={filterOpen}
              onClose={() => setFilterOpen(false)}
              initialMonth={today.getMonth()}
              initialYear={today.getFullYear()}
              onApply={pickRange}
              onClear={clearRange}
            />
          </div>

          {/* NEW: exports the rows on screen */}
          {tab === 'sao' ? (
            <ExportButton
              data={(saoList.data?.settlements ?? []).map(toEntry)}
              columns={exportColumns}
              filename="sao-settlements"
              title={`${settlementAccounts.sao.label} Settlement Report`}
            />
          ) : (
            <ExportButton
              data={profitDaily.data?.days ?? []}
              columns={profitExportColumns}
              filename="smartpay-profit"
              title={`${settlementAccounts.smartpay.label} Profit Report`}
            />
          )}
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        {range && (
          <p className="mb-2 text-center text-xs text-gray-400">Showing {fmt(range.start)} – {fmt(range.end)}</p>
        )}
        <div className="rounded-xl border border-gray-200 bg-white p-4 h-[68vh] overflow-y-auto no-scrollbar">
          {tab === 'sao' ? (
            <>
              {/* NEW: SAO banner + destination (no Change Bank) */}
              <AsyncPanel state={saoOverview} height="h-48">
                {(o) => (
                  <>
                    <div className={cn('rounded-xl py-6 text-center', TAB_ACCENT.sao.banner)}>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">All Settlement</p>
                      <p className="mt-1 text-2xl font-bold text-primary">{formatNaira(o.all_settlement.amount)}</p>
                    </div>
                    <div className="mt-4">
                      <p className="mb-2 text-sm font-medium text-gray-900">Destination</p>
                      <div className="rounded-lg bg-gray-50 px-4 py-3">
                        {o.account ? (
                          <>
                            <p className="text-sm text-gray-900">{o.account.label}</p>
                            <p className="text-xs text-gray-400">{o.account.account_name}</p>
                          </>
                        ) : (
                          <p className="text-sm text-gray-500">No settlement account yet</p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </AsyncPanel>

              {/* NEW: list + paging */}
              <div className="mt-6">
                <p className="mb-2 text-sm font-medium text-gray-900">Recent Settlements</p>
                <AsyncPanel state={saoList} height="h-64">
                  {(l) =>
                    l.settlements.length === 0 ? (
                      <p className="py-6 text-center text-sm text-gray-400">No settlements yet</p>
                    ) : (
                      <>
                        {l.settlements.map((s) => (
                          <Link key={s.id} href={`/dashboard/settlement/${s.id}`} className="block hover:bg-gray-50">
                            <SettlementEntryRow entry={toEntry(s)} />
                          </Link>
                        ))}
                        <Pager pagination={l.pagination} onChange={setSaoPage} />
                      </>
                    )
                  }
                </AsyncPanel>
              </div>
            </>
          ) : (
            <>
              {/* NEW: SmartPay banner + one line per day */}
              <AsyncPanel state={profitOverview} height="h-32">
                {(o) => (
                  <div className={cn('rounded-xl py-6 text-center', TAB_ACCENT.smartpay.banner)}>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">All Settlement</p>
                    <p className="mt-1 text-2xl font-bold text-primary">{formatNaira(o.all_settlement.amount)}</p>
                  </div>
                )}
              </AsyncPanel>

              <div className="mt-6">
                <p className="mb-2 text-sm font-medium text-gray-900">Daily Profit</p>
                <AsyncPanel state={profitDaily} height="h-64">
                  {(d) =>
                    d.days.length === 0 ? (
                      <p className="py-6 text-center text-sm text-gray-400">No profit recorded yet</p>
                    ) : (
                      <>
                        {d.days.map((day) => (
                          <ProfitDayRow key={day.date} day={day} />
                        ))}
                        <Pager pagination={d.pagination} onChange={setProfitPage} />
                      </>
                    )
                  }
                </AsyncPanel>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}