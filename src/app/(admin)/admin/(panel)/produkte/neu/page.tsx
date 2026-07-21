import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

import { requireAdmin } from '@/lib/auth/guard'
import { listCategories } from '@/lib/db/categories'
import ProductForm from '@/components/admin/ProductForm'

export const dynamic = 'force-dynamic'

export default async function NewProductPage() {
  await requireAdmin()
  const categories = await listCategories()

  return (
    <>
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#0F172A] mb-4 transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Zurück zur Übersicht
      </Link>

      <h1 className="text-2xl font-bold text-[#0F172A] mb-6">Neues Produkt</h1>

      <ProductForm product={null} categories={categories} />
    </>
  )
}
