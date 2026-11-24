// lib/validations/profile.ts
import { z } from 'zod'
import { isNigerianPhone } from './phone'

export const profileSchema = z.object({
  full_name: z.string().trim().min(2, 'Enter your full name'),
  phone: z.string().trim().refine((v) => v === '' || isNigerianPhone(v), 'Enter a valid Nigerian phone number'),
})

export type ProfileFormValues = z.infer<typeof profileSchema>