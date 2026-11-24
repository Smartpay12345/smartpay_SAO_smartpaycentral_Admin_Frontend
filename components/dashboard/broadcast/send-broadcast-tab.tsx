// components/dashboard/broadcast/send-broadcast-tab.tsx
'use client'

import { ChevronDown, FileText } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FieldHeader } from './broadcast-ui'
import { ChannelPicker, RecipientPicker } from './delivery-settings'
import { BODY_MAX, TITLE_MAX } from '@/lib/validations/broadcast'
import type { BroadcastDraft, DeliveryChannel, Recipient } from '@/lib/types/broadcast'

interface SendBroadcastTabProps {
  draft: BroadcastDraft
  onDraftChange: (d: BroadcastDraft) => void
  channels: DeliveryChannel[]
  onChannelsChange: (next: DeliveryChannel[]) => void
  recipients: Recipient[]
  onRecipientsChange: (next: Recipient[]) => void
  sendToAll: boolean
  onSendToAllChange: (v: boolean) => void
  errors: Record<string, string>
  onImportClick: () => void
  onSend: () => void
}

export function SendBroadcastTab({
  draft, onDraftChange, channels, onChannelsChange, recipients, onRecipientsChange,
  sendToAll, onSendToAllChange, errors, onImportClick, onSend,
}: SendBroadcastTabProps) {
  return (
    <div className="grid grid-cols-1 gap-6 rounded-xl border p-5 xl:grid-cols-2 xl:gap-0">
      <div className="space-y-6 xl:pr-6">
        <ChannelPicker selected={channels} onChange={onChannelsChange} error={errors.channels} />
        <RecipientPicker
          recipients={recipients}
          onChange={onRecipientsChange}
          sendToAll={sendToAll}
          onSendToAllChange={onSendToAllChange}
          error={errors.recipients}
        />
      </div>

      <div className="space-y-4 xl:border-l xl:pl-6">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onImportClick}
            className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
          >
            <FileText className="h-3.5 w-3.5" /> Import Template <ChevronDown className="h-3 w-3" />
          </button>
        </div>

        <p className="text-sm font-semibold text-gray-900">Template details</p>

        <div>
          <FieldHeader label="Broadcast Title / Push Heading" count={draft.title.length} max={TITLE_MAX} unit="characters" />
          <Input
            value={draft.title}
            maxLength={TITLE_MAX}
            onChange={(e) => onDraftChange({ ...draft, title: e.target.value })}
            className="bg-gray-50"
          />
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
        </div>

        <div>
          <FieldHeader label="Message Content (SMS & In-App)" count={draft.body.length} max={BODY_MAX} unit="chars" />
          <Textarea
            rows={7}
            value={draft.body}
            maxLength={BODY_MAX}
            onChange={(e) => onDraftChange({ ...draft, body: e.target.value })}
            className="bg-gray-50"
          />
          {errors.body && <p className="mt-1 text-xs text-red-500">{errors.body}</p>}
        </div>

        <button
          type="button"
          onClick={onSend}
          className="w-full rounded-full bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700"
        >
          Send Broadcast
        </button>
      </div>
    </div>
  )
}