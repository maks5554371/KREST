'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import type { Service } from '@/types/service'

export default function ServiceDetailHero({ service }: { service: Service }) {
  return (
    <section className="relative h-64 overflow-hidden bg-navy-900 lg:h-80">
      <Image
        src={service.image}
        alt={service.imageAlt}
        fill
        sizes="100vw"
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-linear-to-t from-navy-950/90 via-navy-950/65 to-navy-950/40" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/#leistungen"
            className="mb-4 inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-white"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Alle Leistungen
          </Link>
          <h1 className="text-balance font-serif text-3xl font-bold text-white lg:text-5xl xl:text-6xl">
            {service.headline}
          </h1>
        </motion.div>
      </div>
    </section>
  )
}
