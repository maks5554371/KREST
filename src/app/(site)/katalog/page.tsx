import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  WrenchScrewdriverIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline'
import CatalogGrid from '@/components/catalog/CatalogGrid'
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

const trustPoints = [
  { Icon: ShieldCheckIcon, label: '100 % herstellerunabhängig' },
  { Icon: ChatBubbleLeftRightIcon, label: 'Kostenlose Beratung' },
  { Icon: WrenchScrewdriverIcon, label: 'Wartung & Reparatur' },
  { Icon: BanknotesIcon, label: 'Kauf, Leasing & Miete' },
]

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
      <section className="relative overflow-hidden bg-navy-900 py-16 lg:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-400">
            Unsere Geräte
          </p>
          <h1 className="mb-4 text-balance font-serif text-4xl font-bold text-white lg:text-6xl">
            {activeCategory ? activeCategory.name : 'Kosmetikgeräte-Katalog'}
          </h1>
          <p className="max-w-2xl leading-relaxed text-slate-300">
            {activeCategory?.description ??
              'Von Diodenlasern über SHR und IPL bis hin zu Kryolipolyse und Aquafacial: Hier finden Sie unsere Geräte mit allen technischen Details. Sie sind sich unsicher, was zu Ihrem Studio passt? Wir beraten Sie kostenlos und unverbindlich.'}
          </p>
        </div>
      </section>

      {/* Trust-Leiste */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-5 sm:px-6 lg:grid-cols-4 lg:px-8">
          {trustPoints.map(({ Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500/10 ring-1 ring-gold-500/15">
                <Icon className="h-5 w-5 text-gold-600" />
              </span>
              <span className="text-sm font-medium text-navy-900">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="bg-slate-50 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {visibleCategories.length > 0 && (
            <nav aria-label="Kategorien" className="mb-10 flex flex-wrap gap-2">
              <Link
                href="/katalog"
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  kategorie
                    ? 'border border-slate-200 bg-white text-slate-700 hover:border-gold-500 hover:text-navy-900'
                    : 'bg-navy-900 text-white shadow-sm'
                }`}
              >
                Alle Geräte
              </Link>
              {visibleCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/katalog?kategorie=${category.slug}`}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    kategorie === category.slug
                      ? 'bg-navy-900 text-white shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-700 hover:border-gold-500 hover:text-navy-900'
                  }`}
                >
                  {category.name}
                  <span className="ml-2 text-xs opacity-60">{category.productCount}</span>
                </Link>
              ))}
            </nav>
          )}

          <CatalogGrid products={products} />
        </div>
      </section>

      <ContactCTA />
    </>
  )
}
