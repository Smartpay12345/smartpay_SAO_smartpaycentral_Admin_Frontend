// components/dashboard/async-panel.tsx
'use client'

import type { ReactNode } from 'react'
import type { EndpointError } from '@/hooks/use-endpoint'
import { CardError } from '@/components/dashboard/card-error'
import { cn } from '@/lib/utils'

export interface PanelState<T> {
  data?: T
  error?: EndpointError
  retry: () => void
}

// shows an error or a skeleton while loading; otherwise renders your own component untouched
export function AsyncPanel<T>({
  state, title, height = 'h-56', children,
}: {
  state: PanelState<T>
  title?: string // when given, the error/skeleton is wrapped in a card with this title
  height?: string
  children: (data: T) => ReactNode
}) {
  const shell = (content: ReactNode) =>
    title ? (
      <div className="rounded-xl border bg-white p-4">
        <h2 className="mb-3 font-medium">{title}</h2>
        {content}
      </div>
    ) : (
      <>{content}</>
    )

  if (state.error) return shell(<CardError error={state.error} onRetry={state.retry} />)
  if (!state.data) return shell(<div className={cn('animate-pulse rounded-xl bg-gray-100', height)} />)
  return <>{children(state.data)}</>
}