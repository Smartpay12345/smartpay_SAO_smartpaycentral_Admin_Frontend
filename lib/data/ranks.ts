// lib/data/ranks.ts
import type { Rank } from '@/lib/types/rank'

export const RANKS: Rank[] = [
  {
    id: 1,
    name: 'Aspirant',
    icon: 'aspirant',
    iconBg: 'bg-red-500',
    criteria: [
      { key: 'deposit', label: 'Deposit Target', current: 65000, target: 100000, unit: '₦' },
      { key: 'bill', label: 'Bill payment target', current: 100, target: 1000, unit: '₦' },
      { key: 'fuel', label: 'Fuel purchase', current: 25000, target: 50000, unit: '₦' },
    ],
  },
  {
    id: 2,
    name: 'Pioneer',
    icon: 'pioneer',
    iconBg: 'bg-amber-500',
    criteria: [
      { key: 'deposit', label: 'Deposit Target', current: 0, target: 250000, unit: '₦' },
      { key: 'bill', label: 'Bill payment target', current: 0, target: 5000, unit: '₦' },
      { key: 'fuel', label: 'Fuel purchase', current: 0, target: 150000, unit: '₦' },
    ],
  },
  {
    id: 3,
    name: 'Pinnacle',
    icon: 'pinnacle',
    iconBg: 'bg-slate-700',
    criteria: [
      { key: 'deposit', label: 'Deposit Target', current: 0, target: 500000, unit: '₦' },
      { key: 'bill', label: 'Bill payment target', current: 0, target: 15000, unit: '₦' },
      { key: 'fuel', label: 'Fuel purchase', current: 0, target: 400000, unit: '₦' },
    ],
  },
  {
    id: 4,
    name: 'Celebrity',
    icon: 'celebrity',
    iconBg: 'bg-purple-600',
    criteria: [
      { key: 'deposit', label: 'Deposit Target', current: 0, target: 1000000, unit: '₦' },
      { key: 'bill', label: 'Bill payment target', current: 0, target: 40000, unit: '₦' },
      { key: 'fuel', label: 'Fuel purchase', current: 0, target: 900000, unit: '₦' },
    ],
  },
  {
    id: 5,
    name: 'Legendary',
    icon: 'legendary',
    iconBg: 'bg-gradient-to-br from-yellow-400 to-amber-600',
    criteria: [
      { key: 'deposit', label: 'Deposit Target', current: 0, target: 2500000, unit: '₦' },
      { key: 'bill', label: 'Bill payment target', current: 0, target: 100000, unit: '₦' },
      { key: 'fuel', label: 'Fuel purchase', current: 0, target: 2000000, unit: '₦' },
    ],
  },
]