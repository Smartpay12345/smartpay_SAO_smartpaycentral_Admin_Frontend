// lib/types/broadcast.ts
export type DeliveryChannel = 'sms' | 'push' | 'inbox'
export type TemplateCategory = 'cashback' | 'security' | 'fuel' | 'station' | 'surveys'

export interface BroadcastTemplate {
  id: string
  title: string
  body: string
  channel?: 'Push' | 'SMS' | 'Inbox'
  category?: TemplateCategory
  tag?: string
  createdLabel: string
  usedCount: number
  deliveryRate: string
}

export interface Recipient {
  id: string
  name: string
  phone: string
}

export interface BroadcastDraft {
  title: string
  body: string
}

export interface TimeValue {
  hour: number // 1–12
  minute: number // 0–59
  period: 'AM' | 'PM'
}