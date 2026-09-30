// app/dashboard/page.tsx
import Link from 'next/link'
import {
  Receipt,
  PieChart,
  MapPin,
  Users,
  UserCheck,
  Fuel,
  AlertTriangle,
} from 'lucide-react'
import { RedArrowUp, Total, Radius, Arr} from '@/components/icons'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { StatCard } from '@/components/dashboard/stat-card'
import { ProductsChart } from '@/components/dashboard/products-chart'
import { RevenueOverviewChart } from '@/components/dashboard/revenue-overview-chart'
import { PeriodToggle } from '@/components/dashboard/period-toggle'
import { TopPerformingStations } from '@/components/dashboard/top-performing-stations'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { StationsStatus } from '@/components/dashboard/stations-status'


const stationsData = [
  { name: 'SAO Ikeja', sales: '₦23,450,000', liters: '38,650L', txn: 892 },
  { name: 'SAO Ibadan', sales: '₦23,450,000', liters: '38,650L', txn: 892 },
  { name: 'SAO Abuja', sales: '₦23,450,000', liters: '38,650L', txn: 892 },
  { name: 'SAO Osun', sales: '₦23,450,000', liters: '38,650L', txn: 892 },
  { name: 'SAO Akure', sales: '₦23,450,000', liters: '38,650L', txn: 892 },
]

const transactionsData = [
  { id: 'INV-2025-0004892', station: 'SAO Ikeja', amount: '₦5,000', liters: '25.00 L', status: 'completed', time: '2 mins ago' },
  { id: 'INV-2025-0004893', station: 'SAO Ikeja', amount: '₦5,000', liters: '25.00 L', status: 'completed', time: '2 mins ago' },
  { id: 'INV-2025-0004894', station: 'SAO Ikeja', amount: '₦5,000', liters: '25.00 L', status: 'completed', time: '2 mins ago' },
  { id: 'INV-2025-0004895', station: 'SAO Ikeja', amount: '₦5,000', liters: '25.00 L', status: 'completed', time: '2 mins ago' },
  { id: 'INV-2025-0004896', station: 'SAO Ikeja', amount: '₦5,000', liters: '25.00 L', status: 'completed', time: '2 mins ago' },
]

const stationsStatusData = [
  { name: 'SAO Ikeja', status: 'online' },
  { name: 'SAO Lekki', status: 'online' },
  { name: 'SAO Ibadan', status: 'online' },
  { name: 'SAO Abuja', status: 'online' },
  { name: 'SAO Port Harcourt', status: 'maintenance' },
  { name: 'SAO Enugu', status: 'offline' },
]
const productsData = [
  { x: 0, pms: 4000, dpk: 4200, lpg: 1800, hnk: 800 },
  { x: 4, pms: 5200, dpk: 4600, lpg: 2400, hnk: 1600 },
  { x: 8, pms: 7800, dpk: 6200, lpg: 3400, hnk: 2400 },
  { x: 12, pms: 8600, dpk: 7000, lpg: 3800, hnk: 2000 },
  { x: 16, pms: 9200, dpk: 7600, lpg: 4200, hnk: 3000 },
  { x: 22, pms: 9800, dpk: 8200, lpg: 4600, hnk: 2800 },
]

const revenueOverviewData = [
  { month: 'Jan', income: 8, cashback: 3 },
  { month: 'Feb', income: 6, cashback: 4 },
  { month: 'Mar', income: 12, cashback: 6 },
  { month: 'Apr', income: 9, cashback: 5 },
  { month: 'May', income: 14, cashback: 7 },
  { month: 'Jun', income: 11, cashback: 6 },
  { month: 'Jul', income: 18, cashback: 8 },
  { month: 'Aug', income: 26.3, cashback: 8.39 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* header */}
     <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  <div>
  <div className="flex items-center gap-3">
     
      <h1 className="text-lg font-semibold sm:text-xl">
        Hey Oluwagbotemi, Welcome back!
      </h1>
      <Image 
  src="/t.png" 
  alt="Welcome" 
  width={30} 
  height={40} 
  style={{ height: 'auto', width: "auto" }} 
/>
    </div>
    
    <p className="text-sm text-gray-500">
      A summary and overview of your data information regarding SAO fuel pay
    </p>
  </div>
  <div className="flex flex-wrap items-center gap-3">
    <Link href="/dashboard/revenue-analytics" className="flex-1 sm:flex-none">
      <Button className="w-full bg-blue-600 hover:bg-blue-700 sm:w-auto">Revenue</Button>
    </Link>
    <PeriodToggle />
  </div>
</div>

  {/* stat card rows — was: grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 */}
<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          icon={<RedArrowUp/>}
          iconBgColor="bg-[#FEE2E2]"
          label="Total Sales"
          value="₦128,750,000"
          trend={{
    icon: <Arr />,
    changeValue: '+90.8%',
    changeValueColor: 'text-green-600',
    changeLabel: 'vs last week',
    changeLabelColor: 'text-gray-400',
  }}
        />
        <StatCard
          icon={<Receipt className="h-5 w-5 text-red-500" />}
          iconBgColor="bg-red-50"
          label="Total Transactions"
          value="4,892"
                 trend={{
    icon: <Arr />,
    changeValue: '+3.5%',
    changeValueColor: 'text-green-600',
    changeLabel: 'vs last week',
    changeLabelColor: 'text-gray-400',
  }}
        />
        <StatCard
          icon={<Total />}
          iconBgColor="bg-[#FEE2E2]"
          label="Total Liters Sold"
          value="210,456 L"
                trend={{
    icon: <Arr />,
    changeValue: '+10.8%',
    changeValueColor: 'text-green-600',
    changeLabel: 'vs last week',
    changeLabelColor: 'text-gray-400',
  }}
        />
        <StatCard
          icon={<PieChart className="h-5 w-5 text-amber-500" />}
          iconBgColor="bg-[#FFEDD5]"
          label="Gross Profit"
          value="₦24,560,000"
                 trend={{
    icon: <Arr />,
    changeValue: '+12.5%',
    changeValueColor: 'text-green-600',
    changeLabel: 'vs last week',
    changeLabelColor: 'text-gray-400',
  }}
        />
        <StatCard
          icon={<MapPin className="h-5 w-5 text-green-500" />}
          iconBgColor="bg-[#DCFCE7]"
          label="Active Stations"
          value="24"
          subtext="of 28 stations"
        />
      </div>

    {/* stat card rows  */}

  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          icon={<Users className="h-5 w-5 text-[#E50019]" />}
          iconBgColor="bg-[#FEF2F2]"
          label="Total Managers"
          value="28"
          subtext="Active Managers"
        />
        <StatCard
          icon={<UserCheck className="h-5 w-5 text-[#E50019]" />}
          iconBgColor="bg-[#FEF2F2]"
          label="Total Staff"
          value="186"
          subtext="Across all stations"
        />
        <StatCard
          icon={<Fuel className="h-5 w-5 text-[#E50019]" />}
          iconBgColor="bg-[#FEF2F2]"
          label="Total Pumps"
          value="112"
          subtext="Across all stations"
        />
        <StatCard
          icon={<Radius />}
          iconBgColor="bg-[#FEF2F2]"
          label="Total Order"
          value="56"
          subtext="Storage tanks"
        />
        <StatCard
          icon={<AlertTriangle className="h-5 w-5 text-orange-500" />}
          iconBgColor="bg-orange-50"
          label="Low Stock Alerts"
          value="4"
          valueColor="text-orange-500"
          subtext="Require attention"
        />
      </div>

      {/* charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-4">
          <div className="mb-2">
            <h2 className="font-medium">Your Products</h2>
            <p className="text-xs text-gray-400">A statistic of your products on each time.</p>
          </div>
          <ProductsChart data={productsData} />
          <div className="mt-2 flex justify-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-pink-500" /> PMS</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> DPK</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-orange-500" /> LPG</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500" /> HNK</span>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
 {/* Revenue Overview card header — was: flex-col gap-3 sm:flex-row sm:items-center sm:justify-between */}
<div className="mb-2 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
  <div className="flex flex-wrap items-center gap-4">
    <h2 className="font-medium">Revenue Overview</h2>
    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500" /> Cashback</span>
      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> Income</span>
    </div>
  </div>
  <PeriodToggle />
</div>
  <RevenueOverviewChart data={revenueOverviewData} />
</div>
      </div>

      {/* bottom row: stations, transactions, status — placeholders for now */}
<div className="grid grid-cols-1 gap-4 lg:grid-cols-2  xl:grid-cols-3 ">
  <TopPerformingStations stations={stationsData} />
  <RecentTransactions transactions={transactionsData} />
  <StationsStatus stations={stationsStatusData} />
</div>
    </div>
  )
}