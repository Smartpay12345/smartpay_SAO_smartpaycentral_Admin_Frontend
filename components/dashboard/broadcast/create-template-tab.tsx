// components/dashboard/broadcast/create-template-tab.tsx
'use client'

import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FieldHeader } from './broadcast-ui'
import { BODY_MAX, TITLE_MAX, templateSchema, type TemplateFormValues } from '@/lib/validations/broadcast'

export function CreateTemplateTab({ onSave }: { onSave: (values: TemplateFormValues) => void }) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: { title: '', body: '' },
  })

  const title = useWatch({ control, name: 'title' })
  const body = useWatch({ control, name: 'body' })

  async function submit(values: TemplateFormValues) {
    await new Promise((r) => setTimeout(r, 400)) // placeholder — real version inserts into Supabase `broadcast_templates`
    onSave(values)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      <p className="text-sm font-semibold text-gray-900">Template details</p>

      <div>
        <FieldHeader label="Broadcast Title / Push Heading" count={title.length} max={TITLE_MAX} unit="characters" />
        <Input maxLength={TITLE_MAX} className="bg-gray-50" {...register('title')} />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
      </div>

      <div>
        <FieldHeader label="Message Content (SMS & In-App)" count={body.length} max={BODY_MAX} unit="chars" />
        <Textarea rows={7} maxLength={BODY_MAX} className="bg-gray-50" {...register('body')} />
        {errors.body && <p className="mt-1 text-xs text-red-500">{errors.body.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mx-auto block w-full rounded-full bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 sm:w-1/2"
      >
        {isSubmitting ? 'Saving...' : 'Save this template'}
      </button>
    </form>
  )
}