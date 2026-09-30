// components/dashboard/inventory/add-branch-modal.tsx
'use client'

import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { addBranchSchema, type AddBranchFormValues } from '@/lib/validations/branch'
import { cn } from '@/lib/utils'

const states = ['Lagos', 'Oyo', 'Osun', 'Ogun', 'Kwara']
const managers = ['Oluwagbotemi Babatunde', 'Chidinma Okafor', 'Ibrahim Suleiman']
const fuelKeys = ['PMS', 'AGO', 'DPK', 'Gas'] as const

interface AddBranchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (values: AddBranchFormValues) => void
  defaultState?: string
}

export function AddBranchModal({ open, onOpenChange, onCreated, defaultState }: AddBranchModalProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddBranchFormValues>({
    resolver: zodResolver(addBranchSchema),
    defaultValues: {
      branchName: '',
     locationState: defaultState ?? '',
      address: '',
      managerId: '',
      stationId: '',
      fuelTypes: {
        PMS: { enabled: false, capacity: '' },
        AGO: { enabled: false, capacity: '' },
        DPK: { enabled: false, capacity: '' },
        Gas: { enabled: false, capacity: '' },
      },
    },
  })

  const fuelTypes = useWatch({control, name: 'fuelTypes'})

  async function onSubmit(values: AddBranchFormValues) {
    // placeholder — real version inserts into Supabase `branches` table
    await new Promise((r) => setTimeout(r, 600))
    onCreated(values)
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[90vw] gap-0 overflow-hidden p-0 sm:!max-w-xl">
        <div className="no-scrollbar max-h-[100vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b px-5 py-2">
            <h2 className="text-lg font-semibold">Add New Branch Location</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Branch Name</label>
                <Input placeholder="e.g. SAO Ikeja North" {...register('branchName')} />
                {errors.branchName && <p className="mt-1 text-xs text-red-500">{errors.branchName.message}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Location State</label>
                <Select defaultValue={defaultState} onValueChange={(v) => { if (typeof v === 'string' && v) setValue('locationState', v) }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.locationState && <p className="mt-1 text-xs text-red-500">{errors.locationState.message}</p>}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Station Address</label>
              <Textarea placeholder="Enter full street address" {...register('address')} />
              {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Assigned Manager</label>
              <Select onValueChange={(v) => { if (typeof v === 'string' && v) setValue('managerId', v) }}>
 
                <SelectTrigger>
                  <SelectValue placeholder="Select a manager" />
                </SelectTrigger>
                <SelectContent>
                  {managers.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.managerId && <p className="mt-1 text-xs text-red-500">{errors.managerId.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Station ID</label>
              <Input placeholder="Enter ID" {...register('stationId')} />
              {errors.stationId && <p className="mt-1 text-xs text-red-500">{errors.stationId.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Fuel Types & Initial Capacity (L)</label>
              <div className="grid grid-cols-2 gap-3">
                {fuelKeys.map((key) => (
                  <div key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={fuelTypes[key].enabled}
                      onChange={(e) => setValue(`fuelTypes.${key}.enabled`, e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span className="w-10 text-sm">{key}</span>
                    <Input
                      placeholder="Capacity"
                      disabled={!fuelTypes[key].enabled}
                      {...register(`fuelTypes.${key}.capacity`)}
                      className="h-8"
                    />
                  </div>
                ))}
              </div>
              {errors.fuelTypes && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.fuelTypes.message ?? errors.fuelTypes.root?.message}
                </p>
              )}
            </div>
          </form>

          <div className="flex items-center justify-between border-t bg-red-50/40 px-5 py-3">
            <p className="text-xs text-gray-400">Powered by smartpay</p>
            <div className="flex gap-2">
              <button
                onClick={() => onOpenChange(false)}
                className={cn(buttonVariants({ variant: 'outline' }))}
              >
                Cancel
              </button>
              <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Branch'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}