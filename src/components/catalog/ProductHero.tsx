'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import type { ProductWithCategory } from '@/types/product'

export default function ProductHero({ product }: { product: ProductWithCategory }) {
  return (
    <section className="relative h-64 overflow-hidden bg-navy-900 lg:h-80">
      {product.heroImage && (
        <Image
          src={product.heroImage}
          alt={product.heroImageAlt || product.name}
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-navy-950/90 via-navy-950/65 to-navy-950/40" />

      <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Zurück zum Katalog
          </Link>
          {product.brand && (
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-gold-400">
              {product.brand}
            </p>
          )}
          <h1 className="text-balance font-serif text-3xl font-bold text-white lg:text-5xl xl:text-6xl">
            {product.headline}
          </h1>
        </motion.div>
      </div>
    </section>
  )
}
