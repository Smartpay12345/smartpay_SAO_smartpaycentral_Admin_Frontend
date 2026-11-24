// hooks/use-countdown.ts
'use client'

import { useEffect, useRef, useState } from 'react'

// for lockouts (account_locked), rate limits, and the OTP resend button
export function useCountdown() {
  const [remaining, setRemaining] = useState(0)
  const endsAt = useRef(0)
  const active = remaining > 0

  useEffect(() => {
    if (!active) return
    const id = window.setInterval(() => {
      setRemaining(Math.max(0, Math.ceil((endsAt.current - Date.now()) / 1000)))
    }, 250)
    return () => window.clearInterval(id)
  }, [active])

  function start(seconds: number) {
    endsAt.current = Date.now() + seconds * 1000
    setRemaining(Math.ceil(seconds))
  }

  return { remaining, active, start }
}

export function formatCountdown(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}