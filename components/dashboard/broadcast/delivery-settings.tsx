// components/dashboard/broadcast/delivery-settings.tsx
'use client'

import { useState } from 'react'
import { Bell, Check, Mail, MessageSquare, Radio, Search, Users, X } from 'lucide-react'
import { BroadcastModalShell, RedCheckbox } from './broadcast-ui'
import { ACCOUNT_DIRECTORY, ACTIVE_ACCOUNT_COUNT } from '@/lib/data/broadcast'
import type { DeliveryChannel, Recipient } from '@/lib/types/broadcast'
import { cn } from '@/lib/utils'

const CHANNELS: {
  key: DeliveryChannel
  title: string
  sub: string
  badge: string
  badgeClass: string
  Icon: React.ComponentType<{ className?: string }>
  iconClass: string
}[] = [
  { key: 'sms', title: 'Direct SMS', sub: 'GSM / Telco Gateway', badge: 'High Priority', badgeClass: 'bg-red-100 text-red-600', Icon: MessageSquare, iconClass: 'text-red-500' },
  { key: 'push', title: 'In-App Push', sub: 'FCM & APNs Instant', badge: 'Free Delivery', badgeClass: 'bg-blue-100 text-blue-600', Icon: Bell, iconClass: 'text-blue-500' },
  { key: 'inbox', title: 'In-App Inbox', sub: 'Persistent Bulletin', badge: 'Optional', badgeClass: 'bg-orange-100 text-orange-600', Icon: Mail, iconClass: 'text-green-600' },
]

interface ChannelPickerProps {
  selected: DeliveryChannel[]
  onChange: (next: DeliveryChannel[]) => void
  error?: string
}

export function ChannelPicker({ selected, onChange, error }: ChannelPickerProps) {
  const allSelected = selected.length === CHANNELS.length

  function toggle(key: DeliveryChannel) {
    onChange(selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key])
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Radio className="h-4 w-4 text-red-500" /> Dispatch Delivery Channels
        </p>
        <button
          type="button"
          onClick={() => onChange(allSelected ? [] : CHANNELS.map((c) => c.key))}
          className="text-xs text-gray-500 hover:text-gray-900"
        >
          Select all that apply
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {CHANNELS.map(({ key, title, sub, badge, badgeClass, Icon, iconClass }) => {
          const checked = selected.includes(key)
          return (
            <button
              key={key}
              type="button"
              role="checkbox"
              aria-checked={checked}
              onClick={() => toggle(key)}
              className={cn('rounded-lg border p-3 text-left transition-colors', checked ? 'border-red-200 bg-red-50/40' : 'bg-white hover:bg-gray-50')}
            >
              <div className="mb-2 flex items-start justify-between">
                <Icon className={cn('h-4 w-4', iconClass)} />
                <RedCheckbox checked={checked} />
              </div>
              <p className="text-sm font-semibold text-gray-900">{title}</p>
              <p className="text-[11px] text-gray-400">{sub}</p>
              <span className={cn('mt-2 inline-block rounded px-1.5 py-0.5 text-[10px] font-medium', badgeClass)}>{badge}</span>
            </button>
          )
        })}
      </div>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  )
}

const AVATAR_COLORS = ['bg-red-100 text-red-600', 'bg-blue-100 text-blue-600', 'bg-green-100 text-green-600', 'bg-amber-100 text-amber-700']

function avatarColor(id: string) {
  const sum = [...id].reduce((total, ch) => total + ch.charCodeAt(0), 0)
  return AVATAR_COLORS[sum % AVATAR_COLORS.length]
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
}

interface RecipientPickerProps {
  recipients: Recipient[]
  onChange: (next: Recipient[]) => void
  sendToAll: boolean
  onSendToAllChange: (v: boolean) => void
  error?: string
}

export function RecipientPicker({ recipients, onChange, sendToAll, onSendToAllChange, error }: RecipientPickerProps) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  const q = query.trim().toLowerCase()
  const qDigits = q.replace(/\D/g, '')
  const matches =
    q === ''
      ? []
      : ACCOUNT_DIRECTORY.filter(
          (a) =>
            !recipients.some((r) => r.id === a.id) &&
            (a.name.toLowerCase().includes(q) || (qDigits !== '' && a.phone.replace(/\D/g, '').includes(qDigits)))
        )

  function add(account: Recipient) {
    onChange([...recipients, account])
    setQuery('')
  }

  return (
    <div>
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <div className="relative w-full sm:max-w-[230px]">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            disabled={sendToAll}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search an Account number"
            className="w-full rounded-lg border bg-gray-50 py-2 pl-8 pr-3 text-xs outline-none disabled:opacity-50"
          />
          {focused && q !== '' && (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-y-auto rounded-lg border bg-white shadow-lg">
              {matches.length > 0 ? (
                matches.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    // mousedown fires before the input's blur, so the click isn't lost
                    onMouseDown={(e) => { e.preventDefault(); add(a) }}
                    className="flex w-full flex-col px-3 py-2 text-left text-xs hover:bg-gray-50"
                  >
                    <span className="font-medium text-gray-900">{a.name}</span>
                    <span className="text-gray-400">{a.phone}</span>
                  </button>
                ))
              ) : (
                <p className="px-3 py-2 text-xs text-gray-400">No matching account found</p>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          role="checkbox"
          aria-checked={sendToAll}
          onClick={() => onSendToAllChange(!sendToAll)}
          className="flex items-center gap-1.5 text-xs font-medium text-green-600"
        >
          <span
            className={cn(
              'flex h-4 w-4 items-center justify-center rounded-full border border-green-600',
              sendToAll ? 'bg-green-600 text-white' : 'text-green-600'
            )}
          >
            <Check className="h-2.5 w-2.5" />
          </span>
          Send to all Account
        </button>
      </div>

      <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900">
        <Users className="h-4 w-4 text-gray-500" /> Selected User Recipients
        <span className="rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-medium text-red-500">
          {sendToAll ? 'All accounts' : `${recipients.length} Selected`}
        </span>
      </p>

      {sendToAll ? (
        <p className="rounded-lg bg-green-50 p-3 text-xs text-green-700">
          This broadcast will go to all {ACTIVE_ACCOUNT_COUNT} active accounts.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {recipients.map((r) => (
            <span key={r.id} className="flex items-center gap-2 rounded-lg bg-gray-50 px-2 py-1.5">
              <span className={cn('flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold', avatarColor(r.id))}>
                {initials(r.name)}
              </span>
              <span className="text-[11px] leading-tight">
                <span className="block font-medium text-gray-900">{r.name}</span>
                <span className="block text-gray-400">{r.phone}</span>
              </span>
              <button
                type="button"
                aria-label={`Remove ${r.name}`}
                onClick={() => onChange(recipients.filter((x) => x.id !== r.id))}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {recipients.length === 0 && (
            <p className="text-xs text-gray-400">No recipients yet. Search an account number above.</p>
          )}
        </div>
      )}
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  )
}

interface DeliverySettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  channels: DeliveryChannel[]
  onChannelsChange: (next: DeliveryChannel[]) => void
  recipients: Recipient[]
  onRecipientsChange: (next: Recipient[]) => void
  sendToAll: boolean
  onSendToAllChange: (v: boolean) => void
  errors: Record<string, string>
  onSend: () => void
}

export function DeliverySettingsModal({
  open, onOpenChange, channels, onChannelsChange, recipients, onRecipientsChange,
  sendToAll, onSendToAllChange, errors, onSend,
}: DeliverySettingsModalProps) {
  return (
    <BroadcastModalShell open={open} onOpenChange={onOpenChange} title="Delivery Settings" widthClass="sm:!max-w-2xl">
      <div className="space-y-5 p-5">
        <ChannelPicker selected={channels} onChange={onChannelsChange} error={errors.channels} />
        <RecipientPicker
          recipients={recipients}
          onChange={onRecipientsChange}
          sendToAll={sendToAll}
          onSendToAllChange={onSendToAllChange}
          error={errors.recipients}
        />
        <button
          type="button"
          onClick={onSend}
          className="mx-auto block w-full max-w-sm rounded-full bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700"
        >
          Send Broadcast
        </button>
      </div>
    </BroadcastModalShell>
  )
}