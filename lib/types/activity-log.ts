import { ReactNode } from "react"

export interface ActivityLog {
  id: string
  userName: string
  userRole: string
  action: string
  actionDetail: string
  actionIcon: ReactNode
  target: string
  dateTime: string
  ipAddress: string
  status: 'success' | 'failed'
}