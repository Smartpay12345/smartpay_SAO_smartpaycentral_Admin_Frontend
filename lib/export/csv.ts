import type { ExportColumn } from './types'
import { getValue, safeFormat, triggerDownload } from './utils'

function escapeCell(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function generateCsv<T>(data: T[], columns: ExportColumn<T>[]): string {
  const headerRow = columns.map((col) => escapeCell(col.header)).join(',')

  const rows = data.map((row) =>
    columns
      .map((col) => {
        const raw = getValue(row, col.key)
        return escapeCell(safeFormat(raw, row, col.formatter))
      })
      .join(',')
  )

  return [headerRow, ...rows].join('\n')
}

export function downloadCsv<T>(filename: string, data: T[], columns: ExportColumn<T>[]): void {
  const csv = generateCsv(data, columns)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  triggerDownload(blob, `${filename}.csv`)
}