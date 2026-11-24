// lib/dashboard/settlement-format.ts
const naira = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const formatNaira = (amount: number) => naira.format(amount)

const dateTime = new Intl.DateTimeFormat('en-NG', {
  timeZone: 'Africa/Lagos',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
})

export const formatLagosDateTime = (iso: string) => dateTime.format(new Date(iso))

/** Formats a Lagos calendar day (YYYY-MM-DD) without shifting it across timezones. */
export function formatLagosDay(ymd: string, withWeekday = false) {
  return new Intl.DateTimeFormat('en-NG', {
    timeZone: 'Africa/Lagos',
    ...(withWeekday && { weekday: 'short' as const }),
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${ymd}T12:00:00Z`))
}
