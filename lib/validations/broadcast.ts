// lib/validations/broadcast.ts
import { z } from 'zod'

export const TITLE_MAX = 60
export const BODY_MAX = 320

export const templateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Add a heading (at least 3 characters)')
    .max(TITLE_MAX, `Heading can't exceed ${TITLE_MAX} characters`),
  body: z
    .string()
    .trim()
    .min(10, 'Message is too short (at least 10 characters)')
    .max(BODY_MAX, `Message can't exceed ${BODY_MAX} characters`),
})
export type TemplateFormValues = z.infer<typeof templateSchema>

export const broadcastSchema = templateSchema
  .extend({
    channels: z.array(z.enum(['sms', 'push', 'inbox'])).min(1, 'Select at least one delivery channel'),
    sendToAll: z.boolean(),
    recipientCount: z.number(),
  })
  .refine((d) => d.sendToAll || d.recipientCount > 0, {
    message: 'Add at least one recipient or choose Send to all Account',
    path: ['recipients'],
  })

export function validateBroadcast(input: {
  title: string
  body: string
  channels: string[]
  sendToAll: boolean
  recipientCount: number
}) {
  const result = broadcastSchema.safeParse(input)
  const errors: Record<string, string> = {}
  if (!result.success) {
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? 'form')
      if (!errors[key]) errors[key] = issue.message
    }
  }
  return { ok: result.success, errors }
}