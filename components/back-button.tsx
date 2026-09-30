'use client'

import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import type { VariantProps } from 'class-variance-authority'
import { buttonVariants } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BackButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  label?: string
  icon?: ReactNode
  fallbackHref?: string
}

export function BackButton({
  label = 'Back',
  icon,
  variant = 'outline',
  size,
  fallbackHref = '/dashboard',
  className,
  onClick,
  ...props
}: BackButtonProps) {
  const router = useRouter()

  const resolvedIcon = icon ?? (
    <ArrowLeft className={cn('h-4 w-4', variant === 'outline' && 'text-primary')} />
  )

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    if (onClick) {
      onClick(e)
      return
    }
    if (window.history.length > 1) router.back()
    else router.push(fallbackHref)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {resolvedIcon}
      {label && <span>{label}</span>}
    </button>
  )
}