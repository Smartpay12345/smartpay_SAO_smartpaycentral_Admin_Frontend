'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FilterDropdown } from '@/components/dashboard/filter-dropdown'
import { ExportButton } from '@/components/shared/export-button'
import { StatCard } from '@/components/dashboard/stat-card'
import { Pagination } from '@/components/dashboard/pagination'
import { ManagerTable } from '@/components/dashboard/managers/manager-table'
import { ManagerOverviewModal } from '@/components/dashboard/managers/manager-overview-modal'
import { AddManagerModal } from '@/components/dashboard/managers/add-manager-modal'
import type { Manager } from '@/lib/types/manager'
import type { ExportColumn } from '@/lib/export'
import { Location, Suspended, Success, Manage, Icon } from '@/components/icons'

const initialManagers: Manager[] = [
  { id: '1', name: 'Folakemi Adeyemi', managerId: 'MGR-8492', email: 'f.adeyemi@saofuelpay.com', phone: '+234 801 234 5678', assignedStation: 'Idi Ape Branch', location: 'Ibadan, OY', status: 'active', lastActive: '2 mins ago', joinedYear: '2021', yearsOfService: 3, totalSales: '₦125.4m', totalRevenue: '₦12.5m' },
  { id: '2', name: 'Sarah Jenkins', managerId: 'MGR-7731', email: 's.jenkins@saofuelpay.com', phone: '+234 802 345 6789', assignedStation: 'Akobo Branch', location: 'Ibadan, OY', status: 'active', lastActive: '2 mins ago', joinedYear: '2022', yearsOfService: 2, totalSales: '₦98.2m', totalRevenue: '₦9.1m' },
  { id: '3', name: 'Marcus Johnson', managerId: 'MGR-9102', email: 'm.johnson@saofuelpay.com', phone: '+234 803 456 7890', assignedStation: 'Iwo Road Branch', location: 'Ibadan, OY', status: 'active', lastActive: '2 mins ago', joinedYear: '2020', yearsOfService: 4, totalSales: '₦150.1m', totalRevenue: '₦15.3m' },
  { id: '4', name: 'Robert Chen', managerId: 'MGR-8492', email: 'r.chen@saofuelpay.com', phone: '+234 804 567 8901', assignedStation: 'Epe Branch', location: 'Lagos, LAG', status: 'active', lastActive: '2 mins ago', joinedYear: '2021', yearsOfService: 3, totalSales: '₦112.7m', totalRevenue: '₦11.0m' },
  { id: '5', name: 'Elena Rodriguez', managerId: 'MGR-4421', email: 'e.rodriguez@saofuelpay.com', phone: '+234 805 678 9012', assignedStation: 'Garki Branch', location: 'Garki, ABJ', status: 'active', lastActive: '2 mins ago', joinedYear: '2023', yearsOfService: 1, totalSales: '₦60.3m', totalRevenue: '₦5.8m' },
]

const exportColumns: ExportColumn<Manager>[] = [
  { key: 'name', header: 'Name' },
  { key: 'managerId', header: 'Manager ID' },
  { key: 'assignedStation', header: 'Assigned Station' },
  { key: 'location', header: 'Location' },
  { key: 'status', header: 'Status' },
]

export default function ManagersPage() {
  const [managers, setManagers] = useState(initialManagers)
  const [selected, setSelected] = useState<Manager | null>(null)
  const [overviewOpen, setOverviewOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [page, setPage] = useState(1)
//   const [statusFilter, setStatusFilter] = useState('All Status')

  function handleStatusChange(managerId: string, newStatus: 'active' | 'suspended' | 'removed') {
    setManagers((prev) =>
      newStatus === 'removed'
        ? prev.filter((m) => m.id !== managerId)
        : prev.map((m) => (m.id === managerId ? { ...m, status: newStatus } : m))
    )
  }

  const totalManagers = 142
  const active = managers.filter((m) => m.status === 'active').length
  const suspended = managers.filter((m) => m.status === 'suspended').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Managers Directory</h1>
          <p className="text-sm text-gray-500">Manage station administrators and operations personnel.</p>
        </div>
        <div className="flex gap-3">
          <FilterDropdown icon={<Icon/>} options={['All Filters', 'By Station', 'By Status']} value="Filters" onChange={() => {}} />
          <ExportButton data={managers} columns={exportColumns} filename="managers" title="Managers Report" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4  mt-4">
        <StatCard icon={<Manage/>} iconBgColor="bg-red-50" label="Total Managers" value={String(totalManagers)} iconPosition='right' />
        <StatCard icon={<Success/>} iconBgColor="bg-green-50" label="Active" value={String(active)} valueColor="text-green-600"  iconPosition='right'/>
        <StatCard icon={<Location/>} iconBgColor="bg-blue-50" label="Location" value="112" iconPosition='right' valueColor="text-[#1E5EAC]" />
        <StatCard icon={<Suspended/>} iconBgColor="bg-red-50" label="Suspended" value={String(suspended)} valueColor="text-[#BA1A1A]" iconPosition='right' />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          placeholder="Search here..."
          className="w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm outline-none sm:max-w-xs"
        />
        <Button onClick={() => setAddOpen(true)} className="bg-[#007AFD] hover:bg-[#0062DB]">+ Add Manager</Button>
      </div>

      <div className="">
        <ManagerTable
          managers={managers}
          onLearnMore={(m) => { setSelected(m); setOverviewOpen(true) }}
        />
        <div className="mt-4">
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(totalManagers / 5)}
            totalItems={totalManagers}
            itemsPerPage={5}
            onPageChange={setPage}
          />
        </div>
      </div>

      <ManagerOverviewModal
        manager={selected}
        open={overviewOpen}
        onOpenChange={setOverviewOpen}
        onStatusChange={handleStatusChange}
      />

      <AddManagerModal
        open={addOpen}
        onOpenChange={setAddOpen}
        onCreated={(values) => {
          const newManager: Manager = {
            id: crypto.randomUUID(),
            name: values.fullName,
            managerId: values.managerId,
            email: values.email,
            phone: values.phone,
            assignedStation: values.assignedStation,
            location: '—',
            status: 'active',
            lastActive: 'Just now',
            joinedYear: String(new Date().getFullYear()),
            yearsOfService: 0,
            totalSales: '₦0',
            totalRevenue: '₦0',
          }
          setManagers((prev) => [newManager, ...prev])
        }}
      />
    </div>
  )
}