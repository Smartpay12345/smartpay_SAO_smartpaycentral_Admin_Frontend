'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface StaffRow {
  name: string
  email: string
  phone: string
  role: string
  dateJoined: string
  status: 'active' | 'suspended'
}

interface StaffOverviewModalProps {
  staff: StaffRow[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onCheckOrder: () => void
}

export function StaffOverviewModal({ staff, open, onOpenChange, onCheckOrder }: StaffOverviewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[90vw] gap-0 overflow-hidden p-0 sm:!max-w-3xl">
        <div className="no-scrollbar max-h-[95vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b p-5 py-2 bg-[#E6BDB9]">
            <h2 className="text-lg font-semibold">Overview</h2>
            {/* <button onClick={() => onOpenChange(false)} className="rounded-full p-1 hover:bg-gray-100">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button> */}
          </div>

          <div className="flex items-center justify-between p-5 pb-3">
            <div>
              <p className="font-medium">This Station</p>
              <p className="text-xs text-gray-400">A statistic of this station inventory</p>
            </div>
            <Button onClick={onCheckOrder} className="bg-blue-600 hover:bg-blue-700 px-12">Check Order</Button>
          </div>

          <div className="overflow-x-auto px-5 pb-5">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-gray-400">
                  <th className="py-2 font-normal">Name</th>
                  <th className="py-2 font-normal">Phone Number</th>
                  <th className="py-2 font-normal">Role/Position</th>
                  <th className="py-2 font-normal">Date Joined</th>
                  <th className="py-2 font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((s, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-3">
                      <p className="font-medium">{s.name}</p>
                      <p className="text-xs text-gray-400">{s.email}</p>
                    </td>
                    <td className="py-3">{s.phone}</td>
                    <td className="py-3">{s.role}</td>
                    <td className="py-3">{s.dateJoined}</td>
                    <td className="py-3">
                      <span
                        className={cn(
                          'text-sm font-medium',
                          s.status === 'active' ? 'text-blue-600' : 'text-orange-500'
                        )}
                      >
                        {s.status === 'active' ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t bg-red-50/40 px-5 py-3 text-center">
            <p className="text-xs text-gray-400">Powered by smartpay</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}