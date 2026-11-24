import { ChevronDown, ArrowLeftRight, MoreVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatNaira, formatLagosDateTime } from '@/lib/dashboard/format'
import type { appUsersApi } from '@/lib/dashboard/app-users-api'

type Detail = Awaited<ReturnType<typeof appUsersApi.detail>>
type Transaction = Detail['recent_transactions'][number]

const KYC_STYLE: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-600',
  failed: 'bg-red-50 text-red-600',
  unverified: 'bg-gray-100 text-gray-500',
}

export function AccountDetailsContent({ data, onViewAll }: { data: Detail; onViewAll: () => void }) {
  const { user, totals, recent_transactions } = data
  const account = user.virtual_account

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {user.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-500">
              {(user.full_name || '?').charAt(0)}
            </span>
          )}
          <div>
            <p className="text-sm font-semibold text-gray-900">{user.full_name}</p>
            <p className="text-xs text-gray-400">
              Virtual account : {account ? `${account.account_number} (${account.bank_name})` : '-'}
            </p>
          </div>
        </div>
        {user.kyc_verified ? (
          <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">✓ KYC Verified</span>
        ) : (
          <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium capitalize', KYC_STYLE[user.kyc_status ?? 'unverified'] ?? KYC_STYLE.unverified)}>
  KYC {user.kyc_status ?? 'unverified'}
</span>
        )}
      </div>

      {user.restricted && (
        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
          <p className="font-medium">This account is restricted</p>
          {user.restriction_reason && <p>Reason: {user.restriction_reason}</p>}
          {user.restricted_by && <p>By: {user.restricted_by}</p>}
        </div>
      )}

      <div className="space-y-3 border-t pt-4 text-sm">
        <Row label="Total Deposit" value={formatNaira(totals.total_deposit)} valueColor="text-green-600" />
        <Row label="Wallet Balance" value={formatNaira(totals.wallet_balance)} valueColor="text-blue-600" />
        <Row label="Total Cashback" value={formatNaira(totals.total_cashback)} valueColor="text-red-500" />
      </div>

      <div className="mt-5">
        <button onClick={onViewAll} className="mb-3 flex w-full items-center justify-between text-sm font-semibold text-gray-900">
          <span className="flex items-center gap-1"><ChevronDown className="h-4 w-4" /> Recent Transactions</span>
          <span className="text-xs font-medium text-primary">View all</span>
        </button>
        <div className="space-y-2">
          {recent_transactions.map((t) => <TransactionRow key={t.id} t={t} />)}
          {recent_transactions.length === 0 && <p className="text-sm text-gray-400">No transactions yet.</p>}
        </div>
      </div>
    </div>
  )
}

// exported so the "View all" list uses the exact same row
export function TransactionRow({ t }: { t: Transaction }) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3 text-sm">
      <span className="text-xs font-medium text-gray-400">{formatLagosDateTime(t.time)}</span>
      <span className="font-medium text-gray-900">{t.label}</span>
      <span className={cn('rounded-full px-2 py-0.5 text-xs capitalize', t.direction === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600')}>
        {t.direction}
      </span>
      <span className="text-gray-500">{t.status_label}</span>
      <ArrowLeftRight className="h-3.5 w-3.5 text-gray-300" />
      <span className="font-semibold text-gray-900">{formatNaira(t.amount)}</span>
      <MoreVertical className="h-4 w-4 text-gray-300" />
    </div>
  )
}

// Row: keep your existing function at the bottom, unchanged

function Row({
  label,
  value,
  valueColor,
}: {
  label: string
  value: string
  valueColor: string
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500">{label}</span>
      <span className={`font-semibold ${valueColor}`}>{value}</span>
    </div>
  )
}
