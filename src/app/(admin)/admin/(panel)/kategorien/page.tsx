import { requireAdmin } from '@/lib/auth/guard'
import { listCategories } from '@/lib/db/categories'
import CategoryManager from '@/components/admin/CategoryManager'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  await requireAdmin()
  const categories = await listCategories()

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0F172A]">Kategorien</h1>
        <p className="text-sm text-slate-500 mt-1">
          Gruppieren die Geräte im Katalog und dienen dort als Filter.
        </p>
      </div>

      <CategoryManager categories={categories} />
    </>
  )
}
