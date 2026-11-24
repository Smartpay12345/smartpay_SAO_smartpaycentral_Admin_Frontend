// lib/dashboard/settings-api.ts
import { call } from './call'
import type { PlatformSettings, UpdateSettingsBody, UpdateSettingsResult } from './settings-types'

export const SETTINGS_KEY = 'platform-settings'

export const settingsApi = {
  get: () => call<PlatformSettings>('settings-get'),
  update: (body: UpdateSettingsBody) => call<UpdateSettingsResult>('settings-update', body),
}