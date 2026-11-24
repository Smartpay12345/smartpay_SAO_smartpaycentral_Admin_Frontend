// lib/dashboard/manager-photo.ts
// import { supabase } from '@/lib/supabase/client'
// import { managersApi } from './manager-api'

export class PhotoUploadError extends Error {}

export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const PHOTO_MAX_INPUT = 10 * 1024 * 1024 // before cropping; the result is far smaller

// centered square crop, re-encoded as JPEG
export async function cropSquare(file: File, size = 512): Promise<Blob> {
  const bitmap = await createImageBitmap(file) // respects the phone's rotation
  const side = Math.min(bitmap.width, bitmap.height)
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not available')
  ctx.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, size, size)
  bitmap.close()
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not process the image'))), 'image/jpeg', 0.85),
  )
}

// steps 1 and 2 of the spec; returns the photo_path to send with the create call
// export async function uploadManagerPhoto(file: File): Promise<string> {
//   try {
//     const blob = await cropSquare(file)
//     const slot = await managersApi.photoUpload('image/jpeg', blob.size)
//     const { error } = await supabase.storage
//       .from(slot.bucket)
//       .uploadToSignedUrl(slot.photo_path, slot.token, blob, { contentType: slot.content_type })
//     if (error) throw error
//     return slot.photo_path
//   } catch {
//     throw new PhotoUploadError('Photo upload failed')
//   }
// }