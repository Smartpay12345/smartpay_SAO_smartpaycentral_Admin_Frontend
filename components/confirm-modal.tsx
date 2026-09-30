// components/confirm-modal.tsx
'use client'

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
  description: string
  onConfirm: () => void
  confirmText?: string
  isDestructive?: boolean
  // new, all optional — existing callers (e.g. inventory delete) are unaffected
  headerLabel?: string
  icon?: React.ReactNode
  stackButtons?: boolean
  showBrandFooter?: boolean
}

export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = 'Confirm',
  isDestructive = false,
  headerLabel,
  icon,
  stackButtons = false,
  showBrandFooter = false,
}: ConfirmModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="gap-0 overflow-hidden p-0">
        {headerLabel && (
          <div className="flex items-center justify-between bg-red-50/60 px-5 py-3">
            <span className="text-xs font-semibold tracking-wide text-gray-600">{headerLabel}</span>
            <button onClick={() => onOpenChange(false)} className="rounded-full p-1 hover:bg-white/60">
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
              onClick={onConfirm}
              className={
                (isDestructive ? 'bg-destructive text-primary-foreground hover:bg-destructive/90 ' : '') +
                (stackButtons ? 'w-full' : '')
              }
            >
              {confirmText}
            </AlertDialogAction>
            <AlertDialogCancel className={stackButtons ? 'w-full' : undefined}>Cancel</AlertDialogCancel>
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