
// lib/dashboard/app-users-api.ts

import { call } from './call'

import type {
  AppUsersOverview,
  AppUsersOverviewParams,
  AppUsersListParams,
  AppUsersListResponse,
  AppUserDetailResponse,
  AppUserTransactionsResponse,
  AppUserActivityResponse,
  AppUserStatusParams,
  AppUserStatusResponse,
  AppUserMessageParams,
  AppUserMessageResponse,
} from '@/lib/types/app-user'

export const APP_USERS_KEY = 'users-overview'
export const APP_USERS_LIST_KEY = 'users-list'

// ============================================
// REQUEST PARAMS
// ============================================

export interface AppUserDetailParams {
  id: string
}

export interface AppUserTransactionsParams {
  id: string
  page?: number
  page_size?: number
}

export interface AppUserActivityParams {
  id: string
}

// ============================================
// APP USERS API
// ============================================

export const appUsersApi = {
  // 1. Overview statistics
  overview: (params: AppUsersOverviewParams) =>
    call<AppUsersOverview>('users-overview', params),

  // 2. Active / restricted users list
  list: (params: AppUsersListParams = {}) =>
    call<AppUsersListResponse>('users-list', {
      ...params,
      search: params.search?.trim() || undefined,
    }),

  // 3. Individual user details
  detail: (params: AppUserDetailParams) =>
    call<AppUserDetailResponse>('user-detail', params),

  // 4. Individual user transactions
  transactions: (params: AppUserTransactionsParams) =>
    call<AppUserTransactionsResponse>('user-transactions', params),

  // 5. Individual user IP stats and activity
  activity: (params: AppUserActivityParams) =>
    call<AppUserActivityResponse>('user-activity', params),

  // 6. Restrict / reinstate user
  updateStatus: (params: AppUserStatusParams) =>
    call<AppUserStatusResponse>('user-status', params),

  // 7. Send message to individual user
  sendMessage: (params: AppUserMessageParams) =>
    call<AppUserMessageResponse>('user-message', params),
}
