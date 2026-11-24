// import { Download, Users, Package, CreditCard } from 'lucide-react'

// export function AppUserStats() {
//   return (
//     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//       <StatBox icon={<Download className="h-5 w-5" />} iconBg="bg-red-50 text-red-500" label="Total Downloads" value="8,750,000" trend="+12.5% vs last month" trendColor="text-green-600" />
//       <StatBox icon={<Users className="h-5 w-5" />} iconBg="bg-blue-50 text-blue-500" label="Daily Active users (DAU)" value="64,892" trend="+8.3% vs last week" trendColor="text-green-600" />
//       <StatBox icon={<Package className="h-5 w-5" />} iconBg="bg-red-50 text-red-400" label="Explore Service" value="210,456" trend="+10.8% vs last week" trendColor="text-green-600" />
//       <div className="rounded-xl border bg-white p-4">
//         <div className="mb-2 flex items-center gap-3">
//           <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-green-600">
//             <CreditCard className="h-5 w-5" />
//           </span>
//           <p className="text-sm text-gray-500">Registered Wallets</p>
//         </div>
//         <p className="mb-2 text-xl font-bold text-gray-900">4,560,000</p>
//         <div className="flex gap-4 text-xs">
//           <span><span className="font-semibold text-gray-900">4,200,120</span> <span className="text-gray-400">Active</span></span>
//           <span><span className="font-semibold text-gray-900">100</span> <span className="text-gray-400">Restricted</span></span>
//         </div>
//       </div>
//     </div>
//   )
// }

// function StatBox({ icon, iconBg, label, value, trend, trendColor }: { icon: React.ReactNode; iconBg: string; label: string; value: string; trend: string; trendColor: string }) {
//   return (
//     <div className="rounded-xl border bg-white p-4">
//       <div className="mb-2 flex items-center gap-3">
//         <span className={`flex h-9 w-9 items-center justify-center rounded-full ${iconBg}`}>{icon}</span>
//         <p className="text-sm text-gray-500">{label}</p>
//       </div>
//       <p className="text-xl font-bold text-gray-900">{value}</p>
//       <p className={`text-xs ${trendColor}`}>↑ {trend}</p>
//     </div>
//   )
// }



import type { ReactNode } from 'react'
import { Users, Package, CreditCard } from 'lucide-react'
import type { AppUsersOverview } from '@/lib/types/app-user'

interface Props {
  data: AppUsersOverview
}

const numberFormat = new Intl.NumberFormat('en-NG')

const naira = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formatNumber(value: number) {
  return numberFormat.format(value ?? 0)
}

function formatCurrency(value: number) {
  return naira.format(value ?? 0)
}

function formatTrend(value: number | null) {
  if (value === null || value === undefined) {
    return 'No comparison data'
  }

  const prefix = value > 0 ? '+' : ''

  return `${prefix}${value}% vs previous period`
}

function AppUserStats({ data }: Props) {
  const dauTrend = data.daily_active_users.change_percent
  const exploreTrend = data.explore_service.change_percent

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatBox
        icon={<Users className="h-5 w-5" />}
        iconBg="bg-blue-50 text-blue-500"
        label="Daily Active Users (DAU)"
        value={formatNumber(data.daily_active_users.count)}
        trend={formatTrend(dauTrend)}
        trendColor={getTrendColor(dauTrend)}
      />

      <StatBox
        icon={<Package className="h-5 w-5" />}
        iconBg="bg-red-50 text-red-400"
        label="Explore Service"
        value={formatNumber(data.explore_service.count)}
        subtitle={`Total amount: ${formatCurrency(data.explore_service.amount)}`}
        trend={formatTrend(exploreTrend)}
        trendColor={getTrendColor(exploreTrend)}
      />

      <div className="rounded-xl border bg-white p-4">
        <div className="mb-2 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-green-600">
            <CreditCard className="h-5 w-5" />
          </span>

          <p className="text-sm text-gray-500">Registered Wallets</p>
        </div>

        <p className="mb-2 text-xl font-bold text-gray-900">
          {formatNumber(data.registered_wallets.total)}
        </p>

        <div className="flex flex-wrap gap-4 text-xs">
          <span>
            <span className="font-semibold text-gray-900">
              {formatNumber(data.registered_wallets.active)}
            </span>{' '}
            <span className="text-gray-400">Active</span>
          </span>

          <span>
            <span className="font-semibold text-gray-900">
              {formatNumber(data.registered_wallets.restricted)}
            </span>{' '}
            <span className="text-gray-400">Restricted</span>
          </span>
        </div>
      </div>

      <StatBox
        icon={<Users className="h-5 w-5" />}
        iconBg="bg-purple-50 text-purple-500"
        label="Registered Users"
        value={formatNumber(data.app_stats.registered_users)}
      />
    </div>
  )
}

function getTrendColor(value: number | null) {
  if (value === null || value === undefined) return 'text-gray-400'
  if (value > 0) return 'text-green-600'
  if (value < 0) return 'text-red-500'
  return 'text-gray-400'
}

function StatBox({
  icon,
  iconBg,
  label,
  value,
  subtitle,
  trend,
  trendColor = 'text-gray-400',
}: {
  icon: ReactNode
  iconBg: string
  label: string
  value: string
  subtitle?: string
  trend?: string
  trendColor?: string
}) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="mb-2 flex items-center gap-3">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-full ${iconBg}`}
        >
          {icon}
        </span>

        <p className="text-sm text-gray-500">{label}</p>
      </div>

      <p className="text-xl font-bold text-gray-900">{value}</p>

      {subtitle && (
        <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
      )}

      {trend && (
        <p className={`mt-2 text-xs ${trendColor}`}>
          {trend}
        </p>
      )}
    </div>
  )
}

export { AppUserStats }
