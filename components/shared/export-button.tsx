'use client'

import { useState } from 'react'
import { Download, ChevronDown, FileText, FileSpreadsheet, FileType } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { exportData, type ExportColumn, type ExportFormat, type ExportResult } from '@/lib/export'
import { toast } from 'sonner'

interface ExportButtonProps<T> {
  data: T[] | (() => Promise<T[]>) // an array, or a function that loads the rows when clicked
  columns: ExportColumn<T>[]
  filename: string
  title?: string
  label?: string
  formats?: ExportFormat[]
  disabled?: boolean
  onSuccess?: (format: ExportFormat) => void
  onError?: (message: string) => void
}

const FORMAT_CONFIG: Record<ExportFormat, { label: string; icon: React.ReactNode }> = {
  csv: { label: 'Export as CSV', icon: <FileText className="h-4 w-4" /> },
  xlsx: { label: 'Export as Excel', icon: <FileSpreadsheet className="h-4 w-4" /> },
  pdf: { label: 'Export as PDF', icon: <FileType className="h-4 w-4" /> },
}

export function ExportButton<T>({
  data,
  columns,
  filename,
  title,
  label = 'Export Report',
  formats = ['csv', 'xlsx', 'pdf'],
  disabled = false,
  onSuccess,
  onError,
}: ExportButtonProps<T>) {
  const [isExporting, setIsExporting] = useState<ExportFormat | null>(null)

  async function handleExport(format: ExportFormat) {
    setIsExporting(format)
    let result: ExportResult
    try {
      const rows = typeof data === 'function' ? await data() : data
      result = await exportData(format, { data: rows, columns, filename, title })
    } catch (err) {
      console.error('Export data failed:', err)
      result = { success: false, error: 'Could not load the report. Please try again.' }
    }
    setIsExporting(null)

    if (!result.success) {
      const message = result.error ?? 'Export failed. Please try again.'
      if (onError) onError(message)
      else toast.error(message)
      return
    }

    onSuccess?.(format)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700" disabled={disabled || isExporting !== null}>
            <Download className="h-4 w-4" />
            {isExporting ? 'Exporting...' : label}
            <ChevronDown className="h-4 w-4" />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {formats.map((format) => (
          <DropdownMenuItem
            key={format}
            className="gap-2"
            disabled={isExporting !== null}
            onClick={() => handleExport(format)}
          >
            {FORMAT_CONFIG[format].icon}
            {FORMAT_CONFIG[format].label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}