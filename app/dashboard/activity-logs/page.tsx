'use client'

import { useState } from 'react'
import { FilterDropdown } from '@/components/dashboard/filter-dropdown'
import { ExportButton
 } from '@/components/shared/export-button'
import { Pagination } from '@/components/dashboard/pagination'
import { ActivityLogRow } from '@/components/dashboard/activity-logs/activity-log-row'
import type { ActivityLog } from '@/lib/types/activity-log'
import type { ExportColumn } from '@/lib/export'
import { Archive, Pencil, UserRoundPlus  } from 'lucide-react'
import { Warn } from '@/components/icons'

const logs: ActivityLog[] = [
  { id: '1', userName: 'Oluwagbotemi O.', userRole: 'Admin', action: 'Updated Fuel Price', actionIcon: <Pencil className='h-3 w-3'/>, actionDetail: 'Changed PMS price to ₦650/L', target: 'All Stations (Global)', dateTime: 'Today, 14:32 Oct 24, 2024', ipAddress: '192.168.1.105', status: 'success' },
  { id: '2', userName: 'Sarah Ahmed', userRole: 'Station Manager', action: 'Recorded Delivery', actionIcon: <Archive className='text-[#1E5EAC] w-4 h-3-4' />, actionDetail: 'Added 33,000L AGO', target: 'Lekki Phase 1', dateTime: 'Today, 11:15 Oct 24, 2024', ipAddress: '105.112.45.22', status: 'success' },
  { id: '3', userName: 'Unknown System', userRole: 'Automated', action: 'Failed Login Attempt', actionIcon: <Warn className='h-4 w-4'/>, actionDetail: "Invalid credentials for 'admin'", target: 'Admin Portal', dateTime: 'Yesterday, 23:45 Oct 23, 2024', ipAddress: '45.22.19.100', status: 'failed' },
  { id: '4', userName: 'Oluwagbotemi O.', userRole: 'Admin', action: 'Created Staff Profile', actionIcon: <UserRoundPlus className='text-primary h-4v w-4'/>, actionDetail: "Added 'John Doe' (Cashier)", target: 'Ikeja Branch', dateTime: 'Yesterday, 16:20 Oct 23, 2024', ipAddress: '192.168.1.105', status: 'success' },
]

const exportColumns: ExportColumn<ActivityLog>[] = [
  { key: 'userName', header: 'User' },
  { key: 'action', header: 'Action' },
  { key: 'target', header: 'Target/Station' },
  { key: 'dateTime', header: 'Date & Time' },
  { key: 'ipAddress', header: 'IP Address' },
  { key: 'status', header: 'Status' },
]

export default function ActivityLogsPage() {
  const [page, setPage] = useState(1)
  const [dateFilter, setDateFilter] = useState('Last 7 Days')

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">System Activities</h1>
          <p className="text-sm text-gray-500">Audit trail of all administrative and user actions across the platform.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <FilterDropdown options={['Last 7 Days', 'Last 30 Days', 'Today']} value={dateFilter} onChange={setDateFilter} />
          <FilterDropdown options={['All Actions', 'Success', 'Failed']} value="Filter" onChange={() => {}} />
          <ExportButton data={logs} columns={exportColumns} filename="activity-logs" title="System Activity Log" formats={['csv']} label="Export CSV" />
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs">
                <th className="py-2 font-normal">USER</th>
                <th className="py-2 font-normal">ACTION TAKEN</th>
                <th className="py-2 font-normal">TARGET / STATION</th>
                <th className="py-2 font-normal">DATE & TIME</th>
                <th className="py-2 font-normal">IP ADDRESS</th>
                <th className="py-2 font-normal">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <ActivityLogRow key={log.id} log={log} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <Pagination currentPage={page} totalPages={62} totalItems={248} itemsPerPage={4} onPageChange={setPage} />
        </div>
      </div>
    </div>
  )
}