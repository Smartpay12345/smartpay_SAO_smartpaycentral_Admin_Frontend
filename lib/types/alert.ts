import type { ReactNode } from "react"
export interface Alert {
  id: string
  icon:  ReactNode
  iconBg: string
  title: string
  description: string
  timeAgo: string
  read: boolean
  priority?: 'high'
  category: 'operational' | 'system'
  linkLabel?: string
  linkHref?: string
}