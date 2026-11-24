import type { CompanyAccount } from '@/lib/types/settlement'

export const settlementAccounts: Record<'smartpay' | 'sao', CompanyAccount> = {
  smartpay: {
    key: 'smartpay',
    label: 'Smartpay',
    bankName: 'Stanbic IBTC',
    accountLast4: '4589',
    totalSettlement: '₦85,200,000',
    ref: 'WD - 37361',
    recentSettlements: [
      { destination: 'GTBank **** 4589', date: 'Today, 10:45 AM', reference: 'WD-9928', amount: '₦5,000,000', status: 'completed' },
      { destination: 'GTBank **** 4589', date: 'Oct 12, 2023', reference: 'WD-9840', amount: '₦12,500,000', status: 'completed' },
      { destination: 'GTBank **** 4589', date: 'Oct 12, 2023', reference: 'WD-9840', amount: '₦12,500,000', status: 'completed' },
    ],
  },
  sao: {
    key: 'sao',
    label: 'SAO fuel',
    bankName: 'GT bank',
    accountLast4: '4589',
    totalSettlement: '₦85,200,000',
    ref: 'WD - 37361',
    recentSettlements: [
      { destination: 'GTBank **** 4589', date: 'Today, 10:45 AM', reference: 'WD-9928', amount: '₦5,000,000', status: 'completed' },
      { destination: 'GTBank **** 4589', date: 'Oct 12, 2023', reference: 'WD-9840', amount: '₦12,500,000', status: 'completed' },
      { destination: 'GTBank **** 4589', date: 'Oct 12, 2023', reference: 'WD-9840', amount: '₦12,500,000', status: 'completed' },
    ],
  },
}

export const TAB_ACCENT: Record<'smartpay' | 'sao', { text: string; border: string; banner: string; dot: string }> = {
  smartpay: {
    text: 'text-blue-500',
    border: 'border-blue-500',
    banner: 'bg-blue-50 dark:bg-blue-950/30',
    dot: 'bg-blue-500',
  },
  sao: {
    text: 'text-primary',
    border: 'border-primary',
    banner: 'bg-red-50 dark:bg-red-950/30',
    dot: 'bg-primary',
  },
}