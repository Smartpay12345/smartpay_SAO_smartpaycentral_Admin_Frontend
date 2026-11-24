// lib/dashboard/profile-types.ts
export interface AdminProfile {
  id: string
  full_name: string
  email: string
  phone: string | null
  avatar_url: string | null
  role: string
  status: string
  last_sign_in_at: string | null
  created_at: string
}

export interface ProfileChanges {
  full_name?: string
  phone?: string
  photo_path?: string
}