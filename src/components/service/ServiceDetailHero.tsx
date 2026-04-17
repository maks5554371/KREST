'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import type { Service } from '@/types/service'

export default function ServiceDetailHero({ service }: { service: Service }) {
  return (
    <section className="relative h-64 lg:h-80 overflow-hidden">
      <Image
        src={service.image}
        alt={service.imageAlt}
        fill
        sizes="100vw"
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-[#0F172A]/70 bg-linear-to-t" />

      <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/#leistungen"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Alle Leistungen
          </Link>
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white">
            {service.headline}
          </h1>
        </motion.div>
      </div>
    </section>
  )
}
