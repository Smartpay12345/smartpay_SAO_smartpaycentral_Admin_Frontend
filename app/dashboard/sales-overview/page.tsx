'use client'

import { useState } from 'react'
import { StatCard } from '@/components/dashboard/stat-card'
import { SalesOverviewHeader } from '@/components/dashboard/sales-overview-header'
import { SalesByProductType, type ProductTypeDatum } from '@/components/dashboard/sales-by-product-type'
import { PeakSalesHours, type PeakHourDatum } from '@/components/dashboard/peak-sales-hours'
import { SalesPerformanceChart, type SalesPerformanceDatum } from '@/components/dashboard/sales-performance-chart'
import { formatCurrencyFull } from '@/lib/utils/format'
import { Liter, Trans, Tsales, Circle, ArrowDown, ArrowUp, RoundedArr } from '@/components/icons'


const productTypeData: ProductTypeDatum[] = [
  { name: 'PMS', fullName: 'PMS (Petrol)', value: 297_800_000, color: '#B91C1C' },
  { name: 'DPK', fullName: 'DPK (Kerosene)', value: 91_600_000, color: '#2563EB' },
  { name: 'LPG', fullName: 'LPG (Gas)', value: 45_800_000, color: '#F59E0B' },
  { name: 'HNK', fullName: 'HNK (Diesel)', value: 22_900_000, color: '#10B981' },
]

const peakHoursData: PeakHourDatum[] = [
  { hour: '6am', value: 20, isPeak: false },
  { hour: '9am', value: 35, isPeak: false },
  { hour: '12pm', value: 95, isPeak: true },
  { hour: '3pm', value: 78, isPeak: true },
  { hour: '6pm', value: 30, isPeak: false },
  { hour: '9pm', value: 22, isPeak: false },
  { hour: '12am', value: 62, isPeak: true },
  { hour: '3am', value: 18, isPeak: false },
]

const salesPerformanceData: SalesPerformanceDatum[] = [
  { month: 'Jan', date: '2026-01-15', value: 22_000_000, volume: 40_000 },
  { month: 'Feb', date: '2026-02-15', value: 30_000_000, volume: 55_000 },
  { month: 'Mar', date: '2026-03-15', value: 52_000_000, volume: 70_000 },
  { month: 'Apr', date: '2026-04-15', value: 40_000_000, volume: 62_000 },
  { month: 'May', date: '2026-05-15', value: 25_000_000, volume: 90_000 },
  { month: 'Jun', date: '2026-06-15', value: 30_000_000, volume: 110_000 },
  { month: 'Jul', date: '2026-07-15', value: 60_000_000, volume: 95_000 },
  { month: 'Aug', date: '2026-08-15', value: 84_200_000, volume: 120_000 },
  { month: 'Sep', date: '2026-09-15', value: 45_000_000, volume: 100_000 },
  { month: 'Oct', date: '2026-10-15', value: 30_000_000, volume: 130_000 },
  { month: 'Nov', date: '2026-11-15', value: 42_000_000, volume: 150_000 },
  { month: 'Dec', date: '2026-12-15', value: 60_000_000, volume: 170_000 },
]

export default function SalesOverviewPage() {
  const [period, setPeriod] = useState('This Month')

  function handleExport() {
    // TODO: wire to your report export endpoint
    console.log('Export report for', period)
  }

  return (
    <div className="space-y-6">
      <SalesOverviewHeader
        selectedPeriod={period}
        onPeriodChange={setPeriod}
        onExport={handleExport}
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">


        <StatCard
          icon={<Tsales className="h-5 w-5 text-primary" />}
          iconBgColor="bg-pink-50"
          label="Total Sales"
          value={formatCurrencyFull(458_250_000)}
          trend={{
            icon: <ArrowUp />,
            changeValue: '+90.8%',
            changeValueColor: 'text-green-600',
            changeLabel: 'vs last week',
            changeLabelColor: 'text-gray-400 ml-0.5',
          }}
        />
        <StatCard
          icon={<Liter className="h-5 w-5 text-primary" />}
          iconBgColor="bg-blue-50"
          label="Total Liters Sold"
          value="685,420 L"
          trend={{
            icon: <ArrowUp />,
            changeValue: '+90.8%',
            changeValueColor: 'text-green-600 ml-0.5',
            changeLabel: 'vs last week',
            changeLabelColor: 'text-gray-400',
          }}
        />
        <StatCard
          icon={<Trans className="h-5 w-5 text-primary" />}
          iconBgColor="bg-green-50"
          label="Transaction Counts"
          value="12,450"
          trend={{
            icon: <ArrowDown />,
            changeValue: '+90.8%',
            changeValueColor: 'text-red-600 ml-0.5',
            changeLabel: 'vs last week',
            changeLabelColor: 'text-gray-400',
          }}
        />
        <StatCard
          icon={<Circle className="h-5 w-5 text-primary" />}
          iconBgColor="bg-[#FCDBD8]"
          label="Sales Growth"
          value="+14.2%"
          trend={{
            icon: <RoundedArr />,
            changeValue: 'on track for',
            changeValueColor: 'text-green-600 ml-0.5',
            changeLabel: 'Q3 target',
            changeLabelColor: 'text-gray-400',
          }}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SalesByProductType data={productTypeData} />
        <PeakSalesHours data={peakHoursData} />
      </div>

      <SalesPerformanceChart data={salesPerformanceData} />
    </div>
  )
}