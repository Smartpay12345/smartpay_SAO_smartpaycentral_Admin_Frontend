'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'

function formatNigerianPhone(digits: string) {
  // group as 0801 234 5678 (4-3-4), capped at 11 digits
  const trimmed = digits.slice(0, 11)
  const part1 = trimmed.slice(0, 4)
  const part2 = trimmed.slice(4, 7)
  const part3 = trimmed.slice(7, 11)
  return [part1, part2, part3].filter(Boolean).join(' ')
}

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string
  onChange: (value: string) => void
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, ...props }, ref) => {
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const digitsOnly = e.target.value.replace(/\D/g, '')
      onChange(formatNigerianPhone(digitsOnly))
    }

    return (
      <Input
        {...props}
        ref={ref}
        type="tel"
        inputMode="numeric"
        value={value}
        onChange={handleChange}
        placeholder={props.placeholder ?? '0801 234 5678'}
      />
    )
  }
)
PhoneInput.displayName = 'PhoneInput'