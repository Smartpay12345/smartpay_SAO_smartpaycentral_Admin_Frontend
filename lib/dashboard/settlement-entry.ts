// lib/dashboard/settlement-entry.ts
import { formatNaira, formatLagosDateTime } from '@/lib/dashboard/format'
import type { SettlementEntry } from '@/lib/types/settlement'
import type { AdminSettlementItem } from '@/lib/dashboard/settlement-types'

export const toEntry = (s: AdminSettlementItem): SettlementEntry => ({
  destination: s.destination?.label ?? '—',
  date: formatLagosDateTime(s.time),
  reference: s.reference,
  amount: formatNaira(s.amount),
  status: s.status_label,
})