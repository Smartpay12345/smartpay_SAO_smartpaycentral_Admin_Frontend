// lib/dashboard/settings-types.ts
interface Option { value: string; label: string }

export interface PlatformSettings {
  general: {
    company_name: string
    support_email: string | null
    timezone: string
    timezone_label: string
    currency: string
    currency_label: string
  }
  active_regions: { value: string; label: string; stations: number }[]
  available_regions: Option[]
  options: { timezones: Option[]; currencies: Option[] }
  updated_at: string
}

export interface UpdateSettingsBody {
  company_name?: string
  support_email?: string | null
  timezone?: string
  currency?: string
  active_regions?: string[]
}

export type UpdateSettingsResult = PlatformSettings & { saved: string[] }