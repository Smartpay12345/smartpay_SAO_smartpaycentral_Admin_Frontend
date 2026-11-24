// lib/dashboard/profile-api.ts
import { authedPost } from '@/lib/auth/store'
import type { AdminProfile, ProfileChanges } from './profile-types'
import type { PhotoSlot } from './manager-types'

const call = <T>(endpoint: string, body: object = {}) => authedPost<T>(`sao-admin-${endpoint}`, body)

export const profileApi = {
  get: () => call<{ profile: AdminProfile }>('profile'),
  update: (changes: ProfileChanges) => call<{ profile: AdminProfile }>('profile-update', changes),
  photoUpload: (content_type: string, size: number) => call<PhotoSlot>('profile-photo-upload', { content_type, size }),
}