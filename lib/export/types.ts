
export type ExportFormat = 'csv' | 'xlsx' | 'pdf'

export interface ExportColumn<T> {
  key: string // supports dot-paths, e.g. 'station.name'
  header: string
  formatter?: (value: unknown, row: T) => string
}

export interface ExportOptions<T> {
  filename: string
  columns: ExportColumn<T>[]
  data: T[]
  title?: string // shown as a heading in PDF output
}

export interface ExportResult {
  success: boolean
  error?: string
}