import { z } from 'zod'
import { emailField } from '@/lib/validations/fields'

export const generalSettingsSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  supportEmail: emailField,
  timezone: z.string().min(1, 'Select a timezone'),
  currency: z.string().min(1, 'Select a currency'),
})
export type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>

export const addRegionSchema = z.object({
  regionName: z.string().min(2, 'Enter a state or region name'),
})
export type AddRegionValues = z.infer<typeof addRegionSchema>