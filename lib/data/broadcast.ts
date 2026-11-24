// lib/data/broadcast.ts
import type { BroadcastTemplate, Recipient, TemplateCategory } from '@/lib/types/broadcast'
import { toDateKey } from '@/lib/utils/broadcast-utils'

export const CATEGORY_OPTIONS: { key: TemplateCategory; label: string }[] = [
  { key: 'cashback', label: 'Cashback & Promo' },
  { key: 'security', label: 'Account & Security' },
  { key: 'fuel', label: 'Fuel Dispense & Receipts' },
  { key: 'station', label: 'Station Alerts' },
  { key: 'surveys', label: 'Surveys & Loyalty' },
]

export const INITIAL_TEMPLATES: BroadcastTemplate[] = [
  {
    id: 't1',
    title: 'Special Weekend Cashback Alert',
    body: 'Hello {{first_name}}, get an extra 5% instant cashback on all PMS & AGO purchases at any SAO Filling Station this weekend! Your current FuelPay balance is {{wallet_balance}}. Safe driving!',
    channel: 'Push', category: 'cashback', tag: 'Cashback Boost',
    createdLabel: '2 days ago • 14:28 PM', usedCount: 1420, deliveryRate: '99.6%',
  },
  {
    id: 't2',
    title: 'Suspicious Forecourt Login Alert',
    body: 'SAO Security: Login attempt from an unrecognized terminal near you. If this was not you, freeze your card instantly in-app.',
    channel: 'SMS', category: 'security', tag: 'Security',
    createdLabel: '2 days ago • 14:28 PM', usedCount: 318, deliveryRate: '100%',
  },
  {
    id: 't3',
    title: 'Monthly VIP Tier Upgrade Notice',
    body: 'Congratulations {{first_name}}! Your monthly activity qualifies you for the next VIP tier. Open the app to claim your new benefits.',
    channel: 'Push', category: 'surveys', tag: 'VIP Tier',
    createdLabel: '2 days ago • 14:28 PM', usedCount: 5820, deliveryRate: '99.9%',
  },
  // t4 and t5 are mine, added so every filter chip has something behind it
  {
    id: 't4',
    title: 'Fuel Dispense Receipt',
    body: 'Hi {{first_name}}, your fuel purchase was successful. Your receipt is now available in the app under Transactions.',
    channel: 'SMS', category: 'fuel', tag: 'Receipt',
    createdLabel: '3 days ago • 09:12 AM', usedCount: 960, deliveryRate: '99.2%',
  },
  {
    id: 't5',
    title: 'Station Maintenance Notice',
    body: 'Heads up: one of our stations near you has scheduled maintenance today. Please use the nearest open station.',
    channel: 'Push', category: 'station', tag: 'Station Alert',
    createdLabel: '5 days ago • 16:40 PM', usedCount: 212, deliveryRate: '98.7%',
  },
]

export const ACCOUNT_DIRECTORY: Recipient[] = [
  { id: 'a1', name: 'John Doe', phone: '+234 803 492 8812' },
  { id: 'a2', name: 'Fatima Aliyu', phone: '+234 814 883 1920' },
  { id: 'a3', name: 'Amina Bello', phone: '+234 802 711 0495' },
  { id: 'a4', name: 'Emeka Okafor', phone: '+234 705 129 8831' },
  { id: 'a5', name: 'Sarah James', phone: '+234 703 330 3653' },
  { id: 'a6', name: 'Rukayat Akorede', phone: '+234 703 330 3853' },
  { id: 'a7', name: 'Tunde Gbotemi', phone: '+234 903 330 3653' },
]
export const DEFAULT_RECIPIENT_IDS = ['a1', 'a2', 'a3', 'a4']
export const ACTIVE_ACCOUNT_COUNT = '4,200,120'

// placeholder "scheduled cycles" so the calendar's pink days have something behind them
export function mockScheduledDates(): string[] {
  const base = new Date()
  return [2, 3, 9, 10, 16].map((offset) =>
    toDateKey(new Date(base.getFullYear(), base.getMonth(), base.getDate() + offset))
  )
}