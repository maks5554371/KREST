'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRightIcon, PhotoIcon } from '@heroicons/react/24/outline'
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
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
    >
      <div className="relative aspect-4/3 w-full bg-slate-100">
        {product.heroImage ? (
          <Image
            src={product.heroImage}
            alt={product.heroImageAlt || product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <PhotoIcon className="w-12 h-12 text-slate-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[#0F172A]/40 to-transparent" />
        {product.categoryName && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#0F172A] text-xs font-semibold px-3 py-1 rounded-full">
            {product.categoryName}
          </span>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        {product.brand && (
          <p className="text-xs font-semibold tracking-widest text-[#B8943F] uppercase mb-2">
            {product.brand}
          </p>
        )}
        <h3 className="text-xl font-bold text-[#0F172A] mb-3">{product.name}</h3>
        <p className="text-slate-600 text-sm leading-relaxed flex-1 mb-4">
          {product.cardSummary}
        </p>

        {product.acquisition.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {product.acquisition.map((option) => (
              <span
                key={option}
                className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md"
              >
                {ACQUISITION_LABELS[option]}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-end justify-between gap-4 pt-4 border-t border-slate-100">
          <div>
            <p className="text-lg font-bold text-[#0F172A]">
              {formatPrice(product.priceCents)}
            </p>
            {product.priceNote && (
              <p className="text-xs text-slate-500 mt-0.5">{product.priceNote}</p>
            )}
          </div>
          <Link
            href={`/katalog/${product.slug}`}
            className="inline-flex items-center gap-2 text-[#B8943F] font-semibold text-sm hover:gap-3 transition-all duration-200 group whitespace-nowrap"
          >
            Details
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
