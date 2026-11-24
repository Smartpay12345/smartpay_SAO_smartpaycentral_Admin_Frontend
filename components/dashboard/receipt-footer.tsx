
'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ImageIcon, FileText, Share2, Loader2 } from 'lucide-react'

interface ReceiptFooterProps {
  onShare: () => void
  onDownload: (format: 'png' | 'pdf') => void
  sharing: boolean
  downloading: 'png' | 'pdf' | null
}

export function ReceiptFooter({ onShare, onDownload, sharing, downloading }: ReceiptFooterProps) {
  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t bg-[#E6BDB9] px-5 py-3 sm:flex-row">
      <p className="text-xs text-gray-400">Powered by smartpay</p>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={onShare} disabled={sharing}>
          {sharing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="mr-1.5 h-4 w-4" />}
          Share
        </Button>
   <DropdownMenu>
  <DropdownMenuTrigger
    render={
      <Button size="sm" disabled={downloading !== null} className="bg-[#B8001D]">
        {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Download'}
      </Button>
    }
  />
  <DropdownMenuContent align="end">
    <DropdownMenuItem onSelect={() => onDownload('png')} className="gap-2">
      <ImageIcon className="h-4 w-4" /> Download as Image
    </DropdownMenuItem>
    <DropdownMenuItem onSelect={() => onDownload('pdf')} className="gap-2">
      <FileText className="h-4 w-4" /> Download as PDF
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
      </div>
    </div>
  )
}