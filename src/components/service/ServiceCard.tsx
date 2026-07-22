'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import type { Service } from '@/types/service'

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const, delay: i * 0.1 },
  }),
}

export default function ServiceCard({ service, index }: { service: Service; index: number }) {
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
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-navy-950/55 via-navy-950/5 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-2.5 text-xl font-bold tracking-tight text-navy-900">{service.title}</h3>
        <p className="mb-6 flex-1 text-sm leading-relaxed text-slate-600">{service.cardSummary}</p>

        {/* Der Link spannt sich per ::after über die ganze Karte. */}
        <Link
          href={`/${service.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-600 transition-colors after:absolute after:inset-0 after:content-[''] hover:text-gold-700"
        >
          Mehr erfahren
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </motion.article>
  )
}
