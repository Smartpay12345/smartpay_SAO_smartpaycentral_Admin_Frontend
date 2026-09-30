'use client'

import { useRouter } from 'next/navigation'
import { ConfirmModal } from '@/components/confirm-modal'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Logout } from '@/components/icons'
interface LogoutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LogoutModal({ open, onOpenChange }: LogoutModalProps) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Logged out successfully')
    router.push('/login')
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
      isDestructive
      stackButtons
      showBrandFooter
      onConfirm={handleLogout}
    />
  )
}