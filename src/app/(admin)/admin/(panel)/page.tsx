import Link from 'next/link'
import Image from 'next/image'
import { PencilSquareIcon, PhotoIcon, PlusIcon } from '@heroicons/react/24/outline'

import { requireAdmin } from '@/lib/auth/guard'
import { listAllProducts } from '@/lib/db/products'
import { formatPrice } from '@/lib/format'
import DeleteProductButton from '@/components/admin/DeleteProductButton'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ gespeichert?: string; geloescht?: string }>
}) {
  await requireAdmin()

  const [products, flags] = await Promise.all([listAllProducts(), searchParams])

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Produkte</h1>
          <p className="text-sm text-slate-500 mt-1">
            {products.length} {products.length === 1 ? 'Eintrag' : 'Einträge'} im Katalog
          </p>
        </div>
        <Link
          href="/admin/produkte/neu"
          className="inline-flex items-center gap-2 bg-[#B8943F] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#9d7d34] transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Neues Produkt
        </Link>
      </div>

      {(flags.gespeichert || flags.geloescht) && (
        <p className="mb-6 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
          {flags.gespeichert ? 'Produkt gespeichert.' : 'Produkt gelöscht.'}
        </p>
      )}

      {products.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <h2 className="font-semibold text-[#0F172A] mb-2">Noch keine Produkte</h2>
          <p className="text-sm text-slate-500 mb-6">
            Legen Sie das erste Gerät an – es erscheint danach im öffentlichen Katalog.
          </p>
          <Link
            href="/admin/produkte/neu"
            className="inline-flex items-center gap-2 bg-[#0F172A] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1e293b] transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Erstes Produkt anlegen
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <ul className="divide-y divide-slate-100">
            {products.map((product) => (
              <li
                key={product.id}
                className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                  {product.heroImage ? (
                    <Image
                      src={product.heroImage}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PhotoIcon className="w-6 h-6 text-slate-300" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-[#0F172A] truncate">{product.name}</p>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        product.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {product.status === 'published' ? 'Veröffentlicht' : 'Entwurf'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 truncate">
                    {[product.categoryName, product.brand, formatPrice(product.priceCents)]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/produkte/${product.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-[#B8943F] px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Bearbeiten</span>
                  </Link>
                  <DeleteProductButton
                    id={product.id}
                    slug={product.slug}
                    name={product.name}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
