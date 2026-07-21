'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { GalleryImage } from '@/types/product'

export default function ProductGallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState(0)

  if (images.length === 0) return null

  // Falls ein Bild gelöscht wurde, während der Index noch darauf zeigt.
  const current = images[Math.min(active, images.length - 1)]

  return (
    <section className="py-12 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-[#0F172A] mb-6">Bildergalerie</h2>

        <div className="relative aspect-16/9 w-full rounded-xl overflow-hidden bg-slate-100 mb-4">
          <Image
            src={current.url}
            alt={current.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-contain"
          />
        </div>

        {images.length > 1 && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {images.map((image, i) => (
              <button
                key={`${image.url}-${i}`}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Bild ${i + 1} anzeigen`}
                aria-current={i === active}
                className={`relative aspect-square rounded-lg overflow-hidden bg-slate-100 transition-all ${
                  i === active
                    ? 'ring-2 ring-[#B8943F] ring-offset-2'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={image.url}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
