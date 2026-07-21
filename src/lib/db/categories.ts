import 'server-only'

import type { Row } from '@libsql/client'
import { getDb } from './client'
import type { Category } from '@/types/product'

function toCategory(row: Row): Category {
  return {
    id: Number(row.id),
    slug: String(row.slug),
    name: String(row.name),
    description: row.description === null ? null : String(row.description),
    sortOrder: Number(row.sort_order),
  }
}

export async function listCategories(): Promise<Category[]> {
  const db = await getDb()
  const result = await db.execute(
    'SELECT * FROM categories ORDER BY sort_order ASC, name ASC'
  )
  return result.rows.map(toCategory)
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const db = await getDb()
  const result = await db.execute({
    sql: 'SELECT * FROM categories WHERE slug = ? LIMIT 1',
    args: [slug],
  })
  return result.rows[0] ? toCategory(result.rows[0]) : null
}

/** Kategorien inkl. Anzahl veröffentlichter Produkte – für Filter im Katalog. */
export async function listCategoriesWithCounts(): Promise<
  (Category & { productCount: number })[]
> {
  const db = await getDb()
  const result = await db.execute(
    `SELECT c.*, COUNT(p.id) AS product_count
     FROM categories c
     LEFT JOIN products p ON p.category_id = c.id AND p.status = 'published'
     GROUP BY c.id
     ORDER BY c.sort_order ASC, c.name ASC`
  )
  return result.rows.map((row) => ({
    ...toCategory(row),
    productCount: Number(row.product_count),
  }))
}

export async function createCategory(input: {
  slug: string
  name: string
  description: string | null
  sortOrder: number
}): Promise<number> {
  const db = await getDb()
  const result = await db.execute({
    sql: 'INSERT INTO categories (slug, name, description, sort_order) VALUES (?, ?, ?, ?)',
    args: [input.slug, input.name, input.description, input.sortOrder],
  })
  return Number(result.lastInsertRowid)
}

export async function updateCategory(
  id: number,
  input: { slug: string; name: string; description: string | null; sortOrder: number }
): Promise<void> {
  const db = await getDb()
  await db.execute({
    sql: 'UPDATE categories SET slug = ?, name = ?, description = ?, sort_order = ? WHERE id = ?',
    args: [input.slug, input.name, input.description, input.sortOrder, id],
  })
}

export async function deleteCategory(id: number): Promise<void> {
  const db = await getDb()
  // products.category_id ist ON DELETE SET NULL – Produkte bleiben erhalten.
  await db.execute({ sql: 'DELETE FROM categories WHERE id = ?', args: [id] })
}

/** Prüft, ob ein Slug bereits vergeben ist (optional unter Ausschluss einer ID). */
export async function categorySlugExists(
  slug: string,
  exceptId?: number
): Promise<boolean> {
  const db = await getDb()
  const result = await db.execute({
    sql: 'SELECT 1 FROM categories WHERE slug = ? AND id IS NOT ? LIMIT 1',
    args: [slug, exceptId ?? null],
  })
  return result.rows.length > 0
}
