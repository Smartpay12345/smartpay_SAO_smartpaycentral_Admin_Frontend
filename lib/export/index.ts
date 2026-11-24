import type { ExportFormat, ExportOptions, ExportResult } from './types'
import { downloadCsv } from './csv'
import { sanitizeFilename } from './utils'

export type { ExportColumn, ExportFormat, ExportOptions, ExportResult } from './types'

export async function exportData<T>(
  format: ExportFormat,
  options: ExportOptions<T>
): Promise<ExportResult> {
  try {
    if (!options.data || options.data.length === 0) {
      return { success: false, error: 'No data available to export yet.' }
    }

    const filename = sanitizeFilename(options.filename)

    switch (format) {
      case 'csv': {
        downloadCsv(filename, options.data, options.columns)
        break
      }
      case 'xlsx': {
        // dynamically imported so pages that never export nothing
        // still don't ship SheetJS/jsPDF in their initial bundle
        const { downloadXlsx } = await import('./excel')
        downloadXlsx(filename, options.data, options.columns)
        break
      }
      case 'pdf': {
        const { downloadPdf } = await import('./pdf')
       await downloadPdf(filename, options.data, options.columns, options.title)
        break
      }
      default: {
        return { success: false, error: 'Unsupported export format.' }
      }
    }

    return { success: true }
  } catch (err) {
    console.error('Export failed:', err)
    return { success: false, error: 'Something went wrong while exporting. Please try again.' }
  }
}