'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button, buttonVariants } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ReasonModal } from './reason-modal'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Mail, Phone, MapPin, CalendarDays } from 'lucide-react'
import type { Manager } from '@/lib/types/manager'
import { RedPump, Suspend, Delete } from '@/components/icons'

interface ManagerOverviewModalProps {
  manager: Manager | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (managerId: string, status: 'active' | 'suspended' | 'removed') => void
}

export function ManagerOverviewModal({ manager, open, onOpenChange, onStatusChange }: ManagerOverviewModalProps) {
  const [reasonAction, setReasonAction] = useState<'Suspend' | 'Remove' | null>(null)

  if (!manager) return null
  const m = manager

  async function handleConfirmAction(reason: string) {
    await new Promise((r) => setTimeout(r, 600))

    if (reasonAction === 'Suspend') {
      onStatusChange(m.id, 'suspended')
      toast.success(`${m.name} has been suspended${reason ? ` — ${reason}` : ''}`)
    } else if (reasonAction === 'Remove') {
      onStatusChange(m.id, 'removed')
      toast.success(`${m.name} has been removed${reason ? ` — ${reason}` : ''}`)
    }
    setReasonAction(null)
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="!max-w-[90vw] gap-0 overflow-hidden p-0 sm:!max-w-lg lg:!max-w-2xl xl:!max-w-2xl">
          <div className="no-scrollbar max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b p-5 py-3 bg-[#E6BDB9]">
              <h2 className="text-lg font-semibold">Overview</h2>
            </div>

            <div className="p-5">
              <span className="mb-4 inline-block rounded bg-red-50 px-2.5 py-1 text-xs font-medium text-primary">
                PROFILE DETAIL
              </span>

              <div className="flex flex-col gap-6 rounded-xl border p-5 shadow-md">
                <div className="flex items-center justify-center gap-3">
                  <div className="relative">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={m.avatarUrl} alt={m.name} />
                      <AvatarFallback>{m.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500" />
                  </div>
                  <div>
                    <p className="font-semibold">{m.name}</p>
                    <p className="text-xs text-gray-400">ID: {m.managerId}</p>
                  </div>
                </div>

                {/* ROW 1 — Contact Info: 2 equal-width columns */}
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="flex flex-1 flex-col gap-4">
                    <div className="flex gap-2">
                      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#78ACFF33]">
                        <Mail className="h-4 w-4 text-blue-400" />
                      </div>
                      <div className="text-sm text-[#1A1C1E]">
                        <p className="text-[10px] font-semibold text-[#5D3F3D]">Email Address</p>
                        {m.email}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#78ACFF33]">
                        <Phone className="h-4 w-4 text-blue-400" />
                      </div>
                      <div className="text-sm text-[#1A1C1E]">
                        <p className="text-[10px] font-semibold text-[#5D3F3D]">Phone Number</p>
                        {m.phone}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-1 items-center gap-2 rounded border shadow px-5">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                      <RedPump className="h-4 w-4" />
                    </div>
                    <div className="text-center text-sm text-[#1A1C1E]">
                      <p className="text-[10px] font-semibold text-[#5D3F3D]">Assigned Station</p>
                      <p className="font-medium">{m.assignedStation}</p>
                      <p className="flex items-center justify-center gap-1 text-xs text-gray-400">
                       <MapPin className="h-3 w-3 text-[#5D3F3D]" /> {m.location}
                      </p>
                    </div>
                  </div>
                </div>

         {/* ROW 2 — Tenure (unboxed) + Total Sales + Total Revenue (boxed), still 3 equal-width columns */}
<div className="flex flex-col gap-4 sm:flex-row">
<div className="flex flex-1 flex-col gap-1 px-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
  <p className="flex items-center gap-1.5 text-xs text-gray-400">
    <CalendarDays className="h-4 w-4 shrink-0" /> Tenure
  </p>
  <div className="flex flex-col text-sm">
    <p className="text-right font-medium sm:text-right">Joined {m.joinedYear}</p>
    <p className="text-left text-xs text-gray-400">{m.yearsOfService} years of service</p>
  </div>
</div>

  <div className="flex-1 rounded-lg border p-3">
    <p className="flex items-center gap-1.5 text-xs text-gray-400">
      <span className="text-green-500">↗</span> Total Sales
    </p>
    <p className="mt-1 font-semibold">{m.totalSales}</p>
    <p className="text-xs text-gray-400">Total volume moved</p>
  </div>

  <div className="flex-1 rounded-lg border p-3">
    <p className="flex items-center gap-1.5 text-xs text-gray-400">
      <span>₦</span> Total Revenue
    </p>
    <p className="mt-1 font-semibold">{m.totalRevenue}</p>
    <p className="text-xs text-gray-400">Gross revenue generated</p>
  </div>
</div>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t bg-red-50/40 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-gray-400">Powered by smartpay</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setReasonAction('Remove')}
                  className={cn(buttonVariants({ variant: 'outline' }))}
                >
                 <Delete/> Remove Manager
                </button>
                <Button
                  onClick={() => setReasonAction('Suspend')}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                 <Suspend/> Suspend Manager
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ReasonModal
        key={`${m?.id ?? 'none'}-${reasonAction ?? 'none'}`}
        open={reasonAction !== null}
        onOpenChange={(o) => !o && setReasonAction(null)}
        actionLabel={reasonAction ?? 'Suspend'}
        managerName={m.name}
        destructive
        onConfirm={handleConfirmAction}
      />
    </>
  )
}