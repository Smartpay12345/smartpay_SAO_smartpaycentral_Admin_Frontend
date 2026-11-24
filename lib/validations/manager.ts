import { z } from 'zod'
import { isNigerianPhone } from './phone'

export const addManagerSchema = z.object({
  full_name: z.string().trim().min(2, 'Enter the full name'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z.string().trim().refine(isNigerianPhone, 'Enter a valid Nigerian phone number'),
  home_address: z.string().trim(),
  station_id: z.string().min(1, 'Select a station'),
  level: z.string().min(1, 'Select a level'),
})

export type AddManagerFormValues = z.infer<typeof addManagerSchema>