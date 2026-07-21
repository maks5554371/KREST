import * as z from 'zod'
import { ACQUISITION_OPTIONS } from '@/types/product'

/** Slug: kleingeschrieben, nur a–z, 0–9 und Bindestriche. */
export const slugSchema = z
  .string()
  .trim()
  .min(1, { error: 'Slug darf nicht leer sein.' })
  .max(120, { error: 'Slug ist zu lang (max. 120 Zeichen).' })
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    error: 'Nur Kleinbuchstaben, Ziffern und einzelne Bindestriche erlaubt.',
  })

/** Erzeugt aus einem Titel einen gültigen Slug (inkl. deutscher Umlaute). */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    // NFD trennt Akzente vom Grundbuchstaben; die nächste Zeile entfernt den
    // Bereich der kombinierenden Zeichen (U+0300–U+036F), z. B. é -> e.
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120)
}

const blockSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('h2'),
    content: z.string().trim().min(1, { error: 'Überschrift darf nicht leer sein.' }),
  }),
  z.object({
    type: z.literal('h3'),
    content: z.string().trim().min(1, { error: 'Überschrift darf nicht leer sein.' }),
  }),
  z.object({
    type: z.literal('paragraph'),
    content: z.string().trim().min(1, { error: 'Absatz darf nicht leer sein.' }),
  }),
  z.object({
    type: z.literal('bulletList'),
    content: z
      .array(z.string().trim().min(1))
      .min(1, { error: 'Liste braucht mindestens einen Punkt.' }),
  }),
  z.object({
    type: z.literal('cta'),
    content: z.string().trim().min(1, { error: 'Button-Text darf nicht leer sein.' }),
  }),
])

const galleryImageSchema = z.object({
  url: z.string().trim().min(1),
  alt: z.string().trim().default(''),
})

const specGroupSchema = z.object({
  group: z.string().trim().min(1, { error: 'Gruppenname darf nicht leer sein.' }),
  items: z
    .array(
      z.object({
        label: z.string().trim().min(1, { error: 'Bezeichnung fehlt.' }),
        value: z.string().trim().min(1, { error: 'Wert fehlt.' }),
      })
    )
    .min(1, { error: 'Gruppe braucht mindestens einen Eintrag.' }),
})

const faqItemSchema = z.object({
  question: z.string().trim().min(1, { error: 'Frage darf nicht leer sein.' }),
  answer: z.string().trim().min(1, { error: 'Antwort darf nicht leer sein.' }),
})

const downloadSchema = z.object({
  label: z.string().trim().min(1, { error: 'Bezeichnung fehlt.' }),
  url: z.string().trim().min(1, { error: 'Datei fehlt.' }),
})

/**
 * Die verschachtelten Felder kommen als JSON-String aus versteckten Formularfeldern
 * (der Block-Editor ist eine Client-Komponente). Erst parsen, dann validieren.
 */
function jsonArray<T extends z.ZodType>(schema: T) {
  return z.preprocess((value) => {
    if (typeof value !== 'string') return value ?? []
    if (value.trim() === '') return []
    try {
      return JSON.parse(value)
    } catch {
      return z.NEVER
    }
  }, z.array(schema))
}

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value === '' ? null : value))
  .nullable()

export const productFormSchema = z.object({
  slug: slugSchema,
  name: z.string().trim().min(1, { error: 'Name ist erforderlich.' }).max(200),
  brand: optionalText,
  categoryId: z.preprocess(
    (value) => (value === '' || value === null || value === undefined ? null : Number(value)),
    z.number().int().positive().nullable()
  ),
  status: z.enum(['draft', 'published']),
  sortOrder: z.preprocess(
    (value) => (value === '' || value === null || value === undefined ? 0 : Number(value)),
    z.number().int().min(0).max(9999)
  ),

  headline: z.string().trim().min(1, { error: 'Überschrift ist erforderlich.' }).max(300),
  cardSummary: z
    .string()
    .trim()
    .min(1, { error: 'Kurzbeschreibung ist erforderlich.' })
    .max(1000),

  // Eingabe in Euro, Speicherung in Cent – vermeidet Rundungsfehler.
  priceCents: z.preprocess((value) => {
    if (value === '' || value === null || value === undefined) return null
    const euros = Number(String(value).replace(',', '.'))
    return Number.isFinite(euros) ? Math.round(euros * 100) : Number.NaN
  }, z.number().int().min(0).max(100_000_000).nullable()),
  priceNote: optionalText,
  acquisition: z.preprocess(
    (value) => (Array.isArray(value) ? value : value ? [value] : []),
    z.array(z.enum(ACQUISITION_OPTIONS))
  ),

  heroImage: optionalText,
  heroImageAlt: optionalText,
  gallery: jsonArray(galleryImageSchema),
  blocks: jsonArray(blockSchema),
  specs: jsonArray(specGroupSchema),
  faq: jsonArray(faqItemSchema),
  downloads: jsonArray(downloadSchema),

  metaTitle: optionalText,
  metaDescription: optionalText,
  metaKeywords: optionalText,
})

export type ProductFormValues = z.infer<typeof productFormSchema>

export const categoryFormSchema = z.object({
  slug: slugSchema,
  name: z.string().trim().min(1, { error: 'Name ist erforderlich.' }).max(120),
  description: optionalText,
  sortOrder: z.preprocess(
    (value) => (value === '' || value === null || value === undefined ? 0 : Number(value)),
    z.number().int().min(0).max(9999)
  ),
})

/** Formularfehler in der Form, die `useActionState` an die UI zurückgibt. */
export type FormState = {
  ok?: boolean
  message?: string
  errors?: Record<string, string[]>
}

export function flattenErrors(error: z.ZodError): Record<string, string[]> {
  const result: Record<string, string[]> = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '_form'
    ;(result[key] ??= []).push(issue.message)
  }
  return result
}
