import * as XLSX from 'xlsx'
import type { ExportColumn } from './types'
import { getValue, numericValue, safeFormat } from './utils'

export function downloadXlsx<T>(filename: string, data: T[], columns: ExportColumn<T>[]): void {
  const rows = data.map((row) => {
    const record: Record<string, string | number> = {}
    columns.forEach((col) => {
      const raw = getValue(row, col.key)
      if (col.numeric) {
        const n = numericValue(raw)
        if (n !== null) record[col.header] = n // empty cell when there is no value
      } else {
        record[col.header] = safeFormat(raw, row, col.formatter)
      }
    })
    return record
  })

  // `header` fixes the column order even if the first row has an empty cell
  const worksheet = XLSX.utils.json_to_sheet(rows, { header: columns.map((c) => c.header) })

  // show numeric columns with commas/decimals while keeping them real numbers
  columns.forEach((col, c) => {
    if (!col.numeric || !col.numFmt) return
    for (let r = 1; r <= rows.length; r++) {
      const cell = worksheet[XLSX.utils.encode_cell({ r, c })] as XLSX.CellObject | undefined
      if (cell && cell.t === 'n') cell.z = col.numFmt
    }
  })

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  XLSX.writeFile(workbook, `${filename}.xlsx`)
}