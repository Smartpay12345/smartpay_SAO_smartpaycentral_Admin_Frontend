import { formatCurrencyFull } from '@/lib/utils/format'
import { formatDayMonth, formatJoined, formatLongDate, formatOrdinalDate } from '@/lib/utils/date'
import type { Branch, FuelStock } from '@/lib/types/inventory'
import type { BranchStatus, InventoryStation, StationInventory, StationStaff, StationDayReport } from './inventory-types'

const fmt2 = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const BRANCH_STATUS: Record<BranchStatus, Branch['status']> = {
  healthy: 'healthy',
  refill_required: 'refill-required',
  not_accessible: 'not-accessible',
  setup_pending: 'setup-pending',
}

export const toBranch = (s: InventoryStation, vsLabel: string): Branch => ({
  id: s.id,
  name: s.name,
  createdDate: formatOrdinalDate(s.created_at),
  state: s.state,
  percentChange: s.change_percent,
  changeDirection: s.change_direction,
  vsLabel,
  status: BRANCH_STATUS[s.status],
})

// the API's "low" is the red card, which your FuelStockCard calls "critical"
const STOCK_STATUS = { low: 'critical', monitor: 'monitor', healthy: 'healthy' } as const
const NOTE_PREFIX = { critical: '⚠ ', monitor: '⚡ ', healthy: '✓ ' } as const

export const toStationDetail = (d: StationInventory) => ({
  name: d.station.name,
  fuelStocks: d.stock.map((s): FuelStock => {
    const status = s.status ? STOCK_STATUS[s.status] : 'pending'
    return {
      label: s.title,
      fuelType: s.product_code.toLowerCase() as FuelStock['fuelType'],
      tank: s.tanks_label,
      current: s.stock,
      capacity: s.capacity,
      unit: s.unit === 'kg' ? 'KG' : 'L',
      status,
      note: status === 'pending' ? (s.note || 'Setup pending') : `${NOTE_PREFIX[status]}${s.note}`,
    }
  }),
  todayDate: formatDayMonth(d.day.date),
  totalSales: fmt2(d.day.total_sales),
  noOfSales: d.day.sales_count,
  monthTotal: fmt2(d.month_to_date.total_sales),
})

export const toStaffRows = (d: StationStaff) =>
  d.staff.map((p) => ({
    id: p.id,
    name: p.full_name,
    email: p.email || '',
    phone: p.phone || '-',
    role: p.role,
    dateJoined: formatJoined(p.date_joined),
    status: p.status,
    statusLabel: p.status_label,
  }))

export const toPumpMetrics = (d: StationDayReport) => ({
  stationId: d.station.station_code,
  location: [d.station.city, d.station.state_label].filter(Boolean).join(', '),
  totalAmountSales: formatCurrencyFull(d.total_sales, { decimals: 2 }),
  expenseMonth: formatLongDate(d.date),
  expenses: d.products.map((p) => ({
    product: `${p.product_code} | ${p.product_name}`,
    amount: fmt2(p.amount),
    liters: `${p.quantity.toLocaleString()} ${p.unit === 'kg' ? 'Kgrms' : 'Liters'}`,
    buyer: p.buyers,
  })),
  pumps: d.pumps.map((p) => ({
    name: `${p.name} (${p.product_code})`,
    status: p.status_label,
    opening: p.opening,
    closing: p.closing,
    dispensed: p.dispensed,
  })),
})