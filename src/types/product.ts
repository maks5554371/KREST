import type { ServiceSection } from '@/types/service'

/**
 * Textblöcke der Produktseite. Bewusst identisch zu `ServiceSection`, damit
 * Leistungen und Produkte über denselben Renderer laufen (ContentBlocks).
 */
export type ProductBlock = ServiceSection

export interface GalleryImage {
  url: string
  alt: string
}

export interface ProductSpecItem {
  label: string
  value: string
}

export interface ProductSpecGroup {
  group: string
  items: ProductSpecItem[]
}

export interface ProductFaqItem {
  question: string
  answer: string
}

export interface ProductDownload {
  label: string
  url: string
}

export type ProductStatus = 'draft' | 'published'

/** Erwerbsformen – deckt sich mit den Leistungsseiten (Kauf/Leasing/Miete). */
export const ACQUISITION_OPTIONS = ['kauf', 'leasing', 'finanzierung', 'miete'] as const
export type Acquisition = (typeof ACQUISITION_OPTIONS)[number]

export const ACQUISITION_LABELS: Record<Acquisition, string> = {
  kauf: 'Kauf',
  leasing: 'Leasing',
  finanzierung: 'Finanzierung',
  miete: 'Miete',
}

export interface Category {
  id: number
  slug: string
  name: string
  description: string | null
  sortOrder: number
}

export interface Product {
  id: number
  slug: string
  name: string
  brand: string | null
  categoryId: number | null
  status: ProductStatus
  sortOrder: number

  headline: string
  cardSummary: string
  /** Preis in Cent. `null` bedeutet „Preis auf Anfrage“. */
  priceCents: number | null
  priceNote: string | null
  acquisition: Acquisition[]

  heroImage: string | null
  heroImageAlt: string | null
  gallery: GalleryImage[]
  blocks: ProductBlock[]
  specs: ProductSpecGroup[]
  faq: ProductFaqItem[]
  downloads: ProductDownload[]

  metaTitle: string | null
  metaDescription: string | null
  metaKeywords: string | null

  createdAt: string
  updatedAt: string
}

/** Produkt inkl. aufgelöster Kategorie – für Listen und Detailseiten. */
export interface ProductWithCategory extends Product {
  categoryName: string | null
  categorySlug: string | null
}
