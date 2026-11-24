// lib/dashboard/wallet.ts
import { formatNaira } from './format'
import type { WalletOverview } from './settlement-types'

// the API gives one boolean; this says WHY, so the UI can tell the admin
export function withdrawBlockedReason(w: WalletOverview): string | null {
  if (w.withdrawal.can_withdraw) return null
  if (!w.account) return 'Add a settlement account first.'
  if (w.wallet.balance < w.withdrawal.min_amount) return `The minimum withdrawal is ${formatNaira(w.withdrawal.min_amount)}.`
  return 'Your balance does not cover the withdrawal fee.'
}

// one key per open dialog: reuse it on retries, make a new one after a success
export const newIdempotencyKey = () => crypto.randomUUID()