'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

import { requireAdmin } from '@/lib/auth/guard'
import { verifyPassword } from '@/lib/auth/password'
import { createSession, destroySession } from '@/lib/auth/session'
import {
  categoryFormSchema,
  flattenErrors,
  productFormSchema,
  type FormState,
} from '@/lib/validation/product'
import {
  createProduct,
  deleteProduct,
  productSlugExists,
  updateProduct,
  type ProductInput,
} from '@/lib/db/products'
import {
  categorySlugExists,
  createCategory,
  deleteCategory,
  updateCategory,
} from '@/lib/db/categories'

/**
 * Einfache Bremse gegen Passwort-Raten. Im Speicher des Prozesses – bei einem
 * einzelnen Server (so ist der Betrieb geplant) reicht das aus.
 */
const loginAttempts = new Map<string, { count: number; firstAt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000

async function clientKey(): Promise<string> {
  const headerList = await headers()
  return (
    headerList.get('x-forwarded-for')?.split(',')[0].trim() ||
    headerList.get('x-real-ip') ||
    'unknown'
  )
}

function rateLimited(key: string): boolean {
  const entry = loginAttempts.get(key)
  if (!entry) return false
  if (Date.now() - entry.firstAt > WINDOW_MS) {
    loginAttempts.delete(key)
    return false
  }
  return entry.count >= MAX_ATTEMPTS
}

function noteFailure(key: string): void {
  const entry = loginAttempts.get(key)
  if (!entry || Date.now() - entry.firstAt > WINDOW_MS) {
    loginAttempts.set(key, { count: 1, firstAt: Date.now() })
    return
  }
  entry.count += 1
}

export async function loginAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const key = await clientKey()

  if (rateLimited(key)) {
    return {
      message: 'Zu viele Fehlversuche. Bitte in 15 Minuten erneut versuchen.',
    }
  }

  const password = String(formData.get('password') ?? '')
  if (!password) {
    return { message: 'Bitte Passwort eingeben.' }
  }

  const valid = await verifyPassword(password, process.env.ADMIN_PASSWORD_HASH)
  if (!valid) {
    noteFailure(key)
    return { message: 'Passwort ist falsch.' }
  }

  loginAttempts.delete(key)
  await createSession()
  // redirect() wirft eine Kontrollfluss-Ausnahme – muss ausserhalb von try/catch stehen.
  redirect('/admin')
}

export async function logoutAction(): Promise<void> {
  await destroySession()
  redirect('/admin/login')
}

/** Aktualisiert alle Ansichten, die Katalogdaten zeigen. */
function revalidateCatalog(slug?: string): void {
  revalidatePath('/katalog')
  revalidatePath('/admin')
  if (slug) revalidatePath(`/katalog/${slug}`)
}

export async function saveProductAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Server Actions sind laut Next.js-Doku direkt per POST erreichbar:
  // Autorisierung gehört in jede einzelne Action, nicht nur ins Layout.
  await requireAdmin()

  const rawId = formData.get('id')
  const id = rawId ? Number(rawId) : null

  const parsed = productFormSchema.safeParse({
    slug: formData.get('slug'),
    name: formData.get('name'),
    brand: formData.get('brand'),
    categoryId: formData.get('categoryId'),
    status: formData.get('status'),
    sortOrder: formData.get('sortOrder'),
    headline: formData.get('headline'),
    cardSummary: formData.get('cardSummary'),
    priceCents: formData.get('price'),
    priceNote: formData.get('priceNote'),
    acquisition: formData.getAll('acquisition'),
    heroImage: formData.get('heroImage'),
    heroImageAlt: formData.get('heroImageAlt'),
    gallery: formData.get('gallery'),
    blocks: formData.get('blocks'),
    specs: formData.get('specs'),
    faq: formData.get('faq'),
    downloads: formData.get('downloads'),
    metaTitle: formData.get('metaTitle'),
    metaDescription: formData.get('metaDescription'),
    metaKeywords: formData.get('metaKeywords'),
  })

  if (!parsed.success) {
    return {
      message: 'Bitte die markierten Felder prüfen.',
      errors: flattenErrors(parsed.error),
    }
  }

  if (await productSlugExists(parsed.data.slug, id ?? undefined)) {
    return {
      message: 'Dieser Slug wird bereits verwendet.',
      errors: { slug: ['Slug ist bereits vergeben.'] },
    }
  }

  const input: ProductInput = parsed.data

  if (id) {
    await updateProduct(id, input)
  } else {
    await createProduct(input)
  }

  revalidateCatalog(input.slug)
  redirect('/admin?gespeichert=1')
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  await requireAdmin()

  const id = Number(formData.get('id'))
  if (!Number.isInteger(id) || id <= 0) return

  const slug = String(formData.get('slug') ?? '')
  await deleteProduct(id)

  revalidateCatalog(slug || undefined)
  redirect('/admin?geloescht=1')
}

export async function saveCategoryAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin()

  const rawId = formData.get('id')
  const id = rawId ? Number(rawId) : null

  const parsed = categoryFormSchema.safeParse({
    slug: formData.get('slug'),
    name: formData.get('name'),
    description: formData.get('description'),
    sortOrder: formData.get('sortOrder'),
  })

  if (!parsed.success) {
    return {
      message: 'Bitte die markierten Felder prüfen.',
      errors: flattenErrors(parsed.error),
    }
  }

  if (await categorySlugExists(parsed.data.slug, id ?? undefined)) {
    return {
      message: 'Dieser Slug wird bereits verwendet.',
      errors: { slug: ['Slug ist bereits vergeben.'] },
    }
  }

  if (id) {
    await updateCategory(id, parsed.data)
  } else {
    await createCategory(parsed.data)
  }

  revalidatePath('/katalog')
  revalidatePath('/admin/kategorien')
  return { ok: true, message: 'Kategorie gespeichert.' }
}

export async function deleteCategoryAction(formData: FormData): Promise<void> {
  await requireAdmin()

  const id = Number(formData.get('id'))
  if (!Number.isInteger(id) || id <= 0) return

  // Produkte bleiben erhalten, ihre Kategorie wird auf NULL gesetzt
  // (ON DELETE SET NULL im Schema).
  await deleteCategory(id)

  revalidatePath('/katalog')
  revalidatePath('/admin/kategorien')
}
