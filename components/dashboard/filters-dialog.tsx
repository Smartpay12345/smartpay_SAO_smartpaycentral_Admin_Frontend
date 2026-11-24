'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { SearchSelect, type SearchOption } from '@/components/dashboard/search-select'
import { Icon } from '@/components/icons'
import { cn } from '@/lib/utils'

export type FilterValues = Record<string, string>

export type FilterField =
  | { type: 'choice'; key: string; label: string; options: SearchOption[] } // few options, shown as chips; value '' = all
  | { type: 'search'; key: string; label: string; options: SearchOption[]; allLabel: string; placeholder: string }

interface FiltersDialogProps {
  fields: FilterField[]
  value: FilterValues
  onApply: (value: FilterValues) => void
}

const clean = (v: FilterValues) => Object.fromEntries(Object.entries(v).filter(([, x]) => x))

export function FiltersDialog({ fields, value, onApply }: FiltersDialogProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<FilterValues>(value)
  const activeCount = Object.keys(clean(value)).length

  function openDialog() {
    setDraft(value) // start from what is currently applied
    setOpen(true)
  }
  function apply() {
    onApply(clean(draft))
    setOpen(false)
  }
  function reset() {
    onApply({})
    setOpen(false)
  }

  return (
    <>
      <Button type="button" variant="outline" onClick={openDialog} className="gap-2">
        <Icon />
        Filters
        {activeCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">
            {activeCount}
          </span>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="!max-w-[90vw] gap-0 p-0 sm:!max-w-md">
          <div className="border-b p-5">
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>

          <div className="space-y-5 p-5">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="mb-1.5 block text-sm font-medium">{f.label}</label>
                {f.type === 'choice' ? (
                  <div className="flex flex-wrap gap-2">
                    {f.options.map((o) => {
                      const selected = (draft[f.key] ?? '') === o.value
                      return (
                        <button
                          key={o.value || 'all'}
                          type="button"
                          onClick={() => setDraft((d) => ({ ...d, [f.key]: o.value }))}
                          className={cn(
                            'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                            selected ? 'border-primary bg-red-50 text-primary' : 'text-gray-500 hover:bg-gray-50'
                          )}
                        >
                          {o.label}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <SearchSelect
                    options={f.options}
                    value={draft[f.key] ?? ''}
                    onChange={(v) => setDraft((d) => ({ ...d, [f.key]: v }))}
                    placeholder={f.placeholder}
                    allLabel={f.allLabel}
                    emptyText="No match found"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 border-t bg-red-50/40 px-5 py-3">
            <Button type="button" variant="outline" onClick={reset}>Reset</Button>
            <Button type="button" onClick={apply}>Apply</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}