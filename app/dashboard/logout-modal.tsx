'use client'

import { useRouter } from 'next/navigation'
import { ConfirmModal } from '@/components/confirm-modal'
import { toast } from 'sonner'
import { Logout } from '@/components/icons'
import { logout } from '@/lib/auth/store'

interface LogoutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LogoutModal({ open, onOpenChange }: LogoutModalProps) {

   const router = useRouter()

async function handleLogout() {
   await logout() // clears tokens even if the request fails
    toast.success('Logged out successfully')
    router.replace('/')
}

  return (
    <ConfirmModal
      open={open}
      onOpenChange={onOpenChange}
      headerLabel="LOG OUT"
      icon={<Logout/>}
      title="Confirm Logout"
      description="Are you sure you want to securely log out of your account? You will need to re-enter your credentials to access your dashboard."
      confirmText="Logout →"
      loadingText="Logging out…"
      isDestructive
      stackButtons
      showBrandFooter
      onConfirm={handleLogout}
    />
  )
}