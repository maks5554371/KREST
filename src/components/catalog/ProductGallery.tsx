'use client'

import { useState } from 'react'
import Image from 'next/image'
import { PhotoIcon } from '@heroicons/react/24/outline'
import type { GalleryImage } from '@/types/product'

/**
 * Linke Spalte der Produktseite: großes Hauptbild + Thumbnail-Leiste.
 * Kein eigener Section-Wrapper – wird direkt in die zweispaltige Kopfzeile
 * der Detailseite gesetzt.
 */
export default function ProductGallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState(0)

  if (images.length === 0) {
    return (
      <div className="flex aspect-4/3 w-full items-center justify-center rounded-card border border-slate-200 bg-linear-to-br from-navy-800 to-navy-950">
        <span className="select-none text-6xl font-black tracking-tight text-white/10">KRET</span>
      </div>
    )
  }

  const current = images[Math.min(active, images.length - 1)]

  return (
    <div className="lg:sticky lg:top-24">
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-card border border-slate-200 bg-slate-100 shadow-card">
        <Image
          src={current.url}
          alt={current.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 640px"
          className="object-cover"
          priority
        />
        {images.length > 1 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-navy-950/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
            {Math.min(active, images.length - 1) + 1} / {images.length}
          </span>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {images.map((image, i) => (
            <button
              key={`${image.url}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Bild ${i + 1} anzeigen`}
              aria-current={i === active}
              className={`relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-slate-100 transition-all ${
                i === active
                  ? 'ring-2 ring-gold-500 ring-offset-2'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              {image.url ? (
                <Image src={image.url} alt="" fill sizes="120px" className="object-cover" />
              ) : (
                <span className="flex h-full items-center justify-center">
                  <PhotoIcon className="h-5 w-5 text-slate-300" />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
