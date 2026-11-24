// lib/auth/actions.ts
import { ApiError, rawPost } from './api'
import { authedPost, authStore, markPasswordChanged, setMfa, startSession } from './store'
import type { AuthPayload, LoginResponse, ResendMfaResponse } from './types'

const MFA_GONE = () =>
  new ApiError(401, { code: 'mfa_session_expired', message: 'Your sign-in attempt expired. Please sign in again.' })

const MFA_DEAD = new Set([
  'mfa_session_expired', 'mfa_attempts_exceeded', 'account_locked',
  'account_disabled', 'resend_limit_reached', 'mfa_delivery_failed',
])
const dropMfaIfDead = (err: unknown) => {
  if (err instanceof ApiError && MFA_DEAD.has(err.code)) setMfa(null)
}

export async function login(email: string, password: string) {
  const res = await rawPost<LoginResponse>('smartpay-admin-login', { email, password })

   if ('session' in res) {
    startSession(res)
    return { mfaRequired: false as const, admin: res.admin }
  }
  const now = Date.now()
  setMfa({
    token: res.mfa_token,
    emailHint: res.email_hint,
    expiresAt: now + res.mfa_expires_in * 1000,
    resendAvailableAt: now + res.resend_available_in * 1000,
  })
   return { mfaRequired: true as const }
}

export async function verifyMfa(code: string) {
  const mfa = authStore.getSnapshot().mfa
  if (!mfa) throw MFA_GONE()
  try {
    const payload = await rawPost<AuthPayload>('smartpay-admin-verify-mfa', { mfa_token: mfa.token, code })
    startSession(payload) // also drops the mfa token
    return payload.admin
  } catch (err) {
    dropMfaIfDead(err)
    throw err
  }
}

export async function resendMfa() {
  const mfa = authStore.getSnapshot().mfa
  if (!mfa) throw MFA_GONE()
  try {
    const res = await rawPost<ResendMfaResponse>('smartpay-admin-resend-mfa', { mfa_token: mfa.token })
    const now = Date.now()
    setMfa({ ...mfa, expiresAt: now + res.mfa_expires_in * 1000, resendAvailableAt: now + res.resend_available_in * 1000 })
  } catch (err) {
    dropMfaIfDead(err)
    throw err
  }
}  

export function forgotPassword(email: string) {
  return rawPost<{ message: string }>('smartpay-admin-forgot-password', { email })
}

export function resetPassword(input: { token: string; new_password: string; confirm_password: string }) {
  return rawPost<{ message: string }>('smartpay-admin-reset-password', input)
}

export async function changePassword(input: { current_password: string; new_password: string; confirm_password: string }) {
  await authedPost<{ message: string }>('smartpay-admin-change-password', input)
  markPasswordChanged()
}