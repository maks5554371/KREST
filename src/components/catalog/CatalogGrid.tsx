'use client'

import { useMemo, useState } from 'react'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Button from '@/components/ui/Button'
import ProductCard from '@/components/catalog/ProductCard'
import type { ProductWithCategory } from '@/types/product'

/**
 * Client-Teil des Katalogs: Freitext-Suche über die (serverseitig bereits nach
 * Kategorie gefilterten) Produkte, Ergebniszähler und zwei Leerzustände
 * (gar keine Geräte vs. keine Treffer zur Suche – jeweils mit nächstem Schritt).
 */
export default function CatalogGrid({ products }: { products: ProductWithCategory[] }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter((p) =>
      [p.name, p.brand, p.cardSummary, p.categoryName]
        .filter(Boolean)
        .some((field) => (field as string).toLowerCase().includes(q))
    )
  }, [products, query])

  // Kategorie/Katalog komplett leer.
  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-card border border-slate-200 bg-white p-10 text-center shadow-card lg:p-14">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/10 ring-1 ring-gold-500/20">
          <MagnifyingGlassIcon className="h-7 w-7 text-gold-600" />
        </div>
        <h2 className="mb-3 font-serif text-2xl font-bold text-navy-900">
          Aktuell sind hier keine Geräte hinterlegt
        </h2>
        <p className="mx-auto mb-8 max-w-md text-slate-600">
          Wir führen deutlich mehr Geräte, als hier gerade sichtbar sind. Sagen Sie uns, was Sie
          suchen – wir finden das passende Gerät für Ihr Studio.
        </p>
        <Button href="mailto:info@kret-manufaktur.de" variant="primary" size="lg">
          Gerät anfragen
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Gerät, Marke oder Technologie suchen…"
            aria-label="Geräte durchsuchen"
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-11 pr-10 text-sm text-navy-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Suche zurücksetzen"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-navy-900"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>
        <p className="text-sm text-slate-500">
          {filtered.length}{' '}
          {filtered.length === 1 ? 'Gerät' : 'Geräte'}
          {query && ' gefunden'}
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      ) : (
        <div className="rounded-card border border-slate-200 bg-white p-10 text-center shadow-card">
          <h2 className="mb-2 text-lg font-bold text-navy-900">
            Keine Treffer für „{query}“
          </h2>
          <p className="mx-auto mb-6 max-w-md text-slate-600">
            Versuchen Sie es mit einem anderen Begriff – oder sagen Sie uns direkt, wonach Sie
            suchen.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setQuery('')}
              className="cursor-pointer rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:border-gold-500 hover:text-gold-700"
            >
              Suche zurücksetzen
            </button>
            <Button href="mailto:info@kret-manufaktur.de" variant="primary" size="md">
              Gerät anfragen
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
