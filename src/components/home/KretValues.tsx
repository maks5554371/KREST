'use client'

import { motion } from 'framer-motion'
import {
  UserGroupIcon,
  CurrencyEuroIcon,
  BoltIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'

const values = [
  {
    letter: 'K',
    title: 'Kundenorientiert',
    description:
      'Ihre Bedürfnisse stehen bei uns an erster Stelle. Jede Lösung wird individuell auf Sie abgestimmt.',
    Icon: UserGroupIcon,
  },
  {
    letter: 'R',
    title: 'Rentabel',
    description:
      'Wir denken wirtschaftlich und beraten Sie so, dass Ihre Investitionen sich langfristig auszahlen.',
    Icon: CurrencyEuroIcon,
  },
  {
    letter: 'E',
    title: 'Effizient',
    description:
      'Schnelle Diagnosen, kurze Ausfallzeiten und strukturierte Abläufe – damit Ihr Studio läuft.',
    Icon: BoltIcon,
  },
  {
    letter: 'T',
    title: 'Transparent',
    description:
      'Klare Kosten, offene Kommunikation und keine versteckten Schritte – bei uns wissen Sie stets, woran Sie sind.',
    Icon: EyeIcon,
  },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

export default function KretValues() {
  return (
    <section className="py-20 bg-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold tracking-widest text-[#B8943F] uppercase mb-3">
            Unsere Werte
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Der KRET-Standard</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Bei uns erhalten Sie Qualität nach dem KRET-Standard – vier Werte, die alles
            beschreiben, wofür wir stehen.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {values.map(({ letter, title, description, Icon }) => (
            <motion.div key={letter} variants={item} className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#B8943F] flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div className="flex items-baseline justify-center mb-2">
                <span className="text-2xl font-black text-[#B8943F]">{letter}</span>
                <span className="text-xl font-semibold text-white">
                  {title.substring(1)}
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
