import type { PeriodInfo } from "./types";

// const naira = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 2 });
const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 2,
  trailingZeroDisplay: "stripIfInteger",
} as Intl.NumberFormatOptions);


const number = new Intl.NumberFormat("en-NG", { maximumFractionDigits: 2 });


const lagosDateTime = new Intl.DateTimeFormat("en-NG", {
  timeZone: "Africa/Lagos", day: "numeric", month: "short", year: "numeric",
  hour: "numeric", minute: "2-digit", hour12: true,
});

export const formatNaira = (amount: number) => naira.format(amount); // the API sends full naira, not kobo
export const formatNumber = (n: number) => number.format(n);
export const formatLagosDateTime = (isoUtc: string) => lagosDateTime.format(new Date(isoUtc));
export const formatQuantity = (q: number | null, unit: string | null) =>
  q === null ? "—" : `${formatNumber(q)} ${unit ?? ""}`.trim();

export function formatChange(value: number | null): { text: string; direction: "up" | "down" | "none" } {
  if (value === null) return { text: "—", direction: "none" }; // nothing to compare with
  const rounded = Number(value.toFixed(1));
  if (rounded > 0) return { text: `+${rounded}%`, direction: "up" };
  if (rounded < 0) return { text: `-${Math.abs(rounded)}%`, direction: "down" };
  return { text: "0%", direction: "none" };
}

// the "vs last month" line follows the selected period
const COMPARED: Record<PeriodInfo["key"], string | null> = {
  today: "vs yesterday",
  yesterday: "vs the day before",
  this_week: "vs last week",
  last_7_days: "vs the previous 7 days",
  last_week: "vs the week before",
  this_month: "vs last month",
  last_month: "vs the month before",
  this_year: "vs last year",
  last_30_days: "vs the previous 30 days",
  custom: "vs the previous period",
  all_time: null,
};
export const comparisonLabel = (key: PeriodInfo["key"]) => COMPARED[key];

// recent transactions status labels (the table endpoints already send status_label)
export const RECENT_STATUS_LABEL = {
  confirmed: "Completed",
  awaiting_payment: "Pending",
  expired: "Expired",
  cancelled: "Cancelled",
} as const;


const nairaCompact = new Intl.NumberFormat("en-NG", {
  style: "currency", currency: "NGN", notation: "compact", maximumFractionDigits: 1,
});
export const formatNairaCompact = (n: number) => nairaCompact.format(n); // ₦1.3M, for chart axes

const lagosShort = new Intl.DateTimeFormat("en-NG", {
  timeZone: "Africa/Lagos", day: "numeric", month: "short", hour: "numeric", minute: "2-digit", hour12: true,
});
export const formatLagosShort = (isoUtc: string) => lagosShort.format(new Date(isoUtc)); // 10 Oct, 3:05 PM


export function timeAgo(iso: string, now: number) {
  const minutes = Math.floor(Math.max(0, now - new Date(iso).getTime()) / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hr${hours === 1 ? '' : 's'} ago`
  return formatLagosDateTime(iso)
}


export const formatPlain = (n: number, decimals = 2) =>
  new Intl.NumberFormat('en-NG', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n)


const lagosDate = new Intl.DateTimeFormat("en-NG", { timeZone: "Africa/Lagos", day: "numeric", month: "short", year: "numeric" });
const lagosTime = new Intl.DateTimeFormat("en-NG", { timeZone: "Africa/Lagos", hour: "numeric", minute: "2-digit", hour12: true });
const amountPlain = new Intl.NumberFormat("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const formatLagosDate = (isoUtc: string) => lagosDate.format(new Date(isoUtc));
export const formatLagosTime = (isoUtc: string) => lagosTime.format(new Date(isoUtc));
export const formatAmountPlain = (n: number) => amountPlain.format(n); // 16,250.00, for the table column that already says (₦)


// today in Lagos as YYYY-MM-DD (en-CA formats dates in that order)
export const todayLagos = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Lagos' }).format(new Date())

// move a YYYY-MM-DD date by N days; UTC math avoids timezone surprises
export function shiftDate(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

// "24 August 2026" from a date-only string
export const formatLongDate = (iso: string) =>
  new Intl.DateTimeFormat('en-NG', { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric' })
    .format(new Date(`${iso}T00:00:00Z`))


    export const initials = (name: string) =>
  name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase()

export const lagosDateOnly = (iso: string) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Lagos' }).format(new Date(iso))

export const formatOrderId = (code: string) => `#${code}`
export const formatUnitPrice = (price: number, unit: string) => `${formatNaira(price)} / ${unit}`
export const formatExpected = (iso: string | null) => (iso ? formatLagosDate(iso) : 'Not set yet')
export const requestedLabel = (unit: string) => (unit === 'kg' ? 'Requested Quantity' : 'Requested Liters')

export const unitWord = (unit: "L" | "kg") => (unit === "kg" ? "Kg" : "Liters");
export const clampPercent = (p: number | null) => (p === null ? 0 : Math.min(100, Math.max(0, p)));

const compact = new Intl.NumberFormat("en-NG", { notation: "compact", maximumFractionDigits: 1 });
export const formatCompact = (n: number) => compact.format(n); // 70K, for the volume axis