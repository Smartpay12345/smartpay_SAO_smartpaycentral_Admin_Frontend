import * as XLSX from 'xlsx'
import type { ExportColumn } from './types'
import { getValue, safeFormat } from './utils'

export function downloadXlsx<T>(filename: string, data: T[], columns: ExportColumn<T>[]): void {
  const rows = data.map((row) => {
    const record: Record<string, string> = {}
    columns.forEach((col) => {
      const raw = getValue(row, col.key)
      record[col.header] = safeFormat(raw, row, col.formatter)
    })
    return record
  })

  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  XLSX.writeFile(workbook, `${filename}.xlsx`)
}