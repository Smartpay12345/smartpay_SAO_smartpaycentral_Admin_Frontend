'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { addRegionSchema, type AddRegionValues } from '@/lib/validations/settings'
import { toast } from 'sonner'

interface AddRegionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  existingRegions: string[]
  onAdded: (region: string) => void
}

export function AddRegionModal({ open, onOpenChange, existingRegions, onAdded }: AddRegionModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddRegionValues>({
    resolver: zodResolver(addRegionSchema),
    defaultValues: { regionName: '' },
  })

  async function onSubmit(values: AddRegionValues) {
    const formatted = values.regionName.trim().replace(/\s+state$/i, '') + ' State'
    if (existingRegions.includes(formatted)) {
      toast.error(`${formatted} is already an active region`)
      return
    }
    await new Promise((r) => setTimeout(r, 400)) // placeholder — real Supabase update
    onAdded(formatted)
    toast.success(`${formatted} added to active regions`)
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[90vw] gap-0 p-0 sm:!max-w-sm">
        <div className="border-b p-5">
          <h2 className="text-lg font-semibold">Add New Region</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-5">
          <label className="mb-1.5 block text-sm font-medium">State / Region Name</label>
          <Input placeholder="e.g. Kwara" {...register('regionName')} />
          {errors.regionName && <p className="mt-1 text-xs text-red-500">{errors.regionName.message}</p>}
        </form>
        <div className="flex justify-end gap-2 border-t bg-red-50/40 px-5 py-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Region'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}