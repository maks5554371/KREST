import 'server-only'

import type { Row } from '@libsql/client'
import { getDb } from './client'
import type {
  Acquisition,
  Product,
  ProductBlock,
  ProductDownload,
  ProductFaqItem,
  ProductSpecGroup,
  ProductStatus,
  ProductWithCategory,
  GalleryImage,
} from '@/types/product'

/**
 * JSON-Spalten werden beim Schreiben validiert (siehe lib/validation/product).
 * Beim Lesen zählt Robustheit: ein kaputter Datensatz darf nicht die ganze
 * Katalogseite abstürzen lassen.
 */
function parseJson<T>(value: unknown, fallback: T): T {
  if (typeof value !== 'string' || value.length === 0) return fallback
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? (parsed as T) : fallback
  } catch {
    return fallback
  }
}

function text(value: unknown): string | null {
  return value === null || value === undefined ? null : String(value)
}

function toProduct(row: Row): Product {
  return {
    id: Number(row.id),
    slug: String(row.slug),
    name: String(row.name),
    brand: text(row.brand),
    categoryId: row.category_id === null ? null : Number(row.category_id),
    status: String(row.status) as ProductStatus,
    sortOrder: Number(row.sort_order),

    headline: String(row.headline),
    cardSummary: String(row.card_summary),
    priceCents: row.price_cents === null ? null : Number(row.price_cents),
    priceNote: text(row.price_note),
    acquisition: parseJson<Acquisition[]>(row.acquisition_json, []),

    heroImage: text(row.hero_image),
    heroImageAlt: text(row.hero_image_alt),
    gallery: parseJson<GalleryImage[]>(row.gallery_json, []),
    blocks: parseJson<ProductBlock[]>(row.blocks_json, []),
    specs: parseJson<ProductSpecGroup[]>(row.specs_json, []),
    faq: parseJson<ProductFaqItem[]>(row.faq_json, []),
    downloads: parseJson<ProductDownload[]>(row.downloads_json, []),

    metaTitle: text(row.meta_title),
    metaDescription: text(row.meta_description),
    metaKeywords: text(row.meta_keywords),

    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }
}

function toProductWithCategory(row: Row): ProductWithCategory {
  return {
    ...toProduct(row),
    categoryName: text(row.category_name),
    categorySlug: text(row.category_slug),
  }
}

const SELECT_WITH_CATEGORY = `
  SELECT p.*, c.name AS category_name, c.slug AS category_slug
  FROM products p
  LEFT JOIN categories c ON c.id = p.category_id
`

/** Öffentlicher Katalog: nur veröffentlichte Produkte, optional nach Kategorie. */
export async function listPublishedProducts(
  categorySlug?: string
): Promise<ProductWithCategory[]> {
  const db = await getDb()
  const result = categorySlug
    ? await db.execute({
        sql: `${SELECT_WITH_CATEGORY}
              WHERE p.status = 'published' AND c.slug = ?
              ORDER BY p.sort_order ASC, p.name ASC`,
        args: [categorySlug],
      })
    : await db.execute(
        `${SELECT_WITH_CATEGORY}
         WHERE p.status = 'published'
         ORDER BY p.sort_order ASC, p.name ASC`
      )
  return result.rows.map(toProductWithCategory)
}

/** Admin-Übersicht: alle Produkte, auch Entwürfe. */
export async function listAllProducts(): Promise<ProductWithCategory[]> {
  const db = await getDb()
  const result = await db.execute(
    `${SELECT_WITH_CATEGORY} ORDER BY p.sort_order ASC, p.name ASC`
  )
  return result.rows.map(toProductWithCategory)
}

export async function getPublishedProductBySlug(
  slug: string
): Promise<ProductWithCategory | null> {
  const db = await getDb()
  const result = await db.execute({
    sql: `${SELECT_WITH_CATEGORY} WHERE p.slug = ? AND p.status = 'published' LIMIT 1`,
    args: [slug],
  })
  return result.rows[0] ? toProductWithCategory(result.rows[0]) : null
}

export async function getProductById(id: number): Promise<ProductWithCategory | null> {
  const db = await getDb()
  const result = await db.execute({
    sql: `${SELECT_WITH_CATEGORY} WHERE p.id = ? LIMIT 1`,
    args: [id],
  })
  return result.rows[0] ? toProductWithCategory(result.rows[0]) : null
}

export async function productSlugExists(
  slug: string,
  exceptId?: number
): Promise<boolean> {
  const db = await getDb()
  const result = await db.execute({
    sql: 'SELECT 1 FROM products WHERE slug = ? AND id IS NOT ? LIMIT 1',
    args: [slug, exceptId ?? null],
  })
  return result.rows.length > 0
}

/** Datensatz ohne die von der DB verwalteten Felder (id, Zeitstempel). */
export type ProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>

function writeArgs(input: ProductInput) {
  return [
    input.slug,
    input.name,
    input.brand,
    input.categoryId,
    input.status,
    input.sortOrder,
    input.headline,
    input.cardSummary,
    input.priceCents,
    input.priceNote,
    JSON.stringify(input.acquisition),
    input.heroImage,
    input.heroImageAlt,
    JSON.stringify(input.gallery),
    JSON.stringify(input.blocks),
    JSON.stringify(input.specs),
    JSON.stringify(input.faq),
    JSON.stringify(input.downloads),
    input.metaTitle,
    input.metaDescription,
    input.metaKeywords,
  ]
}

export async function createProduct(input: ProductInput): Promise<number> {
  const db = await getDb()
  const now = new Date().toISOString()
  const result = await db.execute({
    sql: `INSERT INTO products (
            slug, name, brand, category_id, status, sort_order,
            headline, card_summary, price_cents, price_note, acquisition_json,
            hero_image, hero_image_alt, gallery_json, blocks_json, specs_json,
            faq_json, downloads_json, meta_title, meta_description, meta_keywords,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [...writeArgs(input), now, now],
  })
  return Number(result.lastInsertRowid)
}

export async function updateProduct(id: number, input: ProductInput): Promise<void> {
  const db = await getDb()
  await db.execute({
    sql: `UPDATE products SET
            slug = ?, name = ?, brand = ?, category_id = ?, status = ?, sort_order = ?,
            headline = ?, card_summary = ?, price_cents = ?, price_note = ?, acquisition_json = ?,
            hero_image = ?, hero_image_alt = ?, gallery_json = ?, blocks_json = ?, specs_json = ?,
            faq_json = ?, downloads_json = ?, meta_title = ?, meta_description = ?, meta_keywords = ?,
            updated_at = ?
          WHERE id = ?`,
    args: [...writeArgs(input), new Date().toISOString(), id],
  })
}

export async function deleteProduct(id: number): Promise<void> {
  const db = await getDb()
  await db.execute({ sql: 'DELETE FROM products WHERE id = ?', args: [id] })
}

/** Slugs aller veröffentlichten Produkte – für die Sitemap. */
export async function listPublishedSlugs(): Promise<
  { slug: string; updatedAt: string }[]
> {
  const db = await getDb()
  const result = await db.execute(
    `SELECT slug, updated_at FROM products WHERE status = 'published' ORDER BY slug`
  )
  return result.rows.map((row) => ({
    slug: String(row.slug),
    updatedAt: String(row.updated_at),
  }))
}
