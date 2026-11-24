// components/dashboard/account-overview-modal.tsx
'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Mail, Phone, X, LogOut } from 'lucide-react'
import { LogoutModal } from '@/app/dashboard/logout-modal'

interface AccountUser {
  name: string
  role: string
  email: string
  phone: string
  avatarUrl?: string
}

interface AccountOverviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: AccountUser
}

export function AccountOverviewModal({ open, onOpenChange, user }: AccountOverviewModalProps) {
  const [logoutOpen, setLogoutOpen] = useState(false)

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="!max-w-[90vw] gap-0 overflow-hidden p-0 sm:!max-w-md">
          <div className="flex items-center justify-between border-b bg-red-50 p-5 py-3">
            <h2 className="text-lg font-semibold">Overview</h2>
            <button onClick={() => onOpenChange(false)}>
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          <div className="p-5">
            <span className="mb-3 inline-block rounded bg-red-50 px-2.5 py-1 text-xs font-medium text-primary">
              PROFILE DETAIL
            </span>

            <div className="rounded-xl border p-4">
              <div className="mb-4 flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                </div>
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.role}</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex flex-1 items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <div className="text-sm">
                    <p className="text-[10px] font-semibold text-gray-400">Email Address</p>
                    {user.email}
                  </div>
                </div>
                <div className="flex flex-1 items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-400" />
                  <div className="text-sm">
                    <p className="text-[10px] font-semibold text-gray-400">Phone Number</p>
                    {user.phone}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t bg-red-50/40 px-5 py-3">
            <p className="text-xs text-gray-400">Powered by smartpay</p>
            <Button
              onClick={() => { onOpenChange(false); setLogoutOpen(true) }}
              className="gap-2 bg-red-600 hover:bg-red-700"
            >
              <LogOut className="h-4 w-4" /> Log Out
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <LogoutModal open={logoutOpen} onOpenChange={setLogoutOpen} />
    </>
  )
}