// lib/utils/format.ts

// ---------- Currency ----------

export const formatNaira = (amount: unknown): string => {
  const num = Number(amount)
  if (amount === null || amount === undefined || Number.isNaN(num)) {
    return '₦0.00'
  }
  return `₦${num.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`
}

// Use this for the input field to strip non-numeric characters
export const cleanAmountInput = (val: unknown): string => {
  if (typeof val !== 'string') return ''
  return val.replace(/[^0-9.]/g, '')
}

const NAIRA = '₦'

interface CurrencyFullOptions {
  currency?: string
  decimals?: number
}

// Full exact value, comma-separated, with currency prefix
// e.g. formatCurrencyFull(1570778) -> "₦1,570,778"
export const formatCurrencyFull = (
  value: unknown,
  { currency = NAIRA, decimals = 0 }: CurrencyFullOptions = {}
): string => {
  const num = Number(value)
  const safeNum = Number.isFinite(num) ? num : 0
  return `${currency}${safeNum.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`
}

interface CurrencyCompactOptions {
  currency?: string
}

// Compact/abbreviated value with currency prefix
// e.g. formatCurrencyCompact(1570778) -> "₦1.57M"
export const formatCurrencyCompact = (
  value: unknown,
  { currency = NAIRA }: CurrencyCompactOptions = {}
): string => {
  const num = Number(value)
  const safeNum = Number.isFinite(num) ? num : 0
  const abs = Math.abs(safeNum)

  if (abs >= 1_000_000_000) return `${currency}${(safeNum / 1_000_000_000).toFixed(2)}B`
  if (abs >= 1_000_000) return `${currency}${(safeNum / 1_000_000).toFixed(2)}M`

  return `${currency}${safeNum.toLocaleString()}`
}

// ---------- Strings ----------

export const capitalizeWords = (
  str: unknown,
  fallback: string = 'Not Provided'
): string => {
  try {
    if (str === null || str === undefined) return fallback
    if (typeof str === 'string' && str.trim() === '') return fallback

    let value: string
    if (Array.isArray(str)) {
      if (str.length === 0) return fallback
      value = str.join(', ')
    } else if (typeof str === 'string') {
      value = str
    } else {
      // number, object, etc. — coerce safely instead of crashing
      value = String(str)
    }

    return value
      .toLowerCase()
      .split(' ')
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  } catch {
    return fallback
  }
}

export const getInitials = (name: unknown): string => {
  if (typeof name !== 'string' || name.trim() === '') return '?'
  const words = name.trim().split(/\s+/)
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return ((words[0]?.[0] ?? '') + (words[1]?.[0] ?? '')).toUpperCase() || '?'
}

// ---------- Dates ----------

export const formatLoanDate = (
  dateStr: unknown,
  opts?: Intl.DateTimeFormatOptions
): string => {
  if (!dateStr || (typeof dateStr !== 'string' && !(dateStr instanceof Date))) {
    return '—'
  }
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', opts ?? { month: 'short', day: 'numeric', year: 'numeric' })
}

const timeAgo = (date: unknown): string => {
  if (!date || (typeof date !== 'string' && !(date instanceof Date))) return '—'
  const then = new Date(date)
  if (Number.isNaN(then.getTime())) return '—'

  const now = new Date()
  const diff = now.getTime() - then.getTime()
  if (diff < 0) return 'just now' // clock skew / future date from backend

  const h = Math.floor(diff / 3600000)
  const d = Math.floor(diff / 86400000)
  if (d > 0) return `${d}d ago`
  if (h > 0) return `${h}h ago`
  return 'just now'
}

export default timeAgo