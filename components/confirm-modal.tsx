// components/confirm-modal.tsx
'use client'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface ConfirmModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string,
  onConfirm: () => void | Promise<void> ,
  confirmText?: string
  isDestructive?: boolean
  headerLabel?: string
  icon?: React.ReactNode
  stackButtons?: boolean
  showBrandFooter?: boolean,
  loadingText?: string
}

export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = 'Confirm',
  loadingText = 'Please wait…',
  isDestructive = false,
  headerLabel,
  icon,
  stackButtons = false,
  showBrandFooter = false,            // new, optional
}: ConfirmModalProps) {

  const [pending, setPending] = useState(false)

  async function handleConfirm(e: React.MouseEvent) {
  e.preventDefault()
  if (pending) return
  setPending(true)
  try {
    await onConfirm()
    onOpenChange(false)
  } catch {
    // the caller shows its own error; the dialog stays open so the user can retry
  } finally {
    setPending(false)
  }
}

function handleOpenChange(next: boolean) {
  if (!next && pending) return // no closing mid-request: outside click, Esc, Cancel
  onOpenChange(next)
}
  return (
   <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="gap-0 overflow-hidden p-0">
        {headerLabel && (
          <div className="flex items-center justify-between bg-red-50/60 px-5 py-3">
            <span className="text-xs font-semibold tracking-wide text-gray-600">{headerLabel}</span>
           <button onClick={() => handleOpenChange(false)} disabled={pending} className="rounded-full p-1 hover:bg-white/60 disabled:opacity-50">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )}

        <div className="p-6">
          {icon && (
            <div className="mb-4 flex justify-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-2xl">
                {icon}
              </span>
            </div>
          )}

          <AlertDialogHeader className={icon ? 'text-center' : undefined}>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className={stackButtons ? 'mt-5 flex-col gap-2 sm:flex-col' : 'mt-5'}>
            <AlertDialogAction
             onClick={handleConfirm}
  disabled={pending}
              className={
                (isDestructive ? 'bg-destructive text-primary-foreground hover:bg-destructive/90 ' : '') +
                (stackButtons ? 'w-full' : '')
              }
            >
               {pending ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      {loadingText}
    </>
  ) : (
    confirmText
  )}
            </AlertDialogAction>
           <AlertDialogCancel disabled={pending} className={stackButtons ? 'w-full' : undefined}>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </div>

        {showBrandFooter && (
          <div className="border-t bg-red-50/40 px-5 py-3 text-center">
            <p className="text-xs text-gray-400">Powered by smartpay</p>
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}