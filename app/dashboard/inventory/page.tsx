'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { AddBranchModal } from '@/components/dashboard/inventory/add-branch-modal'
import { StateColumn } from '@/components/dashboard/inventory/state-column'
import { FilterDropdown } from '@/components/dashboard/filter-dropdown'
import { ExportButton } from '@/components/shared/export-button'
import { StationDetailModal } from '@/components/dashboard/inventory/station-detail-modal'
import { StaffOverviewModal } from '@/components/dashboard/inventory/staff-overview-modal'
import { PumpMetricsModal } from '@/components/dashboard/inventory/pump-metrics-modal'
import type { Branch } from '@/lib/types/inventory'
import { MdiLocation, Streamline, Icon } from '@/components/icons'
import { TransactionTable, type Transaction } from '@/components/dashboard/transactions/transaction-table'
import type { ExportColumn } from '@/lib/export'

const initialBranches: Record<string, Branch[]> = {
  Lagos: [
    { id: '1', name: 'Lekki lagos', createdDate: 'June 12th 2026', state: 'Lagos', percentChange: 8.5, status: 'healthy' },
    { id: '2', name: 'Ogba, Lagos', createdDate: 'June 12th 2026', state: 'Lagos', percentChange: 8.5, status: 'refill-required' },
    { id: '3', name: 'Oshodi lagos', createdDate: 'June 12th 2026', state: 'Lagos', percentChange: 0.5, status: 'not-accessible' },
    { id: '4', name: 'Epe lagos', createdDate: 'June 12th 2026', state: 'Lagos', percentChange: 0.5, status: 'not-accessible' },
    { id: '5', name: 'Epe lagos', createdDate: 'June 12th 2026', state: 'Lagos', percentChange: 0.5, status: 'not-accessible' },
    { id: '6', name: 'Epe lagos', createdDate: 'June 12th 2026', state: 'Lagos', percentChange: 0.5, status: 'not-accessible' },
  ],
  Oyo: [
    { id: '7', name: 'Idi Ape Ibadan', createdDate: 'June 12th 2026', state: 'Oyo', percentChange: 8.5, status: 'healthy' },
    { id: '8', name: 'Akobo Ibadan', createdDate: 'June 12th 2026', state: 'Oyo', percentChange: 8.5, status: 'healthy' },
    { id: '9', name: 'Iwo road Ibadan', createdDate: 'June 12th 2026', state: 'Oyo', percentChange: 0.5, status: 'not-accessible' },
    { id: '10', name: 'Alakia, Ibadan', createdDate: 'June 12th 2026', state: 'Oyo', percentChange: 8.5, status: 'refill-required' },
    { id: '11', name: 'Alakia, Ibadan', createdDate: 'June 12th 2026', state: 'Oyo', percentChange: 8.5, status: 'refill-required' },
    { id: '12', name: 'Alakia, Ibadan', createdDate: 'June 12th 2026', state: 'Oyo', percentChange: 8.5, status: 'refill-required' },
  ],
}

const exportColumns: ExportColumn<Transaction>[] = [
  { key: 'id', header: 'Transaction ID' },
  { key: 'date', header: 'Date' },
  { key: 'station', header: 'Station' },
  { key: 'product', header: 'Product' },
  { key: 'amount', header: 'Amount', formatter: (value) => `₦${value}` },
  {
    key: 'status',
    header: 'Status',
    formatter: (value) => (typeof value === 'string' ? value.charAt(0).toUpperCase() + value.slice(1) : String(value)),
  },
]

const transactions: Transaction[] = [
  { id: 'INV-2025-0045', date: 'Oct 24, 2025', time: '14:32 PM', station: 'SAO Ikeja', product: 'PMS (Petrol)', productDetail: '25.00 L @ ₦650', amount: '16,250.00', status: 'completed' },
  { id: 'INV-2025-0047', date: 'Oct 24, 2025', time: '15:45 PM', station: 'SAO Abuja', product: 'PMS (Petrol)', productDetail: '50.00 L @ ₦650', amount: '32,500.00', status: 'pending' },
  { id: 'INV-2025-0047', date: 'Oct 24, 2025', time: '15:45 PM', station: 'SAO Abuja', product: 'PMS (Petrol)', productDetail: '50.00 L @ ₦650', amount: '32,500.00', status: 'pending' },
  { id: 'INV-2025-0047', date: 'Oct 24, 2025', time: '15:45 PM', station: 'SAO Abuja', product: 'PMS (Petrol)', productDetail: '50.00 L @ ₦650', amount: '32,500.00', status: 'pending' },
]
const stationDetailData = {
  name: 'This Station',
  fuelStocks: [
    { label: 'Petrol (PMS)', fuelType: 'pms', tank: 'Tank 1 & 2', current: 14250, capacity: 33000, unit: 'L' as const, status: 'low' as const, note: '↘ Est. 2.5 days remaining' },
    { label: 'Kerosene (DPK)',  fuelType: 'dpk', tank: 'Tank 4', current: 8750, capacity: 10000, unit: 'L' as const, status: 'healthy' as const, note: '✓ Healthy stock level' },
    { label: 'Diesel (AGO)', fuelType: 'ago', tank: 'Tank 3', current: 2100, capacity: 15000, unit: 'L' as const, status: 'critical' as const, note: '⚠ Refill required today' },
    { label: 'Cooking Gas (LPG)', fuelType: 'lpg', tank: 'Skid Plant', current: 1250, capacity: 5000, unit: 'KG' as const, status: 'monitor' as const, note: '⚡ Monitor closely' },
  ],
  todayDate: '24 AUG',
  totalSales: '538,380.45',
  noOfSales: 300,
  monthTotal: '30,023,452.21',
}

const staffData = Array.from({ length: 9 }, (_, i) => ({
  name: 'Pristia Candra',
  email: 'lincoln@unpixel.com',
  phone: '08092139441',
  role: i === 0 ? 'Manager' : 'Sales Point Staff',
  dateJoined: '01 Mar 2023',
  status: (i === 1 || i === 7 || i === 8 ? 'suspended' : 'active') as 'active' | 'suspended',
}))

const pumpMetricsData = {
  stationId: 'SAO - 21182',
  location: 'Ibadan OY',
  totalAmountSales: '₦538,380.45',
  expenseMonth: '24 August 2026',
  expenses: [
    { product: 'PMS | Petrol', amount: '103,400.00', liters: '300 Liters', buyer: 55 },
    { product: 'DPK | Diesel', amount: '163,400.00', liters: '300 Liters', buyer: 55 },
    { product: 'HNK | Kerosene', amount: '103,400.00', liters: '300 Liters', buyer: 55 },
    { product: 'LPG | Cooking Gas', amount: '103,400.00', liters: '300 Kgrms', buyer: 55 },
  ],
  pumps: [
    { name: 'Pump 01 (PMS)', status: 'Active', opening: 45120.5, closing: 49870.5, dispensed: 4750 },
    { name: 'Pump 02 (PMS)', status: 'Active', opening: 12050, closing: 16800, dispensed: 4750 },
    { name: 'Pump 03 (PMS)', status: 'Active', opening: 12050, closing: 16800, dispensed: 4750 },
    { name: 'Pump 04 (PMS)', status: 'Active', opening: 12050, closing: 16800, dispensed: 4750 },
  ],
}

export default function InventoryPage() {
  const [branches, setBranches] = useState(initialBranches)
  const [addBranchOpen, setAddBranchOpen] = useState(false)
  const [addBranchState, setAddBranchState] = useState<string | undefined>(undefined)
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const [stationModalOpen, setStationModalOpen] = useState(false)
  const [staffModalOpen, setStaffModalOpen] = useState(false)
  const [pumpModalOpen, setPumpModalOpen] = useState(false)
   const scrollRef = useRef<HTMLDivElement>(null)
   const [period, setPeriod] = useState('This Month')


   function scrollStates(direction: 'left' | 'right') {
    scrollRef.current?.scrollBy({ left: direction === 'right' ? 300 : -300, behavior: 'smooth' })
  }



  function handleBranchClick(branch: Branch) {
    setSelectedBranch(branch)
    setStationModalOpen(true)
  }

   function openAddBranch(stateKey?: string) {
    setAddBranchState(stateKey)
    setAddBranchOpen(true)
  }

  function handleBranchCreated(values: { branchName: string; locationState: string }) {
    const newBranch: Branch = {
      id: crypto.randomUUID(),
      name: values.branchName,
      createdDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      state: values.locationState,
      percentChange: 0,
      status: 'healthy',
    }
    setBranches((prev) => ({
      ...prev,
      [values.locationState]: [...(prev[values.locationState] ?? []), newBranch],
    }))
  }

    const stateEntries = Object.entries(branches)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Inventory Stations Record</h1>
          <p className="text-sm text-gray-500">View and manage all fuel and service transactions across stations.</p>
        </div>
         <div className="flex flex-wrap gap-3">
          <FilterDropdown icon={<Icon/>} options={['This Month', 'This Week', 'This Year']} value={period} onChange={setPeriod} />
          <ExportButton data={transactions} columns={exportColumns} filename="transactions" title="Transaction Report" />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          placeholder="Search here..."
          className="w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm outline-none sm:max-w-xs"
        />
        <Button onClick={() => openAddBranch(undefined)}
         variant="outline"
  className="whitespace-nowrap text-primary font-bold">
          <MdiLocation/> Add new branch / Location
        </Button>
      </div>

       <div className="relative">
        <div
          ref={scrollRef}
          className="no-scrollbar flex snap-x items-start gap-6 overflow-x-auto scroll-smooth pb-2"
        >
          {stateEntries.map(([state, list]) => (
           <StateColumn
              key={state}
              stateKey={state}
              stateName={`${state} State`}
              counts={{
                total: list.length,
                healthy: list.filter((b) => b.status === 'healthy').length,
                issues: list.filter((b) => b.status !== 'healthy').length,
              }}
              branches={list}
              onBranchClick={handleBranchClick}
              onAddBranch={openAddBranch}
            />
          ))}
        </div>

     {stateEntries.length > 4 && (
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
      <Streamline className='h-6 w-6'/>
    </button>
  </>
)}
      </div>
    

     <AddBranchModal
        key={addBranchState ?? 'none'}
        open={addBranchOpen}
        onOpenChange={setAddBranchOpen}
        onCreated={handleBranchCreated}
        defaultState={addBranchState}
      />

      <StationDetailModal
        station={selectedBranch ? stationDetailData : null}
        open={stationModalOpen}
        onOpenChange={setStationModalOpen}
        onManageStation={() => { setStationModalOpen(false); setStaffModalOpen(true) }}
        onCheckOrder={() => { /* wire to manage-orders flow later */ }}
        onViewOverview={() => { setStationModalOpen(false); setPumpModalOpen(true) }}
      />
 
      <StaffOverviewModal
        staff={staffData}
        open={staffModalOpen}
        onOpenChange={setStaffModalOpen}
        onCheckOrder={() => { /* wire to manage-orders flow later */ }}
      />

      <PumpMetricsModal
        data={pumpModalOpen ? pumpMetricsData : null}
        open={pumpModalOpen}
        onOpenChange={setPumpModalOpen}
        onBack={() => { setPumpModalOpen(false); setStationModalOpen(true) }}
      />
    </div>
  )
}