// lib/broadcast-utils.ts
import type { TimeValue } from '@/lib/types/broadcast'

export function toDateKey(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

const SAMPLE_VARIABLES: Record<string, string> = {
  first_name: 'Sarah',
  wallet_balance: '₦520,000',
}

// swaps {{first_name}} etc. for sample values, used by the Preview modal
export function renderTemplate(body: string) {
  return body.replace(/\{\{(\w+)\}\}/g, (match, key: string) => SAMPLE_VARIABLES[key] ?? match)
}

export function combineDateTime(day: Date, t: TimeValue) {
  const hours = (t.hour % 12) + (t.period === 'PM' ? 12 : 0) // 12 AM → 0, 12 PM → 12
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours, t.minute)
}