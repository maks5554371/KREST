'use client'

import Image from 'next/image'
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'
import ListEditor from './ListEditor'
import UploadButton from './UploadButton'
import { Field, TextInput } from './AdminFields'
import type { GalleryImage, ProductDownload } from '@/types/product'

const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp'

export function HeroImageField({
  url,
  alt,
  onChange,
  errors,
}: {
  url: string
  alt: string
  onChange: (patch: { url?: string; alt?: string }) => void
  errors?: string[]
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-4">
        <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
          {url ? (
            <Image src={url} alt="" fill sizes="128px" className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <PhotoIcon className="w-8 h-8 text-slate-300" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <UploadButton
              accept={IMAGE_ACCEPT}
              label={url ? 'Bild ersetzen' : 'Bild hochladen'}
              onUploaded={(uploaded) => onChange({ url: uploaded })}
            />
            {url && (
              <button
                type="button"
                onClick={() => onChange({ url: '', alt: '' })}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
                Entfernen
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500">JPG, PNG oder WebP, max. 10 MB.</p>
        </div>
      </div>

      {url && (
        <Field
          label="Bildbeschreibung (Alt-Text)"
          hint="Wird von Screenreadern vorgelesen und hilft der Google-Bildersuche."
          errors={errors}
        >
          <TextInput
            value={alt}
            onChange={(event) => onChange({ alt: event.target.value })}
            placeholder="z. B. Diodenlaser Luna Ray im Behandlungsraum"
          />
        </Field>
      )}
    </div>
  )
}

export function GalleryEditor({
  images,
  onChange,
}: {
  images: GalleryImage[]
  onChange: (images: GalleryImage[]) => void
}) {
  return (
    <div className="space-y-3">
      <UploadButton
        accept={IMAGE_ACCEPT}
        label="Bild zur Galerie hinzufügen"
        onUploaded={(url) => onChange([...images, { url, alt: '' }])}
      />

      <ListEditor
        items={images}
        onChange={onChange}
        createItem={() => ({ url: '', alt: '' })}
        addLabel="Leeren Eintrag hinzufügen"
        emptyHint="Noch keine Galeriebilder. Laden Sie oben das erste Bild hoch."
        itemLabel={(_, index) => `Bild ${index + 1}`}
        renderItem={(image, _index, update) => (
          <div className="flex gap-3">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
              {image.url ? (
                <Image src={image.url} alt="" fill sizes="80px" className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <PhotoIcon className="w-6 h-6 text-slate-300" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <TextInput
                value={image.alt}
                onChange={(event) => update({ alt: event.target.value })}
                placeholder="Bildbeschreibung (Alt-Text)"
              />
              {!image.url && (
                <UploadButton
                  accept={IMAGE_ACCEPT}
                  label="Bild wählen"
                  onUploaded={(url) => update({ url })}
                />
              )}
            </div>
          </div>
        )}
      />
    </div>
  )
}

export function DownloadsEditor({
  downloads,
  onChange,
}: {
  downloads: ProductDownload[]
  onChange: (downloads: ProductDownload[]) => void
}) {
  return (
    <div className="space-y-3">
      <UploadButton
        accept="application/pdf"
        label="PDF hochladen"
        onUploaded={(url) => onChange([...downloads, { label: 'Broschüre', url }])}
      />

      <ListEditor
        items={downloads}
        onChange={onChange}
        createItem={() => ({ label: '', url: '' })}
        addLabel="Leeren Eintrag hinzufügen"
        emptyHint="Keine Downloads. Hier können Sie z. B. die Geräte-Broschüre als PDF hinterlegen."
        itemLabel={(download) => download.label || 'Download'}
        renderItem={(download, _index, update) => (
          <div className="space-y-2">
            <TextInput
              value={download.label}
              onChange={(event) => update({ label: event.target.value })}
              placeholder="Bezeichnung, z. B. Broschüre Luna Ray"
            />
            {download.url ? (
              <p className="text-xs text-slate-500 truncate">{download.url}</p>
            ) : (
              <UploadButton
                accept="application/pdf"
                label="PDF wählen"
                onUploaded={(url) => update({ url })}
              />
            )}
          </div>
        )}
      />
    </div>
  )
}
