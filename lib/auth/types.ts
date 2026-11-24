// lib/auth/types.ts
export interface Session {
  access_token: string
  refresh_token: string
  expires_at: number // unix seconds
}

export interface Admin {
  id: string
  full_name: string
  email: string
  role: string
  must_change_password: boolean
}

export interface AuthPayload {
  session: Session
  admin: Admin
}

export interface MfaChallengeResponse {
  mfa_required: boolean
  mfa_token: string
  mfa_expires_in: number
  resend_available_in: number
  email_hint: string
}

export interface ResendMfaResponse {
  mfa_expires_in: number
  resend_available_in: number
}

// memory-only state for the OTP step; timestamps are ms since epoch
export interface MfaState {
  token: string
  emailHint: string
  expiresAt: number
  resendAvailableAt: number
}


export type LoginResponse = (AuthPayload & { mfa_required: false }) | MfaChallengeResponse