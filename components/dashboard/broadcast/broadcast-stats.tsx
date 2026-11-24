// components/dashboard/broadcast/broadcast-stats.tsx
import { ArrowUp, Package, Smartphone, Users, Wallet } from 'lucide-react'
import { StatCard } from '@/components/dashboard/stat-card'

const up = <ArrowUp className="h-3 w-3 text-emerald-600" />

export function BroadcastStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={<Smartphone className="h-5 w-5 text-red-500" />} iconBgColor="bg-red-50"
        label="Total Broadcast" value="8,750,000"
        trend={{ icon: up, changeValue: '12.5%', changeValueColor: 'text-emerald-600', changeLabel: 'All time', changeLabelColor: 'text-gray-400' }}
      />
      <StatCard
        icon={<Users className="h-5 w-5 text-blue-500" />} iconBgColor="bg-blue-50"
        label="Total Broadcast" value="64,892"
        trend={{ icon: up, changeValue: '8.3%', changeValueColor: 'text-emerald-600', changeLabel: 'vs This Month', changeLabelColor: 'text-gray-400' }}
      />
      <StatCard
        icon={<Package className="h-5 w-5 text-red-500" />} iconBgColor="bg-red-50"
        label="Total Delivery" value="210,456"
        trend={{ icon: up, changeValue: '10.8%', changeValueColor: 'text-emerald-600', changeLabel: 'vs This Month', changeLabelColor: 'text-gray-400' }}
      />
      <StatCard
        icon={<Wallet className="h-5 w-5 text-green-600" />} iconBgColor="bg-green-50"
        label="Failed Broadcast" value="4,560,000"
      />
    </div>
  )
}