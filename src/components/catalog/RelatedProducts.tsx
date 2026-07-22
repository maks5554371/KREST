import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import ProductCard from '@/components/catalog/ProductCard'
import { listPublishedProducts } from '@/lib/db/products'

/**
 * „Weitere Geräte“ aus derselben Kategorie (aktuelles Produkt ausgenommen).
 * Stärkt den Marketplace-Charakter und bietet Cross-Selling.
 */
export default async function RelatedProducts({
  categorySlug,
  currentSlug,
}: {
  categorySlug: string | null
  currentSlug: string
}) {
  if (!categorySlug) return null

  const related = (await listPublishedProducts(categorySlug))
    .filter((product) => product.slug !== currentSlug)
    .slice(0, 3)

  if (related.length === 0) return null

  return (
    <section className="border-t border-slate-100 bg-slate-50 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
              Ähnliche Geräte
            </p>
            <h2 className="font-serif text-3xl font-bold text-navy-900">Das könnte Sie auch interessieren</h2>
          </div>
          <Link
            href={`/katalog?kategorie=${categorySlug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-600 transition-colors hover:text-gold-700"
          >
            Alle Geräte der Kategorie
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
