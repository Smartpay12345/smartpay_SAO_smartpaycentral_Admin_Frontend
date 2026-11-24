'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AsyncPanel, type PanelState } from '@/lib/dashboard/async-panel'

export interface StaffRow {
  id: string
  name: string
  email: string
  phone: string
  role: string
  dateJoined: string
  statusLabel: string
  status: 'active' | 'off_duty' | 'suspended' | 'deactivated'
}

interface StaffOverviewModalProps {
  state: PanelState<StaffRow[]>
  open: boolean
  onOpenChange: (open: boolean) => void
  onCheckOrder: () => void
}

const STATUS_STYLE: Record<StaffRow['status'], string> = {
  active: 'text-blue-600',
  suspended: 'text-orange-500',
  off_duty: 'text-gray-500',
  deactivated: 'text-gray-500',
}

export function StaffOverviewModal({ state, open, onOpenChange, onCheckOrder }: StaffOverviewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[90vw] gap-0 overflow-hidden p-0 sm:!max-w-3xl">
        <div className="no-scrollbar max-h-[95vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b p-5 py-2 bg-[#E6BDB9]">
            <h2 className="text-lg font-semibold">Overview</h2>
          </div>

          <div className="flex items-center justify-between p-5 pb-3">
            <div>
              <p className="font-medium">This Station</p>
              <p className="text-xs text-gray-400">A statistic of this station inventory</p>
            </div>
            <Button onClick={onCheckOrder} className="bg-[#007AFD] hover:bg-blue-700 px-12">Check Order</Button>
          </div>

          <div className="px-5 pb-5">
            <AsyncPanel state={state} height="h-64">
              {(staff) =>
                staff.length === 0 ? (
                  <p className="py-10 text-center text-sm text-gray-500">No staff found for this station.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px] text-sm">
                      <thead>
                        <tr className="bg-[#F9FAFA] text-left text-xs text-gray-400">
                          <th className="p-2 font-normal">Name</th>
                          <th className="py-2 font-normal">Phone Number</th>
                          <th className="py-2 font-normal">Role/Position</th>
                          <th className="py-2 font-normal">Date Joined</th>
                          <th className="py-2 font-normal">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staff.map((s) => (
                          <tr key={s.id}>
                            <td className="py-3">
                              <p className="font-medium">{s.name}</p>
                              <p className="text-xs text-gray-400">{s.email}</p>
                            </td>
                            <td className="py-3 text[#4B5563]">{s.phone}</td>
                            <td className="py-3 text[#4B5563]">{s.role}</td>
                            <td className="py-3 text[#4B5563]">{s.dateJoined}</td>
                            <td className="py-3 text[#4B5563]">
                              <span className={cn('text-sm font-medium', STATUS_STYLE[s.status])}>
                                {s.statusLabel}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              }
            </AsyncPanel>
          </div>

          <div className="border-t bg-[#E6BDB9] px-5 py-3 text-right">
            <p className="text-xs text-[#5D3F3D]">Powered by smartpay</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}