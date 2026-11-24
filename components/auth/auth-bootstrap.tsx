// components/auth/auth-bootstrap.tsx
'use client'

import { useEffect } from 'react'
import { authStore, bootstrap, logout, refreshSession, useAuth } from '@/lib/auth/store'

const IDLE_LIMIT_MS = 25 * 60 * 1000 // clean UI logout just before the server's 30-minute cut-off
const REFRESH_LEAD_MS = 60 * 1000
const MIN_REFRESH_DELAY_MS = 5 * 1000 // guards against a tight loop if expires_at is ever very close
const ACTIVITY_EVENTS = ['pointerdown', 'pointermove', 'keydown', 'scroll', 'touchstart'] as const

export function AuthBootstrap() {
  const { status, expiresAt } = useAuth()
  const authenticated = status === 'authenticated'

  // restore the session after a page reload
  useEffect(() => {
    void bootstrap()
  }, [])

  // refresh about a minute before the access token expires
  useEffect(() => {
    if (!authenticated) return
    const delay = Math.max(MIN_REFRESH_DELAY_MS, expiresAt * 1000 - REFRESH_LEAD_MS - Date.now())
    const id = window.setTimeout(() => { refreshSession().catch(() => {}) }, delay)
    return () => window.clearTimeout(id)
  }, [authenticated, expiresAt])

  // timers get throttled in background tabs or while a laptop sleeps, so re-check on return
  useEffect(() => {
    if (!authenticated) return
   function onVisible() {
  const { expiresAt: latest } = authStore.getSnapshot()
  if (document.visibilityState === 'visible' && latest * 1000 - Date.now() < REFRESH_LEAD_MS) {
    refreshSession().catch(() => {})
  }
}
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [authenticated])

  // auto-logout after ~25 minutes with no activity
  useEffect(() => {
    if (!authenticated) return

    let timer = window.setTimeout(expire, IDLE_LIMIT_MS)
    let lastReset = Date.now()

    function expire() {
      void logout({ notice: 'inactive' })
    }
    function onActivity() {
      const now = Date.now()
      if (now - lastReset < 1000) return // throttle
      lastReset = now
      window.clearTimeout(timer)
      timer = window.setTimeout(expire, IDLE_LIMIT_MS)
    }

    // capture:true because scroll doesn't bubble, and your pages scroll inside inner containers
    const opts = { capture: true, passive: true } as const
    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, onActivity, opts))
    return () => {
      window.clearTimeout(timer)
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, onActivity, opts))
    }
  }, [authenticated])

  return null
}

