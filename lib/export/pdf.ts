import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { ExportColumn } from './types'
import { getValue, safeFormat } from './utils'

let fontBase64: string | null = null

async function loadFont(): Promise<string> {
  if (fontBase64) return fontBase64
  const res = await fetch('/fonts/NotoSans-Regular.ttf')
  if (!res.ok) throw new Error('Could not load PDF font')
  const bytes = new Uint8Array(await res.arrayBuffer())
  // convert in chunks: spreading the whole array at once overflows the call stack
  let binary = ''
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  }
  fontBase64 = btoa(binary)
  return fontBase64
}

export async function downloadPdf<T>(
  filename: string,
  data: T[],
  columns: ExportColumn<T>[],
  title?: string
): Promise<void> {
  const doc = new jsPDF()
  doc.addFileToVFS('NotoSans-Regular.ttf', await loadFont())
  doc.addFont('NotoSans-Regular.ttf', 'NotoSans', 'normal')
  doc.setFont('NotoSans')

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
    styles: { font: 'NotoSans', fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [185, 28, 28], fontStyle: 'normal' },
    alternateRowStyles: { fillColor: [250, 250, 250] },
  })

  doc.save(`${filename}.pdf`)
}