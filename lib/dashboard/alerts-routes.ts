// lib/dashboard/alert-routes.ts
import type { AlertAction } from './alerts-types'

// the only place that knows where each alert button goes
export function alertHref({ target, id, date }: AlertAction): string | null {
  switch (target) {
    case 'station': return id ? `/dashboard/inventory?station=${id}` : null
    case 'order': return id ? `/dashboard/manage-orders/${id}` : null
    case 'manager': return id ? `/dashboard/managers/${id}` : null // assumed route
    case 'settlement': return id ? `/dashboard/settlements/${id}` : null // assumed route
    case 'daily_report': return date ? `/dashboard/sales-overview?date=${date}` : null // assumed route
  }
}