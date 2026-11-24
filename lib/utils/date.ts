const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const pad = (n: number) => String(n).padStart(2, '0')

export const parseIso = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return { y, m, d }
}
export const toIso = ({ y, m, d }: { y: number; m: number; d: number }) => `${y}-${pad(m)}-${pad(d)}`

export function lagosParts(value: string | Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Lagos', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(typeof value === 'string' ? new Date(value) : value)
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value)
  return { y: get('year'), m: get('month'), d: get('day') }
}

export const lagosToday = () => toIso(lagosParts(new Date()))

const ordinal = (n: number) => {
  const v = n % 100
  if (v >= 11 && v <= 13) return `${n}th`
  return `${n}${['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`
}

export const formatOrdinalDate = (iso: string) => { // "June 12th 2026"
  const { y, m, d } = lagosParts(iso)
  return `${MONTHS[m - 1]} ${ordinal(d)} ${y}`
}
export const formatLongDate = (isoDay: string) => { // "24 August 2026"
  const { y, m, d } = parseIso(isoDay)
  return `${d} ${MONTHS[m - 1]} ${y}`
}
export const formatDayMonth = (isoDay: string) => { // "24 AUG"
  const { m, d } = parseIso(isoDay)
  return `${d} ${MONTHS[m - 1].slice(0, 3).toUpperCase()}`
}
export const formatJoined = (iso: string) => { // "01 Mar 2023"
  const { y, m, d } = lagosParts(iso)
  return `${pad(d)} ${MONTHS[m - 1].slice(0, 3)} ${y}`
}
export const monthShort = (isoDay: string) => MONTHS[parseIso(isoDay).m - 1].slice(0, 3)

// moves a day by whole months, clamps to the month's length, never past `max` (today)
export function shiftMonth(isoDay: string, delta: number, max: string) {
  const { y, m, d } = parseIso(isoDay)
  const total = y * 12 + (m - 1) + delta
  const ny = Math.floor(total / 12)
  const nm = total % 12
  const last = new Date(Date.UTC(ny, nm + 1, 0)).getUTCDate()
  const next = toIso({ y: ny, m: nm + 1, d: Math.min(d, last) })
  return next > max ? max : next
}

export function timeAgoLong(iso: string, now = Date.now()) { // "20 Minutes Ago"
  const min = Math.floor(Math.max(0, now - new Date(iso).getTime()) / 60000)
  if (min < 1) return 'Just now'
  if (min < 60) return `${min} ${min === 1 ? 'Minute' : 'Minutes'} Ago`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h} ${h === 1 ? 'Hour' : 'Hours'} Ago`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d} ${d === 1 ? 'Day' : 'Days'} Ago`
  return formatJoined(iso)
}

export function serviceYear(t: { years: number; months: number; label: string }) { // "3 Years 7 Months"
  if (t.months < 1) return t.label // "Less than a month"
  const rem = t.months - t.years * 12
  const y = t.years > 0 ? `${t.years} ${t.years === 1 ? 'Year' : 'Years'}` : ''
  const m = rem > 0 ? `${rem} ${rem === 1 ? 'Month' : 'Months'}` : ''
  return [y, m].filter(Boolean).join(' ')
}

export function formatDateTime(iso: string) { // "23 Oct 2026, 10:00 AM"
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Lagos', day: '2-digit', month: 'short', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  }).format(new Date(iso)).replace(/\b(am|pm)\b/, (s) => s.toUpperCase())
}

export function shiftDay(isoDay: string, delta: number) {
  const { y, m, d } = parseIso(isoDay)
  const dt = new Date(Date.UTC(y, m - 1, d + delta))
  return toIso({ y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() })
}

export const formatDayLabel = (isoDay: string) => { // "6th September, 2026"
  const { y, m, d } = parseIso(isoDay)
  return `${ordinal(d)} ${MONTHS[m - 1]}, ${y}`
}