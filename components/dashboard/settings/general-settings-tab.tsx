// components/dashboard/settings/general-settings-tab.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { generalSettingsSchema, type GeneralSettingsValues } from '@/lib/validations/settings'
// import { AddRegionModal } from './add-region-modal'

const timezones = ['West Africa Time (WAT) – UTC+01:00', 'GMT – UTC+00:00']
const currencies = ['Nigerian Naira (₦)', 'US Dollar ($)']

interface GeneralSettingsTabProps {
  regions: string[]
  onRegionsChange: (regions: string[]) => void
  formId: string
  onDirtyChange: (dirty: boolean) => void
}

export function GeneralSettingsTab({ regions, onRegionsChange, formId, onDirtyChange }: GeneralSettingsTabProps) {
  const [addRegionOpen, setAddRegionOpen] = useState(false)

  const {
    register,
    setValue,
    formState: { errors },
  } = useForm<GeneralSettingsValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      companyName: 'SAO FuelPay Logistics',
      supportEmail: 'support@saofuel.com',
      timezone: timezones[0],
      currency: currencies[0],
    },
  })

  function removeRegion(region: string) {
    onRegionsChange(regions.filter((r) => r !== region))
  }

  return (
    <div className="space-y-6">
      {/* General Information Card */}
      <div className="rounded-xl border bg-white p-5 overflow-hidden">
        <div>
          <h2 className="text-lg font-bold text[#291716]">General Information</h2>
          <p className="text-sm text-[#5D3F3D]">Update your company&apos;s basic profile details.</p>
        </div>
      
        {/* Full-width edge-to-edge divider line */}
        <div className="-mx-5 my-5 border-b border-border" />

        <div className="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg border bg-gray-50 text-2xl">🏢</div>
          <div>
            <p className="text-sm text-[#291716] font-semibold">Company Logo</p>
            <p className="text-xs text-[#5D3F3D]">Recommended size 400x400px. JPG, PNG, or SVG. Max 2MB.</p>
            <button type="button" className="mt-2 border  p-2 rounded rounded-lg border-[#E6BDB9] text-xs font-medium text-primary hover:underline">Upload New</button>
          </div>
        </div>

       <form id={formId} className="grid grid-cols-1 gap-4 sm:grid-cols-2" onChange={() => onDirtyChange(true)}>
  <div>
    <label className="mb-1.5 block text-sm font-medium">Company Name</label>
    <Input 
      {...register('companyName')} 
      className="border-[#E6BDB9]  p-5  focus-visible:ring-primary" 
    />
    {errors.companyName && <p className="mt-1 text-xs text-red-500">{errors.companyName.message}</p>}
  </div>

  <div>
    <label className="mb-1.5 block text-sm font-medium">Support Email</label>
    <Input 
      {...register('supportEmail')} 
      className="border-[#E6BDB9] p-5  focus-visible:ring-primary" 
    />
    {errors.supportEmail && <p className="mt-1 text-xs text-red-500">{errors.supportEmail.message}</p>}
  </div>

  <div>
    <label className="mb-1.5 block text-sm font-medium">Default Timezone</label>
    <Select defaultValue={timezones[0]} onValueChange={(v) => { if (typeof v === 'string' && v) { setValue('timezone', v); onDirtyChange(true) } }}>
      <SelectTrigger className="w-full p-5  border-[#E6BDB9] focus:ring-primary">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {timezones.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
      </SelectContent>
    </Select>
  </div>

  <div>
    <label className="mb-1.5 block text-sm font-medium">Currency Format</label>
    <Select defaultValue={currencies[0]} onValueChange={(v) => { if (typeof v === 'string' && v) { setValue('currency', v); onDirtyChange(true) } }}>
      <SelectTrigger className="w-full p-5 border-[#E6BDB9] focus:ring-primary">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {currencies.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
      </SelectContent>
    </Select>
  </div>
</form>
      </div>

      {/* Active Regions Card */}
      <div className="rounded-xl border bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Active Regions</h2>
            <p className="text-sm text-gray-500">Manage the states where you currently operate stations.</p>
          </div>
          <button type="button" onClick={() => setAddRegionOpen(true)} className="text-sm font-medium text-primary hover:underline">
            + Add Region
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {regions.map((region) => (
            <span key={region} className="flex items-center gap-1.5 rounded-full bg-[#FFE1DF] px-3 py-1 font-medium  text-[#291716]">
              {region}
              <button type="button" onClick={() => removeRegion(region)} className="text-[#291716] hover:text-primary">✕</button>
            </span>
          ))}
        </div>
      </div>

      {/* <AddRegionModal
        open={addRegionOpen}
        onOpenChange={setAddRegionOpen}
        existingRegions={regions}
        onAdded={(region) => { onRegionsChange([...regions, region]); onDirtyChange(true) }}
      /> */}
    </div>
  )
}