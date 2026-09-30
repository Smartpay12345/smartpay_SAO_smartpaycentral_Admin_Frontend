// app/dashboard/settings/page.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { SettingsNav } from '@/components/dashboard/settings/settings-nav'
import { GeneralSettingsTab } from '@/components/dashboard/settings/general-settings-tab'
import { SecuritySettingsTab } from '@/components/dashboard/settings/security-settings-tab'
import { OperationalRulesTab } from '@/components/dashboard/settings/operational-rules-tab'

type TabKey = 'general' | 'security' | 'operational'

export default function SettingsPage() {
  const [tab, setTab] = useState<TabKey>('general')
  const [regions, setRegions] = useState(['Lagos State', 'Oyo State', 'Osun State', 'Ogun State'])
  const [dirty, setDirty] = useState(false)

  function handleSave() {
    // placeholder — real version persists to Supabase per active tab's data
    toast.success('Changes saved successfully')
    setDirty(false)
  }

  function handleDiscard() {
    toast.info('Changes discarded')
    setDirty(false)
    // real version would refetch/reset form state to last-saved values
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Platform Settings</h1>
          <p className="text-sm text-gray-500">Manage your organization&apos;s core details, security protocols, and operational parameters.</p>
        </div>
        <div className="flex gap-2">
          {tab === 'operational' && dirty && (
            <Button variant="outline" onClick={handleDiscard}>Discard Changes</Button>
          )}
          <Button onClick={handleSave} className="bg-red-700 hover:bg-red-800">
            💾 {tab === 'operational' ? 'Save Rules' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        <SettingsNav active={tab} onChange={setTab} />

        <div>
          {tab === 'general' && (
            <GeneralSettingsTab
              regions={regions}
              onRegionsChange={setRegions}
              formId="general-settings-form"
              onDirtyChange={setDirty}
            />
          )}
          {tab === 'security' && <SecuritySettingsTab />}
          {tab === 'operational' && <OperationalRulesTab onDirtyChange={setDirty} />}
        </div>
      </div>
    </div>
  )
}