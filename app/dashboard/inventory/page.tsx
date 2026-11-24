'use client'

import { useRef, useState } from 'react'
import { StateColumn } from '@/components/dashboard/inventory/state-column'
import { FilterDropdown } from '@/components/dashboard/filter-dropdown'
import { ExportButton } from '@/components/shared/export-button'
import { StationDetailModal } from '@/components/dashboard/inventory/station-detail-modal'
import { StaffOverviewModal } from '@/components/dashboard/inventory/staff-overview-modal'
import { PumpMetricsModal } from '@/components/dashboard/inventory/pump-metrics-modal'
import { AsyncPanel } from '@/lib/dashboard/async-panel'
import { Streamline, Icon } from '@/components/icons'
import { useEndpoint, useDebouncedValue } from '@/hooks/use-endpoint'
import { comparisonLabel } from '@/lib/dashboard/format'
import type { StandardPeriodKey } from '@/lib/dashboard/period'
import { toBranch, toStationDetail, toStaffRows, toPumpMetrics } from '@/lib/dashboard/inventory-mappers'
import { formatCurrencyFull } from '@/lib/utils/format'
import { lagosToday } from '@/lib/utils/date'
import type { ExportColumn } from '@/lib/export'
import type { Branch } from '@/lib/types/inventory'
import {inventoryApi} from '@/lib/dashboard/inventory-api'

const INVENTORY_PERIODS = [
  { label: 'This Month', key: 'this_month' },
  { label: 'This Week', key: 'this_week' },
  { label: 'This Year', key: 'this_year' },
] as const satisfies readonly { label: string; key: StandardPeriodKey }[]

interface StationExportRow {
  state: string; name: string; code: string; city: string; status: string
  sales: number; transactions: number; change: number | null
}

const exportColumns: ExportColumn<StationExportRow>[] = [
  { key: 'state', header: 'State' },
  { key: 'name', header: 'Station' },
  { key: 'code', header: 'Station Code' },
  { key: 'city', header: 'City' },
  { key: 'status', header: 'Status' },
  { key: 'sales', header: 'Sales (NGN)', numeric: true, numFmt: '#,##0.00', formatter: (v) => formatCurrencyFull(v, { decimals: 2 }) },
  { key: 'transactions', header: 'Transactions', numeric: true, numFmt: '#,##0', formatter: (v) => Number(v ?? 0).toLocaleString() },
  { key: 'change', header: 'Change vs previous period (%)', numeric: true, numFmt: '0.0', formatter: (v) => (v == null ? '-' : `${v}%`) },
]

export default function InventoryPage() {
  const [periodKey, setPeriodKey] = useState<(typeof INVENTORY_PERIODS)[number]['key']>('this_month')
  const [searchText, setSearchText] = useState('')
  const search = useDebouncedValue(searchText.trim())

  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const [date, setDate] = useState(lagosToday) 
  const [stationModalOpen, setStationModalOpen] = useState(false)
  const [staffModalOpen, setStaffModalOpen] = useState(false)
  const [pumpModalOpen, setPumpModalOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const today = lagosToday()
  const periodLabel = INVENTORY_PERIODS.find((p) => p.key === periodKey)!.label

const stationsBody = { period: periodKey, ...(search ? { search } : {}) }
const inventory = useEndpoint('inventory-stations', stationsBody, () => inventoryApi.stations(stationsBody), { keepPrevious: false })


  // pop-ups: only fetch while open
const stationId = selectedBranch?.id
const detail = useEndpoint('station-inventory', { stationId, date }, () => inventoryApi.stationInventory(stationId!, date),
  { enabled: stationModalOpen && !!stationId, keepPrevious: false })
const staff = useEndpoint('station-staff', { stationId }, () => inventoryApi.stationStaff(stationId!, 'all'),
  { enabled: staffModalOpen && !!stationId, keepPrevious: false })
const report = useEndpoint('station-day-report', { stationId, date }, () => inventoryApi.stationDayReport(stationId!, date),
  { enabled: pumpModalOpen && !!stationId, keepPrevious: false })

  const detailState = { ...detail, data: detail.data && toStationDetail(detail.data) }
  const staffState = { ...staff, data: staff.data && toStaffRows(staff.data) }
  const reportState = { ...report, data: report.data && toPumpMetrics(report.data) }

  const exportRows: StationExportRow[] | undefined = inventory.data?.groups.flatMap((g) =>
    g.stations.map((s) => ({
      state: g.label, name: s.name, code: s.station_code, city: s.city ?? "", status: s.status_label,
      sales: s.sales, transactions: s.transactions, change: s.change_percent,
    })),
  )

  function scrollStates(direction: 'left' | 'right') {
    scrollRef.current?.scrollBy({ left: direction === 'right' ? 300 : -300, behavior: 'smooth' })
  }

  function handleBranchClick(branch: Branch) {
    setSelectedBranch(branch)
    setDate(lagosToday())
    setStationModalOpen(true)
  }


  return (
    <div className="space-y-6 bg-white p-6 border rounded-lg">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold">Inventory Stations Record</h1>
          <p className="text-sm text-gray-500 mt-3">View and manage all fuel and service transactions across stations.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <FilterDropdown
            icon={<Icon />}
            options={INVENTORY_PERIODS.map((p) => p.label)}
            value={periodLabel}
            onChange={(label) => setPeriodKey(INVENTORY_PERIODS.find((p) => p.label === label)?.key ?? periodKey)}
          />
          <ExportButton
            data={exportRows ?? []}
            disabled={!exportRows}
            columns={exportColumns}
            filename={`inventory-stations-${periodKey}`}
            title={`Inventory Stations Report - ${periodLabel}`}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          maxLength={64}
          placeholder="Search here..."
          className="w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm outline-none sm:max-w-xs"
        />
      </div>

      <AsyncPanel state={inventory} height="h-64">
        {(d) => {
          if (d.groups.length === 0) {
            return (
              <p className="py-10 text-center text-sm text-gray-500">
                {search ? 'No stations match your search.' : 'No stations found.'}
              </p>
            )
          }
          const vs = comparisonLabel(d.period.key) ?? ''
          return (
            <div className="relative">
              <div ref={scrollRef} className="no-scrollbar flex snap-x items-start gap-6 overflow-x-auto scroll-smooth pb-2">
                {d.groups.map((g) => (
                  <StateColumn
                    key={g.state}
                    stateName={g.label}
                    counts={{ healthy: g.counts.healthy, refill: g.counts.refill_required, notAccessible: g.counts.not_accessible }}
                    branches={g.stations.map((s) => toBranch(s, vs))}
                    onBranchClick={handleBranchClick}
                  />
                ))}
              </div>

              {d.groups.length > 4 && (
                <>
                  <button
                    onClick={() => scrollStates('left')}
                    className="fixed left-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-red-300 lg:left-[272px]"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M9 3L4 7l5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </button>
                  <button
                    onClick={() => scrollStates('right')}
                    className="fixed right-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-red-300"
                  >
                    <Streamline className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
          )
        }}
      </AsyncPanel>

 

      <StationDetailModal
        state={detailState}
        date={date}
        maxDate={today}
        onDateChange={setDate}
        open={stationModalOpen}
        onOpenChange={setStationModalOpen}
        onManageStation={() => { setStationModalOpen(false); setStaffModalOpen(true) }}
        onCheckOrder={() => { /* wire to manage-orders flow later */ }}
        onViewOverview={() => { setStationModalOpen(false); setPumpModalOpen(true) }}
      />

      <StaffOverviewModal
        state={staffState}
        open={staffModalOpen}
        onOpenChange={setStaffModalOpen}
        onCheckOrder={() => { /* wire to manage-orders flow later */ }}
      />

      <PumpMetricsModal
        state={reportState}
        date={date}
        maxDate={today}
        onDateChange={setDate}
        open={pumpModalOpen}
        onOpenChange={setPumpModalOpen}
        onBack={() => { setPumpModalOpen(false); setStationModalOpen(true) }}
      />
    </div>
  )
}