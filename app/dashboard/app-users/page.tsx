// app/dashboard/app-users/page.tsx
'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Search, BarChart3, Megaphone, Download, Loader2 } from 'lucide-react'
import { AppUserStats } from '@/components/dashboard/app-users/app-user-stats'
import { DetailHeaderTabs, type DetailView } from '@/components/dashboard/app-users/detail-header-tabs'
import {
  AccountDetailsContent,
  TransactionRow,
} from '@/components/dashboard/app-users/account-details-content'
import { IpStatContent } from '@/components/dashboard/app-users/ip-stat-content'
import { ActivityLogContent } from '@/components/dashboard/app-users/activity-log-content'
import { MessageUserContent } from '@/components/dashboard/app-users/message-user-content'
import { AnchoredPanel } from '@/components/dashboard/app-users/anchored-panel'
import { AppStatModal } from '@/components/dashboard/app-users/app-stat-modal'
import { Pager } from '@/components/dashboard/settlement/pager'
import { useEndpoint, useDebouncedValue } from '@/hooks/use-endpoint'
import { AsyncPanel } from '@/lib/dashboard/async-panel'
import { appUsersApi, APP_USERS_KEY } from '@/lib/dashboard/app-users-api'
import { managersApi } from '@/lib/dashboard/manager-api'
import { formatLagosDateTime, formatNaira } from '@/lib/dashboard/format'
import { exportData, type ExportColumn } from '@/lib/export'
import type {
  ManagerAction,
  ManagerDetail,
  ManagerListItem,
  ManagerStatus,
} from '@/lib/dashboard/manager-types'
import type {
  AppUserListItem,
  AppUsersListParams,
  AppUsersPeriod,
} from '@/lib/types/app-user'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const TABS = [
  { key: 'active', label: 'Active Users' },
  { key: 'restricted', label: 'Restricted Users' },
  { key: 'sales', label: 'Sales App users' },
] as const

type TabKey = (typeof TABS)[number]['key']

interface UserExportRow {
  name: string
  phone: string
  email: string
  status: string
  joined: string
}

const exportColumns: ExportColumn<UserExportRow>[] = [
  { key: 'name', header: 'Name' },
  { key: 'phone', header: 'Phone' },
  { key: 'email', header: 'Email' },
  { key: 'status', header: 'Status' },
  { key: 'joined', header: 'Joined' },
]

const EXPORT_TITLE: Record<TabKey, string> = {
  active: 'Active App Users',
  restricted: 'Restricted App Users',
  sales: 'Sales App Users',
}

// The manager endpoints take `manager_id`. This sends the row's uuid `id`.
// If your backend expects the MGR-1001 code instead, change it here (one place).
const managerKey = (m: ManagerListItem) => m.id

const MANAGER_TOAST: Record<ManagerAction, string> = {
  suspend: 'Manager suspended successfully',
  unsuspend: 'Manager reinstated successfully',
  remove: 'Manager removed successfully',
  restore: 'Manager restored successfully',
}

const MANAGER_CONFIRM: Record<
  ManagerAction,
  { message: string; actionLabel: string; loadingLabel: string; tone: 'danger' | 'success' }
> = {
  suspend: { message: 'This manager will be suspended!', actionLabel: 'Suspend Anyway', loadingLabel: 'Suspending…', tone: 'danger' },
  unsuspend: { message: 'This manager will have full app access', actionLabel: 'Reinstate', loadingLabel: 'Reinstating…', tone: 'success' },
  remove: { message: 'This manager will be removed!', actionLabel: 'Remove Anyway', loadingLabel: 'Removing…', tone: 'danger' },
  restore: { message: 'This manager will be restored', actionLabel: 'Restore', loadingLabel: 'Restoring…', tone: 'success' },
}

const MANAGER_BADGE: Record<ManagerStatus, string> = {
  active: 'bg-green-50 text-green-600',
  off_duty: 'bg-amber-50 text-amber-600',
  suspended: 'bg-red-50 text-red-600',
  removed: 'bg-gray-100 text-gray-500',
}

export default function AppUsersPage() {
  const [tab, setTab] = useState<TabKey>('active')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | undefined>()
  const [detailView, setDetailView] = useState<DetailView>('account')

  const [appStatOpen, setAppStatOpen] = useState(false)
  const appStatBtnRef = useRef<HTMLButtonElement>(null)
  const detailTabsRef = useRef<HTMLDivElement>(null)

  const [isRestricting, setIsRestricting] = useState(false)
  const [isReinstating, setIsReinstating] = useState(false)
  const [managerBusy, setManagerBusy] = useState(false)
  const isBusy = isRestricting || isReinstating
  const [isExporting, setIsExporting] = useState(false)

  const [periodKey, setPeriodKey] = useState<AppUsersPeriod>('last_30_days')

  const debouncedSearch = useDebouncedValue(search, 400)
  const [page, setPage] = useState(1)
  const [transPage, setTransPage] = useState(1)

  const isCustomerTab = tab === 'active' || tab === 'restricted'
  const isSalesTab = tab === 'sales'

  // Overview API
  const overviewParams = { period: periodKey }

  const overview = useEndpoint(
    APP_USERS_KEY,
    overviewParams,
    () => appUsersApi.overview(overviewParams),
    { keepPrevious: false },
  )

  // Customers: users list API
  const listParams: AppUsersListParams = {
    tab: tab === 'restricted' ? 'restricted' : 'active',
    search: debouncedSearch.trim() || undefined,
    page,
    page_size: 20,
  }

  const usersList = useEndpoint(
    'users-list',
    listParams,
    () => appUsersApi.list(listParams),
    { enabled: isCustomerTab, keepPrevious: false },
  )

  const apiUsers = usersList.data?.users ?? []

  // undefined outside the customer tabs, so a stale customer is never shown
  const selected: AppUserListItem | undefined = isCustomerTab
    ? apiUsers.find((user) => user.id === selectedId) ?? apiUsers[0]
    : undefined

  // Sales App users: managers list API
  const managerParams = {
    search: debouncedSearch.trim() || undefined,
    page,
    page_size: 20,
  }

  const managerList = useEndpoint(
    'managers-list',
    managerParams,
    () => managersApi.list(managerParams),
    { enabled: isSalesTab, keepPrevious: false },
  )

  const apiManagers = managerList.data?.managers ?? []

  const selectedManager: ManagerListItem | undefined = isSalesTab
    ? apiManagers.find((m) => m.id === selectedId) ?? apiManagers[0]
    : undefined

  const managerDetail = useEndpoint(
    'manager-detail',
    { manager_id: selectedManager?.id },
    () => managersApi.detail(managerKey(selectedManager!)),
    { enabled: !!selectedManager, keepPrevious: false },
  )

  // Which manager actions the API allows right now
  const mActions = managerDetail.data?.actions
  const managerHiddenTabs: DetailView[] = [
    'ip',
    'activity',
    'message',
    'transactions',
    ...(mActions?.can_suspend || mActions?.can_unsuspend ? [] : (['restrict'] as DetailView[])),
    ...(mActions?.can_remove || mActions?.can_restore ? [] : (['remove'] as DetailView[])),
  ]

  // Customer detail API
  const userDetail = useEndpoint(
    'user-detail',
    { id: selected?.id },
    () => appUsersApi.detail({ id: selected!.id }),
    { enabled: !!selected?.id, keepPrevious: false },
  )

  // Customer transactions API ("View all")
  const transactions = useEndpoint(
    'user-transactions',
    { id: selected?.id, page: transPage, page_size: 20 },
    () =>
      appUsersApi.transactions({
        id: selected!.id,
        page: transPage,
        page_size: 20,
      }),
    { enabled: !!selected?.id && detailView === 'transactions', keepPrevious: false },
  )

  // Customer activity API (IP Stat + App Activities share it)
  const activity = useEndpoint(
    'user-activity',
    { id: selected?.id },
    () => appUsersApi.activity({ id: selected!.id }),
    {
      enabled: !!selected?.id && (detailView === 'ip' || detailView === 'activity'),
      keepPrevious: false,
    },
  )

  // Export Report: the rows currently on screen
  const exportRows: UserExportRow[] = isSalesTab
    ? apiManagers.map((m) => ({
        name: m.full_name,
        phone: m.phone,
        email: m.email,
        status: m.status_label,
        joined: formatLagosDateTime(m.joined_at),
      }))
    : apiUsers.map((u) => ({
        name: u.full_name,
        phone: u.phone,
        email: u.email,
        status: u.restricted ? 'Restricted' : 'Active',
        joined: formatLagosDateTime(u.joined_at),
      }))

  async function handleExport() {
    if (isExporting || exportRows.length === 0) return
    setIsExporting(true)
    try {
      const result = await exportData('csv', {
        data: exportRows,
        columns: exportColumns,
        filename: `${tab}-app-users`,
        title: EXPORT_TITLE[tab],
      })
      if (!result.success) toast.error(result.error ?? 'Export failed. Please try again.')
    } catch {
      toast.error('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  function selectUser(id: string) {
    setSelectedId(id)
    setTransPage(1)
    setDetailView('account')
  }

  const closeDetail = () => setDetailView('account')

  async function handleStatusChange() {
    if (!selected || isBusy) return

    const restricting = !selected.restricted
    const setLoading = restricting ? setIsRestricting : setIsReinstating

    setLoading(true)

    try {
      await appUsersApi.updateStatus({
        id: selected.id,
        action: restricting ? 'restrict' : 'reinstate',
      })

      await usersList.retry()
      await overview.retry()
      setSelectedId(undefined)

      setDetailView('account')

      toast.success(
        restricting ? 'User restricted successfully' : 'User reinstated successfully',
      )
    } catch {
      toast.error(
        restricting
          ? "Couldn't restrict this user. Please try again."
          : "Couldn't reinstate this user. Please try again.",
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleManagerAction(action: ManagerAction) {
    if (!selectedManager || managerBusy) return

    setManagerBusy(true)
    try {
      await managersApi.setStatus(managerKey(selectedManager), action)

      await managerList.retry()
      await managerDetail.retry()
      setDetailView('account')

      toast.success(MANAGER_TOAST[action])
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Couldn't update this manager. Please try again.",
      )
    } finally {
      setManagerBusy(false)
    }
  }

  const selectionAccent = tab === 'restricted' ? 'border-l-red-500 bg-red-50/50' : 'border-l-blue-600 bg-blue-50/50'

  return (
    <div className="space-y-6 bg-white p-6 border rounded-lg">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-xl font-semibold">App Users Management</h1>
          <p className="text-sm text-gray-500">Overview of customer registrations, app adoption metrics, and user activity control.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            ref={appStatBtnRef}
            onClick={() => setAppStatOpen(true)}
            className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
          >
            <BarChart3 className="h-4 w-4" /> App Stat
          </button>
          <Link
            href="/dashboard/app-users/broadcast"
            className="flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            <Megaphone className="h-4 w-4" /> In App Broadcast
          </Link>
          <button
            onClick={handleExport}
            disabled={isExporting || exportRows.length === 0}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Download className="h-4 w-4" /> {isExporting ? 'Exporting...' : 'Export Report'}
          </button>
        </div>
      </div>

      <AsyncPanel state={overview} height="h-40">
        {(data) => <AppUserStats data={data} />}
      </AsyncPanel>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-6 border-b text-sm">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setSelectedId(undefined); setPage(1); setTransPage(1); setDetailView('account') }}
              className={tab === t.key ? 'border-b-2 border-primary pb-2 font-medium text-primary' : 'pb-2 text-gray-400'}
            >
              {t.label}
            </button>
          ))}
        </div>
        <select
          value={periodKey}
          onChange={(e) => setPeriodKey(e.target.value as AppUsersPeriod)}
          className="rounded-lg border bg-white px-3 py-2 text-sm text-gray-500 outline-none"
          aria-label="Overview reporting period"
        >
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="last_7_days">Last 7 Days</option>
          <option value="last_30_days">Last 30 Days</option>
          <option value="this_month">This Month</option>
          <option value="last_month">Last Month</option>
        </select>
      </div>

      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          maxLength={64}
          placeholder={
            tab === 'sales'
              ? 'Search with Managers ID or Staff ID'
              : 'Search users with email or Phone no'
          }
          className="w-full rounded-lg border bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none"
        />
      </div>

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        <div className="no-scrollbar h-[600px] overflow-y-auto rounded-xl border bg-white lg:col-span-4">
          {isSalesTab ? (
            <AsyncPanel state={managerList} height="h-40">
              {(data) => (
                <>
                  {data.managers.map((m) => {
                    const isSelected = m.id === selectedManager?.id
                    return (
                      <button
                        key={m.id}
                        onClick={() => selectUser(m.id)}
                        className={cn(
                          'flex w-full flex-col items-start border-l-4 border-b border-gray-50 p-3 text-left',
                          isSelected ? selectionAccent : 'border-l-transparent hover:bg-gray-50'
                        )}
                      >
                        <span className="text-sm font-medium text-gray-900">{m.manager_id}</span>
                        <span className="text-xs text-gray-400">{m.full_name}</span>
                      </button>
                    )
                  })}
                  {data.managers.length === 0 && (
                    <p className="p-6 text-center text-sm text-gray-400">No managers found.</p>
                  )}
                  <div className="p-3">
                    <Pager pagination={data.pagination} onChange={setPage} />
                  </div>
                </>
              )}
            </AsyncPanel>
          ) : (
            <AsyncPanel state={usersList} height="h-40">
              {(data) => (
                <>
                  {data.users.map((u) => {
                    const isSelected = u.id === selected?.id
                    return (
                      <button
                        key={u.id}
                        onClick={() => selectUser(u.id)}
                        className={cn(
                          'flex w-full flex-col items-start border-l-4 border-b border-gray-50 p-3 text-left',
                          isSelected ? selectionAccent : 'border-l-transparent hover:bg-gray-50'
                        )}
                      >
                        <span className="text-sm font-medium text-gray-900">{u.phone}</span>
                        <span className="text-xs text-gray-400">{u.email}</span>
                      </button>
                    )
                  })}
                  {data.users.length === 0 && (
                    <p className="p-6 text-center text-sm text-gray-400">No users found.</p>
                  )}
                  <div className="p-3">
                    <Pager pagination={data.pagination} onChange={setPage} />
                  </div>
                </>
              )}
            </AsyncPanel>
          )}
        </div>

        <div className="no-scrollbar h-[600px] overflow-y-auto rounded-xl border bg-white p-5 lg:col-span-8">
          {isSalesTab ? (
            !selectedManager ? (
              <p className="p-6 text-center text-sm text-gray-400">Select a manager to view details.</p>
            ) : (
              <>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Account details</p>
                    <p className="text-xs text-gray-400">Joined {formatLagosDateTime(selectedManager.joined_at)}</p>
                  </div>

                  <div>
                    {detailView === 'restrict' || detailView === 'remove' ? (
                      <ManagerConfirmBar
                        view={detailView}
                        actions={mActions}
                        busy={managerBusy}
                        onConfirm={handleManagerAction}
                        onCancel={closeDetail}
                      />
                    ) : (
                      <DetailHeaderTabs
                        view={detailView}
                        onChange={setDetailView}
                        restrictLabel={mActions?.can_unsuspend ? 'Reinstate' : 'Restrict'}
                        removeLabel={mActions?.can_restore ? 'Restore' : 'Remove'}
                        showRemove
                        hide={managerHiddenTabs}
                      />
                    )}
                  </div>
                </div>

                <AsyncPanel state={managerDetail} height="h-40">
                  {(data) => <SalesUserAccountDetails data={data} />}
                </AsyncPanel>
              </>
            )
          ) : !selected ? (
            <p className="p-6 text-center text-sm text-gray-400">Select a user to view details.</p>
          ) : (
            <>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Account details</p>
                  <p className="text-xs text-gray-400">Joined {formatLagosDateTime(selected.joined_at)}</p>
                </div>

                <div ref={detailTabsRef}>
                  {detailView === 'restrict' ? (
                    !selected.restricted ? (
                      <ConfirmBar
                        message="This user will be suspended!"
                        actionLabel="Restrict Anyway"
                        loadingLabel="Restricting…"
                        loading={isRestricting}
                        tone="danger"
                        onConfirm={handleStatusChange}
                        onCancel={closeDetail}
                      />
                    ) : (
                      <ConfirmBar
                        message="This user will have full app access"
                        actionLabel="Reinstate"
                        loadingLabel="Reinstating…"
                        loading={isReinstating}
                        tone="success"
                        onConfirm={handleStatusChange}
                        onCancel={closeDetail}
                      />
                    )
                  ) : (
                    <DetailHeaderTabs
                      view={detailView}
                      onChange={setDetailView}
                      restrictLabel={selected.restricted ? 'Reinstate' : 'Restrict'}
                    />
                  )}
                </div>
              </div>

              {detailView === 'transactions' ? (
                <AsyncPanel state={transactions} height="h-40">
                  {(data) => (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold">All Transactions</h3>
                        <button onClick={closeDetail} className="text-xs font-medium text-primary">Back</button>
                      </div>
                      {data.transactions.length === 0 ? (
                        <p className="text-sm text-gray-400">No transactions found.</p>
                      ) : (
                        <>
                          <div className="space-y-2">
                            {data.transactions.map((t) => <TransactionRow key={t.id} t={t} />)}
                          </div>
                          <Pager pagination={data.pagination} onChange={setTransPage} />
                        </>
                      )}
                    </div>
                  )}
                </AsyncPanel>
              ) : (
                <AsyncPanel state={userDetail} height="h-40">
                  {(data) => (
                    <AccountDetailsContent
                      data={data}
                      onViewAll={() => { setTransPage(1); setDetailView('transactions') }}
                    />
                  )}
                </AsyncPanel>
              )}

              {detailView === 'ip' && (
                <AnchoredPanel anchorRef={detailTabsRef} onClose={closeDetail} className="w-[320px]">
                  <AsyncPanel state={activity} height="h-32">
                    {(data) => <IpStatContent data={data} />}
                  </AsyncPanel>
                </AnchoredPanel>
              )}

              {detailView === 'activity' && (
                <AnchoredPanel anchorRef={detailTabsRef} onClose={closeDetail} className="w-[340px]">
                  <AsyncPanel state={activity} height="h-32">
                    {(data) => <ActivityLogContent data={data} />}
                  </AsyncPanel>
                </AnchoredPanel>
              )}

              {detailView === 'message' && (
                <AnchoredPanel anchorRef={detailTabsRef} onClose={closeDetail} className="w-[420px]">
                  <MessageUserContent user={selected} onSent={closeDetail} />
                </AnchoredPanel>
              )}
            </>
          )}
        </div>
      </div>

      {appStatOpen && (
        <AppStatModal
          anchorRef={appStatBtnRef}
          onClose={() => setAppStatOpen(false)}
          stats={overview.data?.app_stats}
        />
      )}
    </div>
  )
}

function SalesUserAccountDetails({ data }: { data: ManagerDetail }) {
  const { manager, station, totals } = data

  const totalSales =
    `${totals.volume_litres.toLocaleString('en-NG')} L` +
    (totals.gas_kg > 0 ? ` · ${totals.gas_kg.toLocaleString('en-NG')} kg` : '')

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-500">
            {manager.full_name.charAt(0)}
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-900">{manager.full_name}</p>
            <p className="text-xs text-gray-400">ID: {manager.manager_id}</p>
          </div>
        </div>
        <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium', MANAGER_BADGE[manager.status])}>
          ● {manager.status_label}
        </span>
      </div>
      <div className="space-y-2 border-t pt-3 text-sm">
        <Row label="Registered Email" value={manager.email} />
        <Row label="Registered Phone Number" value={manager.phone} />
        <Row label="Assigned Station" value={station?.name ?? '—'} />
        <Row label="Station ID" value={station?.station_code ?? '—'} />
        <Row label="Total sales" value={totalSales} valueColor="text-green-600" />
        <Row label="Total Revenue" value={formatNaira(totals.revenue)} valueColor="text-blue-600" />
      </div>
    </div>
  )
}

function Row({ label, value, valueColor = 'text-gray-900' }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500">{label}</span>
      <span className={`font-medium ${valueColor}`}>{value}</span>
    </div>
  )
}

function ManagerConfirmBar({
  view,
  actions,
  busy,
  onConfirm,
  onCancel,
}: {
  view: 'restrict' | 'remove'
  actions?: ManagerDetail['actions']
  busy: boolean
  onConfirm: (action: ManagerAction) => void
  onCancel: () => void
}) {
  const action: ManagerAction =
    view === 'restrict'
      ? actions?.can_unsuspend ? 'unsuspend' : 'suspend'
      : actions?.can_restore ? 'restore' : 'remove'

  return (
    <ConfirmBar
      {...MANAGER_CONFIRM[action]}
      loading={busy}
      onConfirm={() => onConfirm(action)}
      onCancel={onCancel}
    />
  )
}

function ConfirmBar({
  message,
  actionLabel,
  loadingLabel,
  loading = false,
  tone,
  onConfirm,
  onCancel,
}: {
  message: string
  actionLabel: string
  loadingLabel?: string
  loading?: boolean
  tone: 'danger' | 'success'
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="flex items-center gap-4 rounded-lg bg-gray-50 px-3 py-2 text-xs">
      <span className="text-gray-500">{message}</span>
      <button
        onClick={onConfirm}
        disabled={loading}
        className={cn(
          'flex items-center gap-1.5 font-medium disabled:cursor-not-allowed disabled:opacity-70',
          tone === 'danger' ? 'text-red-600' : 'text-green-600'
        )}
      >
        {loading && <Loader2 className="h-3 w-3 animate-spin" />}
        {loading ? (loadingLabel ?? 'Please wait…') : actionLabel}
      </button>
      <button
        onClick={onCancel}
        disabled={loading}
        className="text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Cancel
      </button>
    </div>
  )
}