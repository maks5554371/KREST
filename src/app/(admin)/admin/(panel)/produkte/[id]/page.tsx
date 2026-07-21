import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeftIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

import { requireAdmin } from '@/lib/auth/guard'
import { getProductById } from '@/lib/db/products'
import { listCategories } from '@/lib/db/categories'
import ProductForm from '@/components/admin/ProductForm'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()

  const { id } = await params
  const numericId = Number(id)
  if (!Number.isInteger(numericId) || numericId <= 0) notFound()

  const [product, categories] = await Promise.all([
    getProductById(numericId),
    listCategories(),
  ])
  if (!product) notFound()

  return (
    <>
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#0F172A] mb-4 transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Zurück zur Übersicht
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[#0F172A]">{product.name}</h1>
        {product.status === 'published' && (
          <Link
            href={`/katalog/${product.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-[#B8943F] transition-colors"
          >
            Im Katalog ansehen
            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
          </Link>
        )}
      </div>

      <ProductForm product={product} categories={categories} />
    </>
  )
}
