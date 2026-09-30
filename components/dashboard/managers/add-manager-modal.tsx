'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { PhoneInput } from '@/components/ui/phone-input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { addManagerSchema, type AddManagerFormValues } from '@/lib/validations/manager'
import { toast } from 'sonner'

const stations = ['SAO Ikeja Main', 'Idi Ape Branch', 'Akobo Branch', 'Epe Branch', 'Garki Branch']
const roles = ['Station Manager', 'Assistant Manager', 'Regional Manager']

interface AddManagerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (values: AddManagerFormValues, avatarPreview: string | null) => void
}

export function AddManagerModal({ open, onOpenChange, onCreated }: AddManagerModalProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddManagerFormValues>({
    resolver: zodResolver(addManagerSchema),
    defaultValues: {
      fullName: '', managerId: '', phone: '', email: '',
      homeAddress: '', assignedStation: '', role: '', password: '', confirmPassword: '',
    },
  })

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatarPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function onSubmit(values: AddManagerFormValues) {
    // placeholder — real version creates a Supabase auth user + profiles row,
    // and uploads the avatar file to Supabase Storage
    await new Promise((r) => setTimeout(r, 700))
    onCreated(values, avatarPreview)
    toast.success(`${values.fullName} added as a manager`)
    reset()
    setAvatarPreview(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[90vw] gap-0 overflow-hidden p-0 sm:!max-w-2xl">
        <div className="no-scrollbar max-h-[95vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b p-5 py-2 bg-[#E6BDB9]">
            <h2 className="text-lg font-semibold">Add New Manager</h2>

          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-[1fr_auto]">
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Full Name</label>
                  <Input placeholder="e.g. Oluwagbotemi O." {...register('fullName')} />
                  {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Manager ID</label>
                    <Input placeholder="MGR-0000" {...register('managerId')} />
                    {errors.managerId && <p className="mt-1 text-xs text-red-500">{errors.managerId.message}</p>}
                  </div>
                 <div>
  <label className="mb-1.5 block text-sm font-medium">Phone Number</label>
  <Controller
    name="phone"
    control={control}
    render={({ field }) => (
      <PhoneInput value={field.value} onChange={field.onChange} />
    )}
  />
  {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
</div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">Email Address</label>
                  <Input placeholder="manager@saofuelpay.com" {...register('email')} />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">Home Address</label>
                  <Textarea placeholder="Street, City, State, ZIP" {...register('homeAddress')} />
                  {errors.homeAddress && <p className="mt-1 text-xs text-red-500">{errors.homeAddress.message}</p>}
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 sm:w-32 justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarPreview ?? undefined} />
                  <AvatarFallback>?</AvatarFallback>
                </Avatar>
                <label className="cursor-pointer text-center text-sm font-medium text-primary">
                  + Add Picture
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
                 <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Manager'}
            </Button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Assigned Station</label>
                <Select onValueChange={(v) => { if (typeof v === 'string' && v) setValue('assignedStation', v) }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Station" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.assignedStation && <p className="mt-1 text-xs text-red-500">{errors.assignedStation.message}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Role/Level</label>
                <Select onValueChange={(v) => { if (typeof v === 'string' && v) setValue('role', v) }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Create Password</label>
                <Input type="password" {...register('password')} />
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Repeat Password</label>
                <Input type="password" {...register('confirmPassword')} />
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
              </div>
            </div>
          </form>

          <div className="flex items-center justify-between border-t bg-red-50/40 px-5 py-3">
            <p className="text-xs text-gray-400">Powered by smartpay</p>
           
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}