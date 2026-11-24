// hooks/use-mark-alerts-read.ts
'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { alertsApi, ALERT_KEYS } from '@/lib/dashboard/alerts-api'

export function useMarkAlertsRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: alertsApi.markRead,
    onSettled: () => Object.values(ALERT_KEYS).forEach((k) => qc.invalidateQueries({ queryKey: [k] })),
  })
}