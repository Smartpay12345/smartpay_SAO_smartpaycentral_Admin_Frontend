// components/dashboard/orders/update-status-modal.tsx
'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import type { OrderStatus } from '@/lib/types/order'

const statuses: OrderStatus[] = ['pending', 'loading', 'in-transit', 'fulfilled', 'cancelled']

interface UpdateStatusModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentStatus: OrderStatus
  onUpdate: (status: OrderStatus) => void
}

export function UpdateStatusModal({ open, onOpenChange, currentStatus, onUpdate }: UpdateStatusModalProps) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit() {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 500)) // placeholder — real Supabase update
    onUpdate(status)
    toast.success('Order status updated')
    setSubmitting(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[90vw] gap-0 p-0 sm:!max-w-sm">
        <div className="border-b p-5">
          <h2 className="text-lg font-semibold">Update Status</h2>
        </div>
        <div className="p-5">
          <label className="mb-1.5 block text-sm font-medium">New Status</label>
          <Select value={status} onValueChange={(v) => { if (typeof v === 'string' && v) setStatus(v as OrderStatus) }}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((s) => (
                <SelectItem key={s} value={s}>{s.replace('-', ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end gap-2 border-t bg-red-50/40 px-5 py-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting}>{submitting ? 'Updating...' : 'Update'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}