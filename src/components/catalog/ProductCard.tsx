'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { formatPrice } from '@/lib/format'
import { ACQUISITION_LABELS, type ProductWithCategory } from '@/types/product'

// Gleiche Bewegung wie bei den Leistungs-Karten, damit sich der Katalog
// nicht wie ein Fremdkörper anfühlt (vgl. components/service/ServiceCard).
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const, delay: Math.min(i, 6) * 0.1 },
  }),
}

export default function ProductCard({
  product,
  index,
}: {
  product: ProductWithCategory
  index: number
}) {
  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="group relative flex flex-col overflow-hidden rounded-card border border-slate-200/70 bg-white shadow-card transition-[box-shadow,border-color] duration-300 hover:border-gold-500/60 hover:shadow-card-hover"
    >
      {/* Goldene Haarlinie, die beim Hover von links einläuft */}
      <span className="pointer-events-none absolute inset-x-0 top-0 z-20 h-0.5 origin-left scale-x-0 bg-linear-to-r from-gold-500 to-gold-300 transition-transform duration-300 group-hover:scale-x-100" />

      <div className="relative aspect-4/3 w-full overflow-hidden bg-navy-900">
        {product.heroImage ? (
          <Image
            src={product.heroImage}
            alt={product.heroImageAlt || product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-navy-800 to-navy-950">
            <span className="select-none text-5xl font-black tracking-tight text-white/10">
              KRET
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-navy-950/55 via-navy-950/5 to-transparent" />
        {product.categoryName && (
          <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-navy-950/55 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
            {product.categoryName}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        {product.brand && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-gold-600">
            {product.brand}
          </p>
        )}
        <h3 className="mb-2.5 text-xl font-bold tracking-tight text-navy-900">{product.name}</h3>
        <p className="mb-5 flex-1 text-sm leading-relaxed text-slate-600">{product.cardSummary}</p>

        {product.acquisition.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-1.5">
            {product.acquisition.map((option) => (
              <span
                key={option}
                className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
              >
                {ACQUISITION_LABELS[option]}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-end justify-between gap-4 border-t border-slate-100 pt-5">
          <div>
            <p className="text-lg font-bold tracking-tight text-navy-900">
              {formatPrice(product.priceCents)}
            </p>
            {product.priceNote && (
              <p className="mt-0.5 text-xs text-slate-500">{product.priceNote}</p>
            )}
          </div>
          {/* Der Link spannt sich per ::after über die ganze Karte – die
              gesamte Kachel ist klickbar, „Details“ bleibt die sichtbare Aktion. */}
          <Link
            href={`/katalog/${product.slug}`}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold text-gold-600 transition-colors after:absolute after:inset-0 after:content-[''] hover:text-gold-700 group-hover:bg-gold-500/10"
          >
            Details
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
