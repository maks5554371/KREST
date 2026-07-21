import type { Metadata } from 'next'
import Link from 'next/link'
import ProductCard from '@/components/catalog/ProductCard'
import ContactCTA from '@/components/home/ContactCTA'
import { listPublishedProducts } from '@/lib/db/products'
import { listCategoriesWithCounts } from '@/lib/db/categories'

/**
 * Immer frisch rendern: Die Daten liegen als SQLite-Datei auf derselben Maschine,
 * eine Abfrage kostet praktisch nichts. Statisches Prerendering würde bedeuten,
 * dass Änderungen aus der Administration erst nach einem Rebuild sichtbar werden.
 */
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Kosmetikgeräte-Katalog – Diodenlaser, SHR, IPL & mehr',
  description:
    'Professionelle Kosmetikgeräte im Überblick: Diodenlaser, SHR-, IPL-, Kryolipolyse- und Aquafacial-Geräte. Mit technischen Daten, Beratung und flexiblen Zahlungsmodellen.',
  keywords:
    'Kosmetikgeräte Katalog, Diodenlaser kaufen, SHR Gerät, IPL Gerät, Kryolipolyse, Aquafacial',
  openGraph: {
    title: 'Kosmetikgeräte-Katalog | KRET-Manufaktur',
    description:
      'Diodenlaser, SHR-, IPL-, Kryolipolyse- und Aquafacial-Geräte mit technischen Daten und persönlicher Beratung.',
    url: 'https://www.kret-manufaktur.de/katalog',
  },
}

export default async function KatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ kategorie?: string }>
}) {
  const { kategorie } = await searchParams
  const [products, categories] = await Promise.all([
    listPublishedProducts(kategorie),
    listCategoriesWithCounts(),
  ])

  const activeCategory = categories.find((category) => category.slug === kategorie)
  const visibleCategories = categories.filter((category) => category.productCount > 0)

  return (
    <>
      <section className="bg-[#0F172A] py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold tracking-widest text-[#B8943F] uppercase mb-3">
            Unsere Geräte
          </p>
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">
            {activeCategory ? activeCategory.name : 'Kosmetikgeräte-Katalog'}
          </h1>
          <p className="text-slate-300 max-w-2xl leading-relaxed">
            {activeCategory?.description ??
              'Von Diodenlasern über SHR und IPL bis hin zu Kryolipolyse und Aquafacial: Hier finden Sie unsere Geräte mit allen technischen Details. Sie sind sich unsicher, was zu Ihrem Studio passt? Wir beraten Sie kostenlos und unverbindlich.'}
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {visibleCategories.length > 0 && (
            <nav aria-label="Kategorien" className="flex flex-wrap gap-2 mb-10">
              <Link
                href="/katalog"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  kategorie
                    ? 'bg-white text-slate-700 border border-slate-200 hover:border-[#B8943F]'
                    : 'bg-[#0F172A] text-white'
                }`}
              >
                Alle Geräte
              </Link>
              {visibleCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/katalog?kategorie=${category.slug}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    kategorie === category.slug
                      ? 'bg-[#0F172A] text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-[#B8943F]'
                  }`}
                >
                  {category.name}
                  <span className="ml-2 text-xs opacity-60">{category.productCount}</span>
                </Link>
              ))}
            </nav>
          )}

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 lg:p-14 text-center">
              <h2 className="text-xl font-bold text-[#0F172A] mb-3">
                Aktuell sind hier keine Geräte hinterlegt
              </h2>
              <p className="text-slate-600 max-w-md mx-auto">
                Wir führen deutlich mehr Geräte, als hier gerade sichtbar sind. Sagen Sie
                uns, was Sie suchen – wir finden das passende Gerät für Ihr Studio.
              </p>
            </div>
          )}
        </div>
      </section>

      <ContactCTA />
    </>
  )
}
