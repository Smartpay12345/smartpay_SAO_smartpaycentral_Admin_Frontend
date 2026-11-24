// lib/auth/notices.ts
import type { AuthNotice } from './store'

export const AUTH_NOTICE_TEXT: Record<AuthNotice, string> = {
  session_expired: 'You were signed out. Please sign in again.',
  inactive: 'You were signed out after a period of inactivity.',
  password_updated: 'Password updated. You can now sign in.',
}

// the Login page reads ?notice=... and shows the matching banner
export function parseNotice(value: string | null): AuthNotice | null {
  return value && Object.hasOwn(AUTH_NOTICE_TEXT, value) ? (value as AuthNotice) : null
}