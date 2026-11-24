
// lib/types/app-user.ts
import type { Pagination } from '@/lib/dashboard/types'



export type AppUserStatus = 'active' | 'restricted'

export type AppUserTab = 'active' | 'restricted'

export type AppUsersPeriod =
  | 'today'
  | 'yesterday'
  | 'last_7_days'
  | 'last_30_days'
  | 'this_month'
  | 'last_month'
  | 'custom'

export interface AppUsersOverviewParams {
  period: AppUsersPeriod
  start_date?: string
  end_date?: string
}

export interface AppUsersListParams {
  tab?: AppUserTab
  search?: string
  page?: number
  page_size?: number
}



// ============================================
// OVERVIEW API RESPONSE
// ============================================

export interface AppUsersOverview {
  registered_wallets: {
    total: number
    active: number
    restricted: number
  }
  explore_service: {
    count: number
    amount: number
    change_percent: number | null
  }
  daily_active_users: {
    count: number
    change_percent: number | null
  }
  app_stats: {
    ios_users: number
    android_users: number
    registered_users: number
  }
}

// ============================================
// USERS LIST API RESPONSE
// ============================================

export interface AppUserListItem {
  id: string
  full_name: string
  email: string
  phone: string
  avatar_url: string | null
  restricted: boolean
  joined_at: string
}

export interface AppUsersListResponse {
  users: AppUserListItem[]
  pagination: Pagination
}

// ============================================
// USER DETAIL API RESPONSE
// ============================================

export interface AppUserDetailData {
  id: string
  full_name: string
  email: string
  phone: string
  avatar_url: string | null
  restricted: boolean
  joined_at: string

  kyc_status: string | null
  kyc_verified: boolean

    virtual_account: {
    account_number: string
    account_name: string
    bank_name: string
  } | null

  restricted_at: string | null
  restriction_reason: string | null
  restricted_by: string | null
}

export interface ApiTransaction {
  id: string
  direction: string
  kind: string
  label: string
  status_label: string
  amount: number
  time: string
}

export interface AppUserTotals {
  total_deposit: number
  wallet_balance: number
  total_cashback: number
}

export interface AppUserDetailResponse {
  user: AppUserDetailData
  totals: AppUserTotals
  recent_transactions: ApiTransaction[]
}

// ============================================
// USER TRANSACTIONS API RESPONSE
// ============================================

export interface AppUserTransactionsResponse {
  transactions: ApiTransaction[]
  pagination: Pagination
}

// ============================================
// USER ACTIVITY API RESPONSE
// ============================================

export interface AppUserIpStats {
  registered_ip: string | null
  last_login_ip: string | null
  last_login_at: string | null
}

export interface AppUserDevice {
  platform: 'ios' | 'android' | null
  model: string | null
  os_version: string | null
  app_version: string | null
  last_seen_at: string | null
}

export interface AppUserActivity {
  title: string
  detail: string | null
  time: string
}

export interface AppUserActivityResponse {
  ip_stats: AppUserIpStats | null
  device: AppUserDevice | null
  activities: AppUserActivity[]
}

// ============================================
// USER STATUS API
// ============================================

export type AppUserStatusAction = 'restrict' | 'reinstate'

export interface AppUserStatusParams {
  id: string
  action: AppUserStatusAction
  reason?: string
}

export interface AppUserStatusResponse {
  user: {
    id: string
    restricted: boolean
    restricted_at: string | null
    restriction_reason: string | null
  }
}
// ============================================
// USER MESSAGE API
// ============================================

export interface AppUserMessageParams {
  id: string
  title: string
  body: string
  send_push?: boolean
}

export interface AppUserMessageResponse {
  sent: boolean
  broadcast_id: string
}

// ============================================
// UI TYPES
// These are the types your components consume.
// ============================================

export interface Transaction {
  id?: string
  date: string
  type: string
  direction: 'Received' | 'Sent'
  category: string
  amount: string
  status?: string
}

export interface AppUser {
  id: string
  phone: string
  email: string
  name: string
  avatarUrl?: string
  status: AppUserStatus
  kycVerified: boolean
  kycStatus?: string
  joinedDate: string
  virtualAccount: string
  restrictionReason?: string
  restrictedBy?: string

  totalDeposit: string
  walletBalance: string
  totalCashback: string
  transactions: Transaction[]

  // Sales App users (Managers/Staff)
  isSalesUser?: boolean
  managerId?: string
  phoneRegistered?: string
  assignedStation?: string
  stationId?: string
  totalSales?: string
  totalRevenue?: string
}
