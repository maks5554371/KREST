'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'

import { saveProductAction } from '@/app/(admin)/admin/actions'
import { Field, SectionCard, Select, TextArea, TextInput } from './AdminFields'
import { BlockEditor, FaqEditor, SpecsEditor } from './ContentEditors'
import { DownloadsEditor, GalleryEditor, HeroImageField } from './MediaEditors'
import { slugify, type FormState } from '@/lib/validation/product'
import { centsToEuroInput } from '@/lib/format'
import {
  ACQUISITION_LABELS,
  ACQUISITION_OPTIONS,
  type Acquisition,
  type Category,
  type GalleryImage,
  type ProductBlock,
  type ProductDownload,
  type ProductFaqItem,
  type ProductSpecGroup,
  type ProductWithCategory,
} from '@/types/product'

const initialState: FormState = {}

export default function ProductForm({
  product,
  categories,
}: {
  product: ProductWithCategory | null
  categories: Category[]
}) {
  const [state, action, pending] = useActionState(saveProductAction, initialState)

  // Verschachtelte Felder leben im Client-State und gehen als JSON in
  // versteckten Feldern mit dem Formular raus.
  const [blocks, setBlocks] = useState<ProductBlock[]>(product?.blocks ?? [])
  const [specs, setSpecs] = useState<ProductSpecGroup[]>(product?.specs ?? [])
  const [faq, setFaq] = useState<ProductFaqItem[]>(product?.faq ?? [])
  const [gallery, setGallery] = useState<GalleryImage[]>(product?.gallery ?? [])
  const [downloads, setDownloads] = useState<ProductDownload[]>(product?.downloads ?? [])
  const [hero, setHero] = useState({
    url: product?.heroImage ?? '',
    alt: product?.heroImageAlt ?? '',
  })

  const [name, setName] = useState(product?.name ?? '')
  const [slug, setSlug] = useState(product?.slug ?? '')
  // Bei bestehenden Produkten den Slug nicht mehr automatisch ändern:
  // er steht in der URL und in Google.
  const [slugTouched, setSlugTouched] = useState(Boolean(product))

  const errors = state.errors ?? {}

  return (
    <form action={action} className="space-y-6">
      {product && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="blocks" value={JSON.stringify(blocks)} />
      <input type="hidden" name="specs" value={JSON.stringify(specs)} />
      <input type="hidden" name="faq" value={JSON.stringify(faq)} />
      <input type="hidden" name="gallery" value={JSON.stringify(gallery)} />
      <input type="hidden" name="downloads" value={JSON.stringify(downloads)} />
      <input type="hidden" name="heroImage" value={hero.url} />
      <input type="hidden" name="heroImageAlt" value={hero.alt} />

      {state.message && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800"
        >
          {state.message}
        </p>
      )}

      <SectionCard
        title="Grunddaten"
        description="Name, Adresse der Seite und Einordnung im Katalog."
      >
        <Field label="Name" htmlFor="name" required errors={errors.name}>
          <TextInput
            id="name"
            name="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              if (!slugTouched) setSlug(slugify(event.target.value))
            }}
            placeholder="z. B. Luna Ray Diodenlaser"
          />
        </Field>

        <Field
          label="Slug"
          htmlFor="slug"
          required
          hint={`Adresse der Seite: /katalog/${slug || '…'}`}
          errors={errors.slug}
        >
          <TextInput
            id="slug"
            name="slug"
            value={slug}
            onChange={(event) => {
              setSlugTouched(true)
              setSlug(event.target.value)
            }}
            onBlur={(event) => setSlug(slugify(event.target.value))}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Hersteller / Marke" htmlFor="brand" errors={errors.brand}>
            <TextInput
              id="brand"
              name="brand"
              defaultValue={product?.brand ?? ''}
              placeholder="z. B. ENEKA"
            />
          </Field>

          <Field label="Kategorie" htmlFor="categoryId" errors={errors.categoryId}>
            <Select
              id="categoryId"
              name="categoryId"
              defaultValue={product?.categoryId ?? ''}
            >
              <option value="">– keine –</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Status" htmlFor="status" required errors={errors.status}>
            <Select id="status" name="status" defaultValue={product?.status ?? 'draft'}>
              <option value="draft">Entwurf (nicht öffentlich)</option>
              <option value="published">Veröffentlicht</option>
            </Select>
          </Field>

          <Field
            label="Sortierung"
            htmlFor="sortOrder"
            hint="Kleinere Zahl erscheint weiter oben."
            errors={errors.sortOrder}
          >
            <TextInput
              id="sortOrder"
              name="sortOrder"
              type="number"
              min={0}
              defaultValue={product?.sortOrder ?? 0}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard
        title="Kurzinformationen"
        description="Was Besucher zuerst sehen – auf der Katalogkachel und oben auf der Produktseite."
      >
        <Field
          label="Überschrift (H1)"
          htmlFor="headline"
          required
          hint="Die grosse Überschrift auf der Produktseite."
          errors={errors.headline}
        >
          <TextInput
            id="headline"
            name="headline"
            defaultValue={product?.headline ?? ''}
            placeholder="z. B. Luna Ray – Diodenlaser mit 4 Wellenlängen"
          />
        </Field>

        <Field
          label="Kurzbeschreibung"
          htmlFor="cardSummary"
          required
          hint="Erscheint auf der Kachel im Katalog. Zwei bis drei Sätze."
          errors={errors.cardSummary}
        >
          <TextArea
            id="cardSummary"
            name="cardSummary"
            rows={4}
            defaultValue={product?.cardSummary ?? ''}
          />
        </Field>
      </SectionCard>

      <SectionCard title="Preis und Erwerb">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Preis in Euro"
            htmlFor="price"
            hint="Leer lassen für „Preis auf Anfrage“."
            errors={errors.priceCents}
          >
            <TextInput
              id="price"
              name="price"
              inputMode="decimal"
              defaultValue={centsToEuroInput(product?.priceCents ?? null)}
              placeholder="z. B. 12900"
            />
          </Field>

          <Field
            label="Preiszusatz"
            htmlFor="priceNote"
            hint="z. B. „zzgl. MwSt.“ oder „ab, je nach Ausstattung“."
            errors={errors.priceNote}
          >
            <TextInput
              id="priceNote"
              name="priceNote"
              defaultValue={product?.priceNote ?? ''}
            />
          </Field>
        </div>

        <fieldset>
          <legend className="block text-sm font-medium text-slate-700 mb-2">
            Verfügbar als
          </legend>
          <div className="flex flex-wrap gap-4">
            {ACQUISITION_OPTIONS.map((option: Acquisition) => (
              <label key={option} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  name="acquisition"
                  value={option}
                  defaultChecked={product?.acquisition.includes(option) ?? false}
                  className="rounded border-slate-300 text-[#B8943F] focus:ring-[#B8943F]/30"
                />
                {ACQUISITION_LABELS[option]}
              </label>
            ))}
          </div>
        </fieldset>
      </SectionCard>

      <SectionCard title="Titelbild">
        <HeroImageField
          url={hero.url}
          alt={hero.alt}
          onChange={(patch) => setHero((current) => ({ ...current, ...patch }))}
          errors={errors.heroImageAlt}
        />
      </SectionCard>

      <SectionCard
        title="Ausführliche Beschreibung"
        description="Hier entsteht der lange Text der Produktseite: Überschriften, Absätze, Aufzählungen."
      >
        <BlockEditor blocks={blocks} onChange={setBlocks} />
      </SectionCard>

      <SectionCard
        title="Technische Daten"
        description="Werte in Gruppen – erscheinen als Tabelle auf der Produktseite."
      >
        <SpecsEditor specs={specs} onChange={setSpecs} />
      </SectionCard>

      <SectionCard title="Bildergalerie">
        <GalleryEditor images={gallery} onChange={setGallery} />
      </SectionCard>

      <SectionCard title="Häufige Fragen (FAQ)">
        <FaqEditor faq={faq} onChange={setFaq} />
      </SectionCard>

      <SectionCard
        title="Downloads"
        description="Broschüren und Datenblätter als PDF."
      >
        <DownloadsEditor downloads={downloads} onChange={setDownloads} />
      </SectionCard>

      <SectionCard
        title="Suchmaschinen (SEO)"
        description="Bleibt leer, wird automatisch aus Name und Kurzbeschreibung erzeugt."
      >
        <Field
          label="Meta-Titel"
          htmlFor="metaTitle"
          hint="Ideal 50–60 Zeichen."
          errors={errors.metaTitle}
        >
          <TextInput
            id="metaTitle"
            name="metaTitle"
            defaultValue={product?.metaTitle ?? ''}
          />
        </Field>

        <Field
          label="Meta-Beschreibung"
          htmlFor="metaDescription"
          hint="Ideal 140–160 Zeichen."
          errors={errors.metaDescription}
        >
          <TextArea
            id="metaDescription"
            name="metaDescription"
            rows={3}
            defaultValue={product?.metaDescription ?? ''}
          />
        </Field>

        <Field label="Keywords" htmlFor="metaKeywords" errors={errors.metaKeywords}>
          <TextInput
            id="metaKeywords"
            name="metaKeywords"
            defaultValue={product?.metaKeywords ?? ''}
            placeholder="Diodenlaser kaufen, Haarentfernung Gerät"
          />
        </Field>
      </SectionCard>

      <div className="flex items-center gap-3 sticky bottom-0 bg-slate-100 py-4 border-t border-slate-200">
        <button
          type="submit"
          disabled={pending}
          className="bg-[#B8943F] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#9d7d34] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {pending ? 'Wird gespeichert …' : 'Speichern'}
        </button>
        <Link
          href="/admin"
          className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-[#0F172A] transition-colors"
        >
          Abbrechen
        </Link>
      </div>
    </form>
  )
}
