import Link from 'next/link'
import { formatPrice } from '@/lib/format'
import type { ProductWithCategory } from '@/types/product'

/**
 * Nur auf Mobil: fixierte Leiste unten mit Preis + Anfrage-Button, damit die
 * Hauptaktion beim Scrollen immer erreichbar bleibt (Sticky-CTA-Empfehlung).
 */
export default function ProductStickyCTA({ product }: { product: ProductWithCategory }) {
  const mailtoHref = `mailto:info@kret-manufaktur.de?subject=${encodeURIComponent(
    `Anfrage: ${product.name}`
  )}`

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-navy-900">{formatPrice(product.priceCents)}</p>
          <p className="truncate text-xs text-slate-500">{product.name}</p>
        </div>
        <Link
          href={mailtoHref}
          className="shrink-0 rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gold-600"
        >
          Jetzt anfragen
        </Link>
      </div>
    </div>
  )
}
