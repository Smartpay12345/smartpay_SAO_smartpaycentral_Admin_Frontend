export function getValue(row: unknown, key: string): unknown {
  return key.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in (acc as object)) {
      return (acc as Record<string, unknown>)[part]
    }
    return undefined
  }, row)
}

export function safeFormat<T>(
  raw: unknown,
  row: T,
  formatter?: (value: unknown, row: T) => string
): string {
  try {
    if (formatter) return formatter(raw, row)
    if (raw === null || raw === undefined) return ''
    return String(raw)
  } catch {
    // A broken formatter on one cell should never take down the whole export
    return ''
  }
}

export function sanitizeFilename(filename: string): string {
  const cleaned = filename.trim().replace(/[^a-z0-9-_]+/gi, '-')
  return cleaned || 'export'
}

export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function numericValue(raw: unknown): number | null {
  if (raw === null || raw === undefined || raw === '') return null
  const n = typeof raw === 'number' ? raw : Number(raw)
  return Number.isFinite(n) ? n : null
}