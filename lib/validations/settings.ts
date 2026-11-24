import { z } from 'zod'

export const generalSettingsSchema = z.object({
  companyName: z.string().trim().min(2, 'At least 2 characters').max(80, 'At most 80 characters'),
  supportEmail: z.union([z.literal(''), z.string().trim().email('Enter a valid email')]),
  timezone: z.string(),
  currency: z.string(),
})
export type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>

