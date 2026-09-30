'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Key, Password } from '@/components/icons'

export function SecuritySettingsTab() {
  const [twoFA, setTwoFA] = useState(true)
  const [minLength, setMinLength] = useState('12 Characters')
  const [expiration, setExpiration] = useState('Every 90 Days')
  const [requireUppercase, setRequireUppercase] = useState(true)
  const [requireNumber, setRequireNumber] = useState(true)
  const [requireSpecial, setRequireSpecial] = useState(true)

  return (
    <div className="space-y-4 border p-4 rounded-xl bg-[#FFFFFF]">
      <div>
        <h1 className='font-bold text-2xl text-[#291716]'>Security & Access</h1>
        <p className='text-sm text-[#5D3F3D]'>Manage authentication methods, password policies, and role-based permissions for your portal users</p>
      </div>
      <div className="rounded-xl border bg-[#F9F9FC] p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-lg"><Key/></span>
            <div>
              <p className="font-semibold">Two-Factor Authentication (2FA)</p>
              <p className="text-sm text-gray-500">
                Require all administrative and managerial accounts to use an authenticator app or SMS verification upon login.
              </p>
            </div>
          </div>
          <button
            onClick={() => setTwoFA((v) => !v)}
            className={`h-6 w-11 shrink-0 rounded-full transition-colors ${twoFA ? 'bg-primary' : 'bg-gray-200'}`}
          >
            <span className={`block h-5 w-5 rounded-full bg-white shadow transition-transform ${twoFA ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>

      <div className="rounded-xl border bg-[#F9F9FC] p-5">
        <p className="mb-4 flex items-center gap-2 font-semibold"><Password/> Password Policy</p>

        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Minimum Length</label>
            <Select value={minLength} onValueChange={(v) => { if (typeof v === 'string' && v) setMinLength(v) }}>
              <SelectTrigger className="w-full bg-[#FFF8F7]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['8 Characters', '10 Characters', '12 Characters'].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Expiration</label>
            <Select value={expiration} onValueChange={(v) => { if (typeof v === 'string' && v) setExpiration(v) }}>
              <SelectTrigger className="w-full bg-[#FFF8F7]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['Every 30 Days', 'Every 90 Days', 'Never'].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Checkbox label="Require at least one uppercase letter" checked={requireUppercase} onChange={setRequireUppercase} />
          <Checkbox label="Require at least one number" checked={requireNumber} onChange={setRequireNumber} />
          <Checkbox label="Require at least one special character (!@#$%^&*)" checked={requireSpecial} onChange={setRequireSpecial} />
        </div>
      </div>
    </div>
  )
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-primary"
      />
      {label}
    </label>
  )
}