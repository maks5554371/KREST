'use client'

import type { ReactNode } from 'react'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'

/**
 * Gemeinsames Gerüst für alle wiederholbaren Abschnitte des Produktformulars
 * (Textblöcke, technische Daten, FAQ, Downloads, Galerie): hinzufügen,
 * entfernen, nach oben/unten schieben. Nur die Darstellung einer Zeile
 * unterscheidet sich – die kommt über `renderItem`.
 */
export function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length) return items
  const next = [...items]
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved)
  return next
}

export default function ListEditor<T>({
  items,
  onChange,
  createItem,
  renderItem,
  addLabel,
  emptyHint,
  itemLabel,
}: {
  items: T[]
  onChange: (items: T[]) => void
  createItem: () => T
  renderItem: (item: T, index: number, update: (patch: Partial<T>) => void) => ReactNode
  addLabel: string
  emptyHint: string
  itemLabel: (item: T, index: number) => string
}) {
  function update(index: number, patch: Partial<T>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-sm text-slate-500 bg-slate-50 border border-dashed border-slate-300 rounded-lg px-4 py-6 text-center">
          {emptyHint}
        </p>
      )}

      {items.map((item, index) => (
        <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between gap-2 bg-slate-50 px-3 py-2 border-b border-slate-200">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide truncate">
              {itemLabel(item, index)}
            </span>
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                type="button"
                onClick={() => onChange(moveItem(items, index, index - 1))}
                disabled={index === 0}
                aria-label="Nach oben"
                className="p-1.5 rounded text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <ArrowUpIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onChange(moveItem(items, index, index + 1))}
                disabled={index === items.length - 1}
                aria-label="Nach unten"
                className="p-1.5 rounded text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <ArrowDownIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, i) => i !== index))}
                aria-label="Entfernen"
                className="p-1.5 rounded text-slate-500 hover:bg-red-100 hover:text-red-600 transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-3 space-y-3">
            {renderItem(item, index, (patch) => update(index, patch))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...items, createItem()])}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#B8943F] hover:text-[#9d7d34] transition-colors"
      >
        <PlusIcon className="w-4 h-4" />
        {addLabel}
      </button>
    </div>
  )
}
