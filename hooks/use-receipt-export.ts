'use client'

import { useState, type RefObject } from 'react'
import { toPng, toBlob } from 'html-to-image'
import { jsPDF } from 'jspdf'
import { toast } from 'sonner'

export function useReceiptExport(ref: RefObject<HTMLDivElement | null>, filenameBase: string) {
  const [downloading, setDownloading] = useState<'png' | 'pdf' | null>(null)
  const [sharing, setSharing] = useState(false)

  async function handleDownload(format: 'png' | 'pdf') {
    if (!ref.current) return
    setDownloading(format)
    try {
      const dataUrl = await toPng(ref.current, { backgroundColor: '#ffffff', pixelRatio: 2 })

      if (format === 'png') {
        const link = document.createElement('a')
        link.download = `${filenameBase}.png`
        link.href = dataUrl
        link.click()
      } else {
        const img = new Image()
        img.src = dataUrl
        await new Promise((resolve) => (img.onload = resolve))

        const pdf = new jsPDF({
          orientation: img.width > img.height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [img.width, img.height],
        })
        pdf.addImage(dataUrl, 'PNG', 0, 0, img.width, img.height)
        pdf.save(`${filenameBase}.pdf`)
      }
      toast.success(`Downloaded as ${format.toUpperCase()}`)
    } catch (err) {
      console.error(err)
      toast.error('Failed to generate file. Please try again.')
    } finally {
      setDownloading(null)
    }
  }

  async function handleShare() {
    if (!ref.current) return
    setSharing(true)
    try {
      const blob = await toBlob(ref.current, { backgroundColor: '#ffffff', pixelRatio: 2 })
      if (!blob) throw new Error('Could not generate image')

      const file = new File([blob], `${filenameBase}.png`, { type: 'image/png' })

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: filenameBase })
      } else {
        const link = document.createElement('a')
        link.download = `${filenameBase}.png`
        link.href = URL.createObjectURL(blob)
        link.click()
        toast.info("Sharing isn't supported on this device — downloaded instead.")
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error(err)
        toast.error('Failed to share. Please try again.')
      }
    } finally {
      setSharing(false)
    }
  }

  return { handleDownload, handleShare, downloading, sharing }
}