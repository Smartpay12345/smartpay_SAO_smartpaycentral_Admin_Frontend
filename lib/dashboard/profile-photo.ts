// lib/dashboard/profile-photo.ts
import { supabase } from '@/lib/supabase/client'
import { profileApi } from './profile-api'
import { cropSquare, PhotoUploadError } from './manager-photo'

// returns the photo_path to send with profile-update
export async function uploadProfilePhoto(file: File): Promise<string> {
  try {
    const blob = await cropSquare(file)
    const slot = await profileApi.photoUpload('image/jpeg', blob.size)
    const { error } = await supabase.storage
      .from(slot.bucket)
      .uploadToSignedUrl(slot.photo_path, slot.token, blob, { contentType: slot.content_type })
    if (error) throw error
    return slot.photo_path
  } catch {
    throw new PhotoUploadError('Photo upload failed')
  }
}