'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Info, Loader2, AlertCircle } from 'lucide-react'
import {Verify} from '@/components/icons'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { bankAccountSchema, type BankAccountFormValues } from '@/lib/validations/auth'

const banks = ['GTBank', 'Access Bank', 'Zenith Bank', 'UBA', 'First Bank']

export default function AddBankAccountPage() {
  const router = useRouter()
  const [verifyState, setVerifyState] = useState<'idle' | 'verifying' | 'verified'>('idle')



  const { control, register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<BankAccountFormValues>({
  resolver: zodResolver(bankAccountSchema),
  defaultValues: { bankName: '', accountNumber: '', accountName: '', nickname: '' },
})

const accountNumber = useWatch({ control, name: 'accountNumber' })

  async function handleVerify() {
    if (accountNumber.length !== 10) return
    setVerifyState('verifying')


    await new Promise((resolve) => setTimeout(resolve, 1200))

    setValue('accountName', 'RUKKY ADEYEMI') 
    setVerifyState('verified')
  }

async function onSubmit(values: BankAccountFormValues) {
  if (verifyState !== 'verified') {
    toast.error('Please verify the account number first')
    return
  }

  // placeholder — real version writes `values` to Supabase
  console.log('Submitting bank account:', values)
  await new Promise((resolve) => setTimeout(resolve, 800))

  toast.success('Bank account added successfully')
  router.push('/dashboard/settlement')
}

  return (
    <div className="space-y-6 bg-white border border-gray-200 rounded-lg p-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Add Bank Account</h1>
          <p className="text-sm text-gray-500">Link a new bank account to process withdrawals.</p>
        </div>
        <Link href="/dashboard/settlement">
          <Button variant="secondary">
            <ArrowLeft className="mr-2 h-4 w-4 text-[#CD0102]" />
            Back
          </Button>
        </Link>
      </div>

  
          <form onSubmit={handleSubmit(onSubmit)} className=" mx-auto w-full max-w-xl space-y-5 rounded-xl border bg-white p-6">
        <div className="flex gap-3 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            For security compliance, the verified account name must match your registered company
            name on SAO FuelPay. Mismatched accounts may delay withdrawal processing.
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Bank Name</label>
          <Select onValueChange={(value) => { if (value) setValue('bankName', value as string) }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a bank" />
            </SelectTrigger>
            <SelectContent>
              {banks.map((bank) => (
                <SelectItem key={bank} value={bank}>
                  {bank}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.bankName && <p className="mt-1 text-xs text-red-500">{errors.bankName.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Account Number</label>
          <div className="flex gap-2">
            <Input
              placeholder="10-digit account number"
             className={`h-11 ${verifyState === 'verified' ? 'bg-white' : 'bg-red-50/50'}`}
              maxLength={10}
              {...register('accountNumber', {
                onChange: () => setVerifyState('idle'),
              })}
            />
            <Button
              type="button"
              onClick={handleVerify}
              disabled={accountNumber?.length !== 10 || verifyState === 'verifying'}
              className="shrink-0 bg-blue-600 hover:bg-blue-700 h-11"
            >
              {verifyState === 'verifying' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Verify Account'
              )}
            </Button>
          </div>
          {errors.accountNumber && (
            <p className="mt-1 text-xs text-red-500">{errors.accountNumber.message}</p>
          )}
        </div>

    <div>
          <label className="mb-1.5 block text-sm font-medium">Account Name</label>
          <div className="relative">
            <Input
              disabled
              placeholder="Enter account name to verify"
              {...register('accountName')}
              className={`${verifyState === 'verified' ? 'bg-white' : 'bg-red-50/50'} h-11`}
            />
            {verifyState === 'verified' ? (
              <Verify className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-800"/>
            ) : (
              <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-400" />
            )}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Account Nickname (Optional)</label>
          <Input placeholder="e.g. Primary Operations Account" {...register('nickname')} className="h-11" />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || verifyState !== 'verified'}
          className="w-full py-6"
        >
          {isSubmitting ? 'Adding...' : 'Add Bank Account →'}
        </Button>
      </form>

      

    
    </div>
  )
}