// app/dashboard/revenue-analytics/page.tsx
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import {  Dm, Gift, Wallet, ArrowUp } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { RevenueCashbackChart } from '@/components/dashboard/revenue-cashback-chart'
import { RevenueStatCard } from '@/components/dashboard/revenue-stat-card'

const chartData = [
  { week: 'Week 1', revenue: 20, cashback: 10 },
  { week: 'Week 2', revenue: 55, cashback: 48 },
  { week: 'Week 3', revenue: 42, cashback: 88 },
  { week: 'Week 4', revenue: 38, cashback: 52 },
]

export default function RevenueAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Revenue Analytics</h1>
          <p className="text-sm text-gray-500">Track your incoming revenue and overall financial health.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4 text-[#CD0102]" />
              Back
            </Button>
          </Link>
          <Link href="/dashboard/settlement">
            <Button>View Settlement</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <RevenueStatCard
          icon={<Wallet />}
          label="Total Revenue"
          value="₦128,750,000"
          iconBg="bg-red-50"
    trendIcon={<ArrowUp/>}
    trendValue="+12.5%"
    trendValueColor="text-green-600"
    trendLabel="vs last week"
    trendLabelColor="text-gray-400"
        />
        <RevenueStatCard
          icon={<Gift />}
          label="Total Cashback"
          value="₦5,420,000"
          iconBg="bg-red-50"
    trendIcon={<ArrowUp/>} 
    trendValue="+12.5%"
    trendValueColor="text-green-600"
    trendLabel="vs last week"
    trendLabelColor="text-gray-400"
        />
        <RevenueStatCard
          icon={<Dm/>}
          label="Settlement"
          value="₦45,200,000"
          subtext="Available for payout"
          iconBg="bg-green-50"
          valueColor="text-primary"
        />
      </div>

      <div className="rounded-xl border bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-medium">Revenue vs Cashback</h2>
          {/* month dropdown goes here later */}
        </div>
        <RevenueCashbackChart data={chartData} />
        <div className="mt-3 flex items-center justify-center gap-6 text-sm text-gray-500">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#E11D2A]" /> Revenue
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#2563EB]" /> Cashback
          </span>
        </div>
      </div>
    </div>
  )
}