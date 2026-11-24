'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { appUsersApi } from '@/lib/dashboard/app-users-api'
import type { AppUserListItem } from '@/lib/types/app-user'

export function MessageUserContent({ user, onSent }: { user: AppUserListItem; onSent: () => void }) {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)

  const canSend = subject.trim().length > 0 && body.trim().length > 0 && !sending

  async function handleSend() {
    if (!canSend) return
    setSending(true)
    try {
      await appUsersApi.sendMessage({ id: user.id, title: subject.trim(), body: body.trim() })
      toast.success(`Message sent to ${user.full_name}`)
      setSubject('')
      setBody('')
      onSent()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't send the message. Please try again.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className=" p-4">
      <p className="mb-3 text-sm font-semibold text-gray-900">Message This user</p>
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-500">
          {user.full_name.charAt(0)}
        </span>
        <div>
          <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
          <p className="text-xs text-gray-400">Receiver ({user.email})</p>
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Subject</label>
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={65} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Message Body</label>
          <Textarea rows={5} value={body} onChange={(e) => setBody(e.target.value)} maxLength={240} />
            <p className="mt-1 text-right text-[11px] text-gray-400">{body.length}/240</p>
        </div>
        <Button onClick={handleSend} disabled={!canSend} className="bg-blue-600 hover:bg-blue-700">
          {sending ? 'Sending...' : 'Send Message'}
        </Button>
      </div>
    </div>
  )
}