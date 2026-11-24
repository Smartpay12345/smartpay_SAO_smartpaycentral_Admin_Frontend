// lib/data/txn-status-colors.ts
import type { TxnStatus } from '@/lib/types/transaction-overview'

export const STATUS_STYLE: Record<TxnStatus, {
  label: string
  border: string
  bgSelected: string
  badgeBg: string
  badgeText: string
  dot: string
}> = {
  completed: {
    label: 'Completed',
    border: 'border-l-green-500',
    bgSelected: 'bg-green-50/50',
    badgeBg: 'bg-green-50',
    badgeText: 'text-green-600',
    dot: 'bg-green-500',
  },
  pending: {
    label: 'Pending',
    border: 'border-l-orange-400',
    bgSelected: 'bg-orange-50/50',
    badgeBg: 'bg-orange-50',
    badgeText: 'text-orange-600',
    dot: 'bg-orange-400',
  },
  failed: {
    label: 'Failed',
    border: 'border-l-red-500',
    bgSelected: 'bg-red-50/50',
    badgeBg: 'bg-red-50',
    badgeText: 'text-red-600',
    dot: 'bg-red-500',
  },
    expired: {
    label: 'Expired',
    border: 'border-l-gray-400',
    bgSelected: 'bg-gray-50',
    badgeBg: 'bg-gray-100',
    badgeText: 'text-gray-600',
    dot: 'bg-gray-400',
  },
  cancelled: {
    label: 'Cancelled',
    border: 'border-l-gray-400',
    bgSelected: 'bg-gray-50',
    badgeBg: 'bg-gray-100',
    badgeText: 'text-gray-600',
    dot: 'bg-gray-400',
  },
}