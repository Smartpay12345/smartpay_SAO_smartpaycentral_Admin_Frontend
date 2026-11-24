// hooks/use-alerts-summary.ts (sidebar badge)
'use client'
import { useEndpoint } from './use-endpoint'
import { alertsApi, ALERT_KEYS } from '@/lib/dashboard/alerts-api'

export const useAlertsSummary = () =>
  useEndpoint(ALERT_KEYS.summary, {}, () => alertsApi.summary(), { refetchInterval: 60_000 })