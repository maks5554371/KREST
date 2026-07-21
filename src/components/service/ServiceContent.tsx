'use client'

import { motion } from 'framer-motion'
import ContentBlocks from '@/components/content/ContentBlocks'
import type { Service } from '@/types/service'

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
        <ContentBlocks blocks={service.fullContent} />
      </motion.div>
    </section>
  )
}
