'use client'


import { useState } from 'react'
import { Search } from 'lucide-react'
import { FilterDropdown } from '@/components/dashboard/filter-dropdown'
import { Pagination } from '@/components/dashboard/pagination'
import { ExportButton } from '@/components/shared/export-button'
import { ProductStatCard } from '@/components/dashboard/transactions/product-stat-card'
import { TransactionTable, type Transaction } from '@/components/dashboard/transactions/transaction-table'
import { TransactionDetailModal } from '@/components/dashboard/transactions/transaction-detail-modal'
import { StationTransactionTable } from '@/components/dashboard/transactions/station-transaction-table'
import { BestSellingStation } from '@/components/dashboard/transactions/best-selling-station'
import type { ExportColumn } from '@/lib/export'
import { StationDetailModal } from '@/components/dashboard/transactions/station-detail-modal'
import { Fire, Iconpetrol, RedD, Tank, Dollar, Sales, Icon } from '@/components/icons'
import { TransactionSummaryCard } from '@/components/dashboard/transactions/transaction-summary-card'

interface StationRow {
  stationId: string
  location: string
  totalSales: string
  amount: string
  noOfSales: number
  date: string
}


const transactions: Transaction[] = [
  { id: 'INV-2025-0045', date: 'Oct 24, 2025', time: '14:32 PM', station: 'SAO Ikeja', product: 'PMS (Petrol)', productDetail: '25.00 L @ ₦650', amount: '16,250.00', status: 'completed' },
  { id: 'INV-2025-0047', date: 'Oct 24, 2025', time: '15:45 PM', station: 'SAO Abuja', product: 'PMS (Petrol)', productDetail: '50.00 L @ ₦650', amount: '32,500.00', status: 'pending' },
  { id: 'INV-2025-0047', date: 'Oct 24, 2025', time: '15:45 PM', station: 'SAO Abuja', product: 'PMS (Petrol)', productDetail: '50.00 L @ ₦650', amount: '32,500.00', status: 'pending' },
  { id: 'INV-2025-0047', date: 'Oct 24, 2025', time: '15:45 PM', station: 'SAO Abuja', product: 'PMS (Petrol)', productDetail: '50.00 L @ ₦650', amount: '32,500.00', status: 'pending' },
]

const stationRows = Array.from({ length: 8 }, () => ({
  stationId: 'SAO - 21182',
  location: 'Idi Ape, Ibadan',
  totalSales: 'Total Sales',
  amount: '5,323,321.00',
  noOfSales: 500,
  date: 'Today',
}))

const bestSelling = [
  { name: 'Lekki, Lagos', amount: '300 million plus', percent: 100 },
  { name: 'Epe, Lagos', amount: '231 million plus', percent: 77 },
  { name: 'Oshodi, Lagos', amount: '121 million plus', percent: 40 },
  { name: 'Idi Ape, Ibadan', amount: '121 million plus', percent: 40 },
  { name: 'Akobo, Ibadan', amount: '121 million plus', percent: 40 },
]

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

const stationDetailData = {
  id: 'SAO - 21182',
  location: 'Ibadan Oyo State.',
  managerName: 'Oluwagbotemi Babatunde',
  products: [
    { label: 'Petrol (PMS)', sold: '1500 sold', capacity: '55,000 Liters', percent: 3 },
    { label: 'Kerosene (HNK)', sold: '1500 sold', capacity: '55,000 Liters', percent: 3 },
    { label: 'Diesel (DPK)', sold: '50,000 sold', capacity: '55,000 Liters', percent: 91 },
    { label: 'Natural Cooking Gas (NPG)', sold: '45,600 sold', capacity: '55,000 Kg', percent: 83 },
  ],
  pumps: [
    { name: 'Pump 1', noOfSales: 321, initial: '55,000', remaining: '25,000', percent: 55 },
    { name: 'Pump 1', noOfSales: 321, initial: '55,000', remaining: '25,000', percent: 55 },
  ],
}

export default function TransactionsPage() {
  const [tab, setTab] = useState<'general' | 'station'>('general')
  const [selected, setSelected] = useState<Transaction | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [period, setPeriod] = useState('This Month')
  const [typeFilter, setTypeFilter] = useState('All Transactions')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [dateFilter, setDateFilter] = useState('Last 30 Days')
  const [page, setPage] = useState(1)
  const [stationModalOpen, setStationModalOpen] = useState(false)
  const [selectedStation, setSelectedStation] = useState<StationRow | null>(null)


  function handleRowClick(txn: Transaction) {
    setSelected(txn)
    setModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#111827]">General Transactions Overview</h1>
          <p className="text-sm text-gray-500">View and manage all fuel and service transactions across stations.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <FilterDropdown icon={<Icon />} options={['This Month', 'This Week', 'This Year']} value={period} onChange={setPeriod} />
          <ExportButton data={transactions} columns={exportColumns} filename="transactions" title="Transaction Report" />
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto border-b text-sm">
        <button
          onClick={() => setTab('general')}
          className={tab === 'general' ? 'shrink-0 whitespace-nowrap border-b-2 border-[#1A42E2] pb-2 font-medium text-[#1A42E2]' : 'shrink-0 whitespace-nowrap pb-2 text-gray-400'}
        >
          General Transactions
        </button>
        <button
          onClick={() => setTab('station')}
          className={tab === 'station' ? 'shrink-0 whitespace-nowrap border-b-2 border-[#1A42E2] pb-2 font-medium text-[#1A42E2]' : 'shrink-0 whitespace-nowrap pb-2 text-gray-400'}
        >
          Station Transactions
        </button>
      </div>

      {tab === 'general' ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
            <ProductStatCard icon={<Iconpetrol />} iconBg="bg-red-50" name="PMS" subtitle="Petrol" amount="₦28,996,08" quantity="878" unit="Liters" />
            <ProductStatCard icon={<RedD />} iconBg="bg-blue-50" name="DPK" subtitle="Diesel" amount="₦12,996,08" quantity="302" unit="Liters" />
            <ProductStatCard icon={<Fire />} iconBg="bg-blue-50" name="LPG" subtitle="Natural Cooking Gas" amount="₦38,996,08" quantity="2975" unit="Kilograms" />
            <ProductStatCard icon={<Tank />} iconBg="bg-blue-50" name="HNK" subtitle="Kerosene" amount="₦20,996,08" quantity="92" unit="Liters" />
          </div>



          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <TransactionSummaryCard
              icon={<Dollar />}
              iconBg="bg-red-50"
              label="Total Income"
              subtext="Income for the last 6 months"
              value="₦194,250,0.05"
              trendValue="23.7%"
              trendDirection="up"
            />

            <TransactionSummaryCard
              icon={<Dollar />}
              iconBg="bg-red-50"
              label="Total Cash back"
              subtext="Transactions for the last 6 months"
              value="₦50,134,40.97"
              trendValue="12.3%"
              trendDirection="up"
            />

            <TransactionSummaryCard
              icon={<Sales className='text-primary' />}
              iconBg="bg-red-50"
              label="Number of sales"
              subtext="Total numbers of sales/transactions"
              value="22,500"
              trendValue="1.6%"
              trendDirection="down"
            />
          </div>

          <div className="rounded-xl border bg-white p-4">
            <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-medium">Transaction History</h2>
                <p className="text-xs text-gray-400">View and manage all fuel and service transactions across stations.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <FilterDropdown options={['All Transactions', 'PMS', 'DPK', 'LPG', 'HNK']} value={typeFilter} onChange={setTypeFilter} />
                <FilterDropdown options={['All Status', 'Completed', 'Pending']} value={statusFilter} onChange={setStatusFilter} />
                <FilterDropdown options={['Last 30 Days', 'Last 7 Days', 'Today']} value={dateFilter} onChange={setDateFilter} />
              </div>
            </div>

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  placeholder="Search with Ref/Transaction number here"
                  className="w-full rounded-lg border bg-gray-50 py-2 pl-9 text-sm outline-none"
                />
              </div>
              <button className="text-sm font-medium text-primary">See all</button>
            </div>

            <div className="overflow-x-auto">
              <TransactionTable transactions={transactions} onRowClick={handleRowClick} />
            </div>

            <div className="mt-4">
              <Pagination currentPage={page} totalPages={979} totalItems={4892} itemsPerPage={5} onPageChange={setPage} />
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-xl border bg-white p-4 lg:col-span-2">
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-medium">Overview</h2>
                <p className="text-xs text-gray-400">View and manage all fuel and service transactions across stations.</p>
              </div>
              <FilterDropdown options={['Today', 'This Week', 'This Month']} value="Today" onChange={() => { }} />
            </div>

            <div className="relative mb-4 w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search with Station ID / location here"
                className="w-full rounded-lg border bg-gray-50 py-2 pl-9 text-sm outline-none"
              />
            </div>

            <StationTransactionTable
              rows={stationRows}
              onRowClick={(row) => { setSelectedStation(row); setStationModalOpen(true) }}
            />

            <StationDetailModal
              open={stationModalOpen}
              onOpenChange={setStationModalOpen}
              station={selectedStation ? stationDetailData : null}
            />
          </div>

          <BestSellingStation stations={bestSelling} />
        </div>
      )}

      <TransactionDetailModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        transaction={
          selected && {
            ...selected,
            stationLocation: 'SAO - 21182, Ibadan Oyo State.',
            managerName: 'Oluwagbotemi Babatunde',
            sessionId: '34254559402851',
            liters: '10.5 liters',
            costPerLiter: '₦1206',
            cashback: '₦12',
            location: 'Akobo branch, Ibadan',
          }
        }
      />
    </div>
  )
}