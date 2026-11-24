// app/dashboard/app-users/broadcast/page.tsx
'use client'

import { useState } from 'react'
import { Megaphone } from 'lucide-react'
import { toast } from 'sonner'
import { BackButton } from '@/components/back-button'
import { ConfirmModal } from '@/components/confirm-modal'
import { BroadcastStats } from '@/components/dashboard/broadcast/broadcast-stats'
import { CreateTemplateTab } from '@/components/dashboard/broadcast/create-template-tab'
import { AllTemplatesTab } from '@/components/dashboard/broadcast/all-templates-tab'
import { SendBroadcastTab } from '@/components/dashboard/broadcast/send-broadcast-tab'
import { DeliverySettingsModal } from '@/components/dashboard/broadcast/delivery-settings'
import { ScheduleModal } from '@/components/dashboard/broadcast/schedule-modal'
import { ImportTemplateModal, TemplatePreviewModal } from '@/components/dashboard/broadcast/template-modals'
import { ACCOUNT_DIRECTORY, DEFAULT_RECIPIENT_IDS, INITIAL_TEMPLATES, mockScheduledDates } from '@/lib/data/broadcast'
import { validateBroadcast, type TemplateFormValues } from '@/lib/validations/broadcast'
import type { BroadcastDraft, BroadcastTemplate, DeliveryChannel, Recipient } from '@/lib/types/broadcast'
import { cn } from '@/lib/utils'

const TABS = [
  { key: 'create', label: 'Create New' },
  { key: 'templates', label: 'All Template' },
  { key: 'send', label: 'Send Broadcast' },
] as const
type TabKey = (typeof TABS)[number]['key']

export default function BroadcastPage() {
  const [tab, setTab] = useState<TabKey>('create')
  const [templates, setTemplates] = useState(INITIAL_TEMPLATES)

  // shared by the Send Broadcast tab AND the Delivery Settings modal, so it lives here
  const [draft, setDraft] = useState<BroadcastDraft>({ title: '', body: '' })
  const [channels, setChannels] = useState<DeliveryChannel[]>(['sms', 'push'])
  const [recipients, setRecipients] = useState<Recipient[]>(
    ACCOUNT_DIRECTORY.filter((a) => DEFAULT_RECIPIENT_IDS.includes(a.id))
  )
  const [sendToAll, setSendToAll] = useState(false)
  const [attempted, setAttempted] = useState(false)

  const [deliveryOpen, setDeliveryOpen] = useState(false)
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [scheduleKey, setScheduleKey] = useState(0)
  const [sending, setSending] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<BroadcastTemplate | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<BroadcastTemplate | null>(null)
  const [scheduledDates] = useState(() => mockScheduledDates())

  // derived on every render, so a fixed field never keeps a stale error
  const validation = validateBroadcast({
    title: draft.title,
    body: draft.body,
    channels,
    sendToAll,
    recipientCount: recipients.length,
  })
  const errors = attempted ? validation.errors : {}

  function handleSaveTemplate(values: TemplateFormValues) {
    const created: BroadcastTemplate = {
      id: crypto.randomUUID(),
      title: values.title,
      body: values.body,
      createdLabel: 'Just now',
      usedCount: 0,
      deliveryRate: '—',
    }
    setTemplates((prev) => [created, ...prev])
    setTab('templates')
    toast.success('Template saved')
  }

  function handleUseTemplate(t: BroadcastTemplate) {
    setDraft({ title: t.title, body: t.body })
    setAttempted(false)
    setDeliveryOpen(true)
  }

  function handleImportTemplate(t: BroadcastTemplate) {
    setDraft({ title: t.title, body: t.body })
    setImportOpen(false)
    toast.success(`"${t.title}" imported`)
  }

  function openPreview(t: BroadcastTemplate) {
    setPreviewTemplate(t)
    setPreviewOpen(true)
  }

  function handleSend() {
    setAttempted(true)
    if (!validation.ok) {
      // the delivery modal has no title/body fields, so surface those problems as a toast there
      const draftProblem = validation.errors.title ?? validation.errors.body
      if (draftProblem && deliveryOpen) toast.error(draftProblem)
      return
    }
    setDeliveryOpen(false)
    setScheduleKey((k) => k + 1) // fresh state every time the scheduling modal opens
    setScheduleOpen(true)
  }

  async function finishSend(when: Date | null) {
    setSending(true)
    await new Promise((r) => setTimeout(r, 600)) // placeholder — real version calls an edge function that queues the broadcast per channel
    setSending(false)
    setScheduleOpen(false)
    setAttempted(false)
    setDraft({ title: '', body: '' })

    const audience = sendToAll
      ? 'all active accounts'
      : `${recipients.length} recipient${recipients.length === 1 ? '' : 's'}`
    toast.success(
      when
        ? `Broadcast scheduled for ${when.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })} · ${audience}`
        : `Broadcast sent to ${audience}`
    )
  }

  return (
    <div className="space-y-6 rounded-lg border bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
            <Megaphone className="h-4 w-4" />
          </span>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">User Communication &amp; Broadcast Composer</h1>
            <p className="text-sm text-gray-500">
              Send targeted multi-channel SMS alerts, high-priority push updates, or customer inbox bulletins to curated user cohorts and individual FuelPay account holders.
            </p>
          </div>
        </div>
        <BackButton fallbackHref="/dashboard/app-users" />
      </div>

      <BroadcastStats />

      <div className="flex gap-6 overflow-x-auto border-b text-sm">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              'shrink-0 whitespace-nowrap pb-2',
              tab === t.key ? 'border-b-2 border-primary font-medium text-primary' : 'text-gray-400'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'create' && <CreateTemplateTab onSave={handleSaveTemplate} />}

      {tab === 'templates' && (
        <AllTemplatesTab
          templates={templates}
          onPreview={openPreview}
          onUse={handleUseTemplate}
          onDelete={setDeleteTarget}
        />
      )}

      {tab === 'send' && (
        <SendBroadcastTab
          draft={draft}
          onDraftChange={setDraft}
          channels={channels}
          onChannelsChange={setChannels}
          recipients={recipients}
          onRecipientsChange={setRecipients}
          sendToAll={sendToAll}
          onSendToAllChange={setSendToAll}
          errors={errors}
          onImportClick={() => setImportOpen(true)}
          onSend={handleSend}
        />
      )}

      <DeliverySettingsModal
        open={deliveryOpen}
        onOpenChange={setDeliveryOpen}
        channels={channels}
        onChannelsChange={setChannels}
        recipients={recipients}
        onRecipientsChange={setRecipients}
        sendToAll={sendToAll}
        onSendToAllChange={setSendToAll}
        errors={errors}
        onSend={handleSend}
      />

      <ScheduleModal
        key={scheduleKey}
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
        onSendNow={() => finishSend(null)}
        onSchedule={(when) => finishSend(when)}
        scheduledDates={scheduledDates}
        busy={sending}
      />

      <ImportTemplateModal
        open={importOpen}
        onOpenChange={setImportOpen}
        templates={templates}
        onImport={handleImportTemplate}
        onPreview={openPreview}
      />

      <TemplatePreviewModal template={previewTemplate} open={previewOpen} onOpenChange={setPreviewOpen} />

      <ConfirmModal
        open={deleteTarget !== null}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete this template?"
        description={`"${deleteTarget?.title ?? ''}" will be permanently removed. Broadcasts already sent are not affected.`}
        confirmText="Delete"
        isDestructive
        onConfirm={() => {
          if (deleteTarget) {
            setTemplates((prev) => prev.filter((t) => t.id !== deleteTarget.id))
            toast.success('Template deleted')
          }
          setDeleteTarget(null)
        }}
      />
    </div>
  )
}