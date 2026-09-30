import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { ExportColumn } from './types'
import { getValue, safeFormat } from './utils'

export function downloadPdf<T>(
  filename: string,
  data: T[],
  columns: ExportColumn<T>[],
  title?: string
): void {
  const doc = new jsPDF()

  if (title) {
    doc.setFontSize(14)
    doc.text(title, 14, 15)
  }

  const head = [columns.map((col) => col.header)]
  const body = data.map((row) =>
    columns.map((col) => safeFormat(getValue(row, col.key), row, col.formatter))
  )

  autoTable(doc, {
    head,
    body,
    startY: title ? 22 : 12,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [185, 28, 28] }, // matches your brand red
    alternateRowStyles: { fillColor: [250, 250, 250] },
  })

  doc.save(`${filename}.pdf`)
}