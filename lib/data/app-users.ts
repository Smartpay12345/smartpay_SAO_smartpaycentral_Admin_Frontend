// lib/data/app-users.ts
import type { AppUser } from '@/lib/types/app-user'

export const MOCK_APP_USERS: AppUser[] = [
  {
    id: '1', phone: '07033303653', email: 'tundegbotemi@gmail.com', name: 'Sarah James',
    status: 'active', kycVerified: true, joinedDate: '20 Jun 2025, 12:23AM',
    virtualAccount: '2102342313', totalDeposit: '₦1,520,000', walletBalance: '₦520,000', totalCashback: '₦50,200',
    transactions: [
      { date: 'SEP 12', type: 'Income', direction: 'Received', category: 'Deposit', amount: '₦12,000.00' },
      { date: 'SEP 12', type: 'Income', direction: 'Received', category: 'Sales (PMS)', amount: '₦2,000.00' },
    ],
  },
  { id: '2', phone: '09033303653', email: 'Oracleofgod@gmail.com', name: 'David Oracle', status: 'active', kycVerified: false, joinedDate: '18 Jun 2025, 9:10AM', virtualAccount: '2102342999', totalDeposit: '₦0', walletBalance: '₦0', totalCashback: '₦0', transactions: [] },
  { id: '3', phone: '08033303653', email: 'Rukkydev01@gmail.com', name: 'Rukky Dev', status: 'restricted', kycVerified: true, joinedDate: '10 May 2025, 3:40PM', virtualAccount: '2102343100', totalDeposit: '₦300,000', walletBalance: '₦12,000', totalCashback: '₦4,200', transactions: [] },
]

export const MOCK_SALES_USERS: AppUser[] = [
  {
    id: 's1', phone: '', email: '', name: 'Folake Adeyemi', status: 'active', kycVerified: true,
    joinedDate: '20 Jun 2025, 12:23AM', virtualAccount: '', totalDeposit: '', walletBalance: '', totalCashback: '',
    transactions: [], isSalesUser: true, managerId: 'SAO- MGR-849',
    phoneRegistered: '+234 801 234 5678', assignedStation: 'SAO Ikeja Lagos', stationId: 'SAO1233141LG',
    totalSales: '₦125.4M', totalRevenue: '₦12.5M',
  },
  { id: 's2', phone: '', email: '', name: 'John Staff', status: 'active', kycVerified: true, joinedDate: '2 Feb 2025, 1:00PM', virtualAccount: '', totalDeposit: '', walletBalance: '', totalCashback: '', transactions: [], isSalesUser: true, managerId: 'SAO- STF-001', phoneRegistered: '+234 802 000 1111', assignedStation: 'SAO Ikeja Lagos', stationId: 'SAO1233141LG', totalSales: '₦40.1M', totalRevenue: '₦3.9M' },
]