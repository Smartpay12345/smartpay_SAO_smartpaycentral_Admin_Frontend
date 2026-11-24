// lib/dashboard/call.ts
import { authedPost } from '@/lib/auth/store'

export const call = <T>(endpoint: string, body: object = {}) =>
  authedPost<T>(`smartpay-admin-${endpoint}`, body)