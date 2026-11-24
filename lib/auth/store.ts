// lib/auth/store.ts
import { useSyncExternalStore } from 'react'
import { ApiError, rawPost } from './api'
import type { Admin, AuthPayload, MfaState } from './types'

const REFRESH_KEY = 'smartpay_admin_refresh_token'
const REFRESH_SKEW_SECONDS = 60

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'
export type AuthNotice = 'session_expired' | 'inactive' | 'password_updated'

export interface AuthSnapshot {
  status: AuthStatus
  admin: Admin | null
  expiresAt: number // unix seconds, 0 when signed out
  mfa: MfaState | null
  notice: AuthNotice | null
}

const SERVER_SNAPSHOT: AuthSnapshot = { status: 'loading', admin: null, expiresAt: 0, mfa: null, notice: null }

let snapshot: AuthSnapshot = SERVER_SNAPSHOT
let accessToken: string | null = null // memory only, never persisted anywhere
const listeners = new Set<() => void>()

function update(next: Partial<AuthSnapshot>) {
  snapshot = { ...snapshot, ...next }
  listeners.forEach((l) => l())
}

function readRefreshToken() {
  try { return sessionStorage.getItem(REFRESH_KEY) } catch { return null }
}
function writeRefreshToken(token: string) {
  try { sessionStorage.setItem(REFRESH_KEY, token) } catch { /* storage unavailable */ }
}
function removeRefreshToken() {
  try { sessionStorage.removeItem(REFRESH_KEY) } catch { /* storage unavailable */ }
}

export const authStore = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  getSnapshot: () => snapshot,
  getServerSnapshot: () => SERVER_SNAPSHOT,
}

export function useAuth() {
  return useSyncExternalStore(authStore.subscribe, authStore.getSnapshot, authStore.getServerSnapshot)
}

export function startSession(payload: AuthPayload) {
  accessToken = payload.session.access_token
  writeRefreshToken(payload.session.refresh_token)
  update({ status: 'authenticated', admin: payload.admin, expiresAt: payload.session.expires_at, mfa: null, notice: null })
}

export function endSession(notice: AuthNotice | null) {
  accessToken = null
  removeRefreshToken()
  update({ status: 'unauthenticated', admin: null, expiresAt: 0, mfa: null, notice })
}

export function setMfa(mfa: MfaState | null) {
  update({ mfa })
}

export function markPasswordChanged() {
  if (snapshot.admin) update({ admin: { ...snapshot.admin, must_change_password: false } })
}

function flagPasswordChangeRequired() {
  if (snapshot.admin && !snapshot.admin.must_change_password) {
    update({ admin: { ...snapshot.admin, must_change_password: true } })
  }
}

// ---- refresh: single-flight, one failure = signed out, never retried in a loop ----

let refreshInFlight: Promise<AuthPayload> | null = null

export function refreshSession(): Promise<AuthPayload> {
  if (!refreshInFlight) {
    refreshInFlight = runRefresh().finally(() => { refreshInFlight = null })
  }
  return refreshInFlight
}

async function runRefresh(): Promise<AuthPayload> {
  const token = readRefreshToken()
  if (!token) {
    endSession('session_expired')
    throw new ApiError(401, { code: 'session_expired', message: 'You were signed out. Please sign in again.' })
  }
  try {
    const payload = await rawPost<AuthPayload>('smartpay-admin-refresh', { refresh_token: token })
    startSession(payload) // replaces BOTH tokens; the old refresh token is dead now
    return payload
  } catch (err) {
    endSession('session_expired')
    throw err
  }
}

// runs once on page load: restores the session after a reload, or settles on "signed out"
export async function bootstrap() {
  if (snapshot.status !== 'loading') return
  if (!readRefreshToken()) {
    update({ status: 'unauthenticated' })
    return
  }
  try {
    await refreshSession()
  } catch {
    // runRefresh already moved the store to "unauthenticated"
  }
}

// ---- calls that need a signed-in admin ----

export async function authedPost<T>(endpoint: string, body?: unknown): Promise<T> {
  let token = accessToken
  if (!token || snapshot.expiresAt - Date.now() / 1000 < REFRESH_SKEW_SECONDS) {
    token = (await refreshSession()).session.access_token
  }

  try {
    return await rawPost<T>(endpoint, body, token)
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.code === 'session_expired') {
        // one shared refresh, one retry. If refresh fails, the store signs the user out
        const fresh = await refreshSession()
        return rawPost<T>(endpoint, body, fresh.session.access_token)
      }
      if (err.code === 'unauthorized') endSession('session_expired')
      if (err.code === 'password_change_required') flagPasswordChangeRequired()
    }
    throw err
  }
}

export async function logout(opts: { allDevices?: boolean; notice?: AuthNotice | null } = {}) {
  try {
    if (accessToken) {
      await rawPost('smartpay-admin-logout', opts.allDevices ? { all_devices: true } : undefined, accessToken)
    }
  } catch {
    // whatever the result, we sign out locally
  } finally {
    endSession(opts.notice ?? null)
  }
}

export function clearNotice() {
  if (snapshot.notice) update({ notice: null })
}

export function setNotice(notice: AuthNotice | null) {
  update({ notice })
}

export function updateAdmin(patch: { full_name?: string }) {
  if (snapshot.admin) update({ admin: { ...snapshot.admin, ...patch } })
}