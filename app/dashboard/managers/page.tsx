'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Search, ArrowLeft, UserX, ShieldAlert, ShieldCheck, RotateCcw, ChevronRight } from 'lucide-react'
import { ExportButton } from '@/components/shared/export-button'
import { StatCard } from '@/components/dashboard/stat-card'
import { ReasonModal } from '@/components/dashboard/managers/reason-modal'
import { AsyncPanel } from '@/lib/dashboard/async-panel'
import { Location, Suspended, Success, Manage} from '@/components/icons'
import { useEndpoint, useDebouncedValue, useInfiniteEndpoint } from '@/hooks/use-endpoint'
import { toFormError } from '@/lib/auth/api'
import { managersApi } from '@/lib/dashboard/manager-api'
import { inventoryApi } from '@/lib/dashboard/inventory-api'
import { withHasMore } from '@/lib/dashboard/paging'
import { formatNumber } from '@/lib/dashboard/format'
import { formatCurrencyFull } from '@/lib/utils/format'
import { formatJoined, timeAgoLong, serviceYear } from '@/lib/utils/date'
import type { ExportColumn } from '@/lib/export'
import type { ManagerAction, ManagerListItem, ManagerStatus } from '@/lib/dashboard/manager-types'
import type { StaffStatus } from '@/lib/dashboard/inventory-types'
import { FiltersDialog, type FilterField, type FilterValues } from '@/components/dashboard/filters-dialog'
import { useStationFilterOptions } from '@/hooks/use-station-filter-options'

interface ManagerExportRow {
  name: string
  managerId: string
  assignedStation: string
  location: string
  status: string
}

const exportColumns: ExportColumn<ManagerExportRow>[] = [
  { key: 'name', header: 'Name' },
  { key: 'managerId', header: 'Manager ID' },
  { key: 'assignedStation', header: 'Assigned Station' },
  { key: 'location', header: 'Location' },
  { key: 'status', header: 'Status' },
]

const toExportRow = (m: ManagerListItem): ManagerExportRow => ({
  name: m.full_name,
  managerId: m.manager_id,
  assignedStation: m.station?.name ?? '-',
  location: m.station?.location ?? '-',
  status: m.status_label,
})

const BADGE: Record<ManagerStatus, { wrap: string; dot: string }> = {
  active: { wrap: 'bg-green-50 text-green-700', dot: 'bg-green-500' },
  off_duty: { wrap: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' },
  suspended: { wrap: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  removed: { wrap: 'bg-red-50 text-red-700', dot: 'bg-red-500' },
}

const STAFF_PILL: Record<StaffStatus, string> = {
  active: 'bg-green-50 text-green-700',
  suspended: 'bg-amber-50 text-amber-700',
  off_duty: 'bg-gray-100 text-gray-600',
  deactivated: 'bg-gray-100 text-gray-600',
}

const DONE: Record<ManagerAction, string> = {
  suspend: 'Manager suspended',
  unsuspend: 'Manager unsuspended',
  remove: 'Manager removed',
  restore: 'Manager restored',
}

function actionError(err: unknown) {
  const e = toFormError(err)
  if (e.code === 'rate_limited' && e.retryAfter) {
    return `Too many status changes. Try again in ${Math.ceil(e.retryAfter / 60)} min.`
  }
  return e.message
}

const STATUS_CHOICES = [
  { value: '', label: 'All' }, // the API leaves out removed managers by default
  { value: 'active', label: 'Active' },
  { value: 'off_duty', label: 'Off duty' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'removed', label: 'Removed' },
]


export default function ManagersPage() {
  const [searchText, setSearchText] = useState('')
  const search = useDebouncedValue(searchText.trim())
  const [filters, setFilters] = useState<FilterValues>({})
const { states, stations } = useStationFilterOptions()
const filterFields: FilterField[] = [
  { type: 'choice', key: 'status', label: 'Status', options: STATUS_CHOICES },
  { type: 'search', key: 'state', label: 'State', options: states, allLabel: 'All states', placeholder: 'Search for a state' },
  { type: 'search', key: 'station_id', label: 'Station', options: stations, allLabel: 'All stations', placeholder: 'Search for a station' },
]
const query = { search, status: filters.status, state: filters.state, station_id: filters.station_id }
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'details' | 'staff-management'>('details')
  const [reasonAction, setReasonAction] = useState<'Suspend' | 'Remove' | null>(null)

  // company-wide cards: their own call, because stats ignore the search
  const stats = useEndpoint('managers-stats', null, () => managersApi.list({ page_size: 1 }))

  // left list: pages of 100, loaded on demand
const list = useInfiniteEndpoint('managers-list', query, (page) =>
  managersApi.list({ ...query, page, page_size: 100 }).then(withHasMore),
)
  const rows = list.pages?.flatMap((p) => p.managers) ?? []
  const activeId = selectedId ?? rows[0]?.id ?? null // first manager until one is picked

  const detail = useEndpoint('manager-detail', { activeId }, () => managersApi.detail(activeId!), {
    enabled: !!activeId,
    keepPrevious: false,
  })
  const stationId = detail.data?.station.id
  const staff = useEndpoint('station-staff', { stationId }, () => inventoryApi.stationStaff(stationId!, 'all'), {
    enabled: viewMode === 'staff-management' && !!stationId,
    keepPrevious: false,
  })

  const setStatus = useMutation({
    mutationFn: (v: { id: string; action: ManagerAction }) => managersApi.setStatus(v.id, v.action),
  })

  function selectManager(id: string | null) {
    setSelectedId(id)
    setViewMode('details')
  }

  async function runAction(action: ManagerAction): Promise<boolean> {
    if (!activeId) return false
    try {
      const r = await setStatus.mutateAsync({ id: activeId, action })
      toast.success(DONE[action])
      if (r.station_active_managers === 0) toast.warning('This branch has no active manager now.')
      if (r.login_blocked === false) {
        toast.warning("Status updated, but the manager's login could not be blocked. Branch access is already removed.")
      }
      detail.retry()
      list.retry()
      stats.retry()
      return true
    } catch (err) {
      toast.error(actionError(err))
      return false
    }
  }

  async function handleConfirm() {
    if (!reasonAction) return
    const ok = await runAction(reasonAction === 'Suspend' ? 'suspend' : 'remove')
    if (ok) setReasonAction(null) // stays open on failure so the user can retry
  }

  const skeleton = <div className="m-6 h-64 animate-pulse rounded-xl bg-gray-100" />

  return (
    <div className="space-y-6 bg-white p-6 border rounded-lg">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Managers Directory</h1>
          <p className="text-sm text-gray-500">Manage station administrators and operations personnel.</p>
        </div>
        <div className="flex gap-3">
       <FiltersDialog fields={filterFields} value={filters} onApply={(v) => { setFilters(v); selectManager(null) }} />
          <ExportButton
          data={() => managersApi.list({ ...query, page_size: 1000 }).then((r) => r.managers.map(toExportRow))}
            columns={exportColumns}
            filename="managers"
            title="Managers Report"
          />
        </div>
      </div>

      <AsyncPanel state={stats} height="h-24">
        {({ stats: s }) => (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 mt-4">
            <StatCard icon={<Manage />} iconBgColor="bg-red-50" label="Total Managers" value={formatNumber(s.total_managers)} iconPosition="right" />
            <StatCard icon={<Success />} iconBgColor="bg-green-50" label="Active" value={formatNumber(s.active)} valueColor="text-green-600" iconPosition="right" />
            <StatCard icon={<Location />} iconBgColor="bg-blue-50" label="Location" value={formatNumber(s.locations)} iconPosition="right" valueColor="text-[#1E5EAC]" />
            <StatCard icon={<Suspended />} iconBgColor="bg-red-50" label="Suspended" value={formatNumber(s.suspended)} valueColor="text-[#BA1A1A]" iconPosition="right" />
          </div>
        )}
      </AsyncPanel>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input
          type="text"
          maxLength={64}
          placeholder="Search with managers name or ID"
          value={searchText}
          onChange={(e) => { setSearchText(e.target.value); selectManager(null) }}
          className="w-1/2 pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: All Managers */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-gray-200 shadow-lg flex flex-col h-[550px]">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">All Managers</h2>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 no-scrollbar">
            <AsyncPanel state={{ data: list.pages, error: list.error, retry: list.retry }} height="h-48">
              {() =>
                rows.length === 0 ? (
                  <p className="p-6 text-center text-sm text-gray-400">No managers match your search.</p>
                ) : (
                  <>
                    {rows.map((m) => {
                      const isSelected = activeId === m.id
                      return (
                        <div
                          key={m.id}
                          onClick={() => selectManager(m.id)}
                          className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${isSelected ? 'shadow-lg shadow-[#ED202433]' : 'hover:bg-gray-50'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 shrink-0 overflow-hidden rounded-full bg-gray-100">
                              {m.avatar_url ? (
                                // plain img: avatar hosts aren't configured for next/image
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={m.avatar_url} alt={m.full_name} className="h-full w-full object-cover" />
                              ) : (
                                <span className="flex h-full w-full items-center justify-center text-sm font-medium text-gray-400">
                                  {m.full_name.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{m.full_name}</h4>
                              <p className="text-xs text-gray-400 mt-0.5">ID: {m.manager_id}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
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

        {/* Right: Details or Staffs Management */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-[550px] overflow-hidden">
          {!activeId ? (
            list.pages ? (
              <p className="p-6 text-center text-sm text-gray-400">No manager selected.</p>
            ) : (
              skeleton
            )
          ) : viewMode === 'details' ? (
            <AsyncPanel state={detail} height="h-64">
              {(d) => {
                const m = d.manager
                const a = d.actions
                const badge = BADGE[m.status]
                const busy = setStatus.isPending
                return (
                  <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                      <h3 className="text-base font-bold text-gray-900">Managers Details</h3>
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${badge.wrap}`}>
                        <span className={`w-2 h-2 rounded-full ${badge.dot}`}></span> {m.status_label}
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                        <Row label="Managers Name" value={m.full_name} />
                        <Row label="Assigned station" value={d.station.name} />
                        <Row label="Service Year" value={serviceYear(m.tenure)} />
                        <Row label="Station ID" value={d.station.station_code} />
                        <Row label="Started" value={formatJoined(m.tenure.joined_at)} />
                        <Row
                          label="Last Active"
                          value={m.online ? 'Online' : m.last_active_at ? timeAgoLong(m.last_active_at) : '-'}
                        />
                        <Row label="Email Address" value={m.email} />
                        <Row label="Phone Number" value={m.phone} />
                        <Row label="Home Address" value={m.home_address ?? '-'} wide />
                      </div>

                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-bold text-gray-900">{d.staff_count} Pay point staffs manage</h4>
                          <button
                            onClick={() => setViewMode('staff-management')}
                            className="text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 px-3 py-1.5 rounded-lg transition"
                          >
                            View all
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 bg-gray-50/70 border border-gray-100 rounded-xl">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1"><span>📈</span> Total Sales</div>
                            <div className="text-xl font-bold text-gray-900">{formatNumber(d.totals.volume_litres)} L</div>
                            <p className="text-[11px] text-gray-400 mt-1">
                              Total volume moved{d.totals.gas_kg > 0 && ` (+ ${formatNumber(d.totals.gas_kg)} kg gas)`}
                            </p>
                          </div>
                          <div
                            className="p-4 bg-gray-50/70 border border-gray-100 rounded-xl"
                            title={`App ${formatCurrencyFull(d.totals.app_sales_amount)} · Cash ${formatCurrencyFull(d.totals.cash_sales_amount)}`}
                          >
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1"><span>💰</span> Total Revenue</div>
                            <div className="text-xl font-bold text-gray-900">{formatCurrencyFull(d.totals.revenue)}</div>
                            <p className="text-[11px] text-gray-400 mt-1">Gross revenue generated</p>
                          </div>
                        </div>
                      </div>

                      {(a.can_remove || a.can_suspend || a.can_unsuspend || a.can_restore) && (
                        <div className="pt-6 border-t border-gray-100 flex items-center justify-between gap-4">
                          {a.can_remove && (
                            <button
                              onClick={() => setReasonAction('Remove')}
                              disabled={busy}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                            >
                              <UserX className="w-4 h-4 text-gray-500" />
                              Remove Manager
                            </button>
                          )}
                          {a.can_unsuspend && (
                            <button
                              onClick={() => runAction('unsuspend')}
                              disabled={busy}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition shadow-sm disabled:opacity-50"
                            >
                              <ShieldCheck className="w-4 h-4" />
                              {busy ? 'Working...' : 'Unsuspend'}
                            </button>
                          )}
                          {a.can_restore && (
                            <button
                              onClick={() => runAction('restore')}
                              disabled={busy}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition shadow-sm disabled:opacity-50"
                            >
                              <RotateCcw className="w-4 h-4" />
                              {busy ? 'Working...' : 'Restore'}
                            </button>
                          )}
                          {a.can_suspend && (
                            <button
                              onClick={() => setReasonAction('Suspend')}
                              disabled={busy}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition shadow-sm disabled:opacity-50"
                            >
                              <ShieldAlert className="w-4 h-4" />
                              Suspend Manager
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              }}
            </AsyncPanel>
          ) : (
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                <h3 className="text-base font-bold text-gray-900">Staffs Management</h3>
                <button
                  onClick={() => setViewMode('details')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar">
                <AsyncPanel state={staff} height="h-48">
                  {(s) =>
                    s.staff.length === 0 ? (
                      <p className="p-6 text-center text-sm text-gray-400">No staff found for this station.</p>
                    ) : (
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 sticky top-0 text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                          <tr>
                            <th className="py-3 px-6 font-semibold">Name</th>
                            <th className="py-3 px-6 font-semibold">Phone Number</th>
                            <th className="py-3 px-6 font-semibold">Role/Position</th>
                            <th className="py-3 px-6 font-semibold">Date Joined</th>
                            <th className="py-3 px-6 font-semibold">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                          {s.staff.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50/50 transition">
                              <td className="py-4 px-6">
                                <div className="font-medium text-gray-900">{p.full_name}</div>
                                <div className="text-xs text-gray-400">{p.email}</div>
                              </td>
                              <td className="py-4 px-6 text-gray-600">{p.phone}</td>
                              <td className="py-4 px-6 text-gray-600">{p.role}</td>
                              <td className="py-4 px-6 text-gray-600">{formatJoined(p.date_joined)}</td>
                              <td className="py-4 px-6">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STAFF_PILL[p.status]}`}>
                                  {p.status_label}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )
                  }
                </AsyncPanel>
              </div>
            </div>
          )}
        </div>
      </div>

      <ReasonModal
        key={`${activeId}-${reasonAction ?? 'none'}`}
        open={reasonAction !== null}
        onOpenChange={(o) => !o && setReasonAction(null)}
        actionLabel={reasonAction ?? 'Suspend'}
        managerName={detail.data?.manager.full_name ?? ''}
        destructive
        askReason={false}
        onConfirm={handleConfirm}
      />
    </div>
  )
}

function Row({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={`flex justify-between py-2 border-b border-gray-50 ${wide ? 'md:col-span-2' : ''}`}>
      <span className="text-gray-400">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  )
}