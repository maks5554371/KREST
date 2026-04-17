'use client'

import { motion } from 'framer-motion'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import Button from '@/components/ui/Button'
import type { Service, ServiceSection } from '@/types/service'

function renderSection(section: ServiceSection, idx: number) {
  switch (section.type) {
    case 'h2':
      return (
        <h2
          key={idx}
          className="text-2xl lg:text-3xl font-bold text-[#0F172A] mt-10 mb-4 first:mt-0"
        >
          {section.content as string}
        </h2>
      )
    case 'h3':
      return (
        <h3 key={idx} className="text-xl font-bold text-[#0F172A] mt-8 mb-3">
          {section.content as string}
        </h3>
      )
    case 'paragraph':
      return (
        <p key={idx} className="text-slate-600 leading-relaxed mb-4">
          {section.content as string}
        </p>
      )
    case 'bulletList':
      return (
        <ul key={idx} className="space-y-3 mb-6">
          {(section.content as string[]).map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircleIcon className="w-5 h-5 text-[#B8943F] mt-0.5 shrink-0" />
              <span className="text-slate-600">{item}</span>
            </li>
          ))}
        </ul>
      )
    case 'cta':
      return (
        <div key={idx} className="mt-10 pt-8 border-t border-slate-200">
          <Button href="mailto:info@kret-manufaktur.de" variant="primary" size="lg">
            {section.content as string}
          </Button>
        </div>
      )
    default:
      return null
  }
}

export default function ServiceContent({ service }: { service: Service }) {
  if (!service.fullContent) return null

  return (
    <section className="py-16 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {service.fullContent.map((section, idx) => renderSection(section, idx))}
      </motion.div>
    </section>
  )
}
