'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface ReasonModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  actionLabel: string
  managerName: string
  destructive?: boolean
  onConfirm: (reason: string) => Promise<void>
}

export function ReasonModal({ open, onOpenChange, actionLabel, managerName, destructive, onConfirm }: ReasonModalProps) {
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)



  async function handleConfirm() {
    setSubmitting(true)
    try {
      await onConfirm(reason)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[90vw] gap-0 p-0 sm:!max-w-md">
        <div className="border-b p-5">
          <h2 className="text-lg font-semibold">{actionLabel} Manager</h2>
          <p className="mt-1 text-sm text-gray-500">
            {actionLabel} {managerName}? You can add a reason for this action below.
          </p>
        </div>

        <div className="p-5">
          <label className="mb-1.5 block text-sm font-medium">Reason (optional)</label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={`Reason for ${actionLabel.toLowerCase()}ing this manager...`}
          />
        </div>

        <div className="flex justify-end gap-2 border-t bg-red-50/40 px-5 py-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={submitting}
            className={destructive ? 'bg-red-600 text-white hover:bg-red-700' : ''}
          >
            {submitting ? `${actionLabel}ing...` : `${actionLabel} Manager`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}