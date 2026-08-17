'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const values = [
  {
    letter: 'K',
    title: 'Kundenorientiert',
    description:
      'Ihre Bedürfnisse stehen bei uns an erster Stelle. Jede Lösung wird individuell auf Sie abgestimmt.',
    icon: '/icons/kret/kundenorientiert.png',
  },
  {
    letter: 'R',
    title: 'Rentabel',
    description:
      'Wir denken wirtschaftlich und beraten Sie so, dass Ihre Investitionen sich langfristig auszahlen.',
    icon: '/icons/kret/rentabel.png',
  },
  {
    letter: 'E',
    title: 'Effizient',
    description:
      'Schnelle Diagnosen, kurze Ausfallzeiten und strukturierte Abläufe – damit Ihr Studio läuft.',
    icon: '/icons/kret/effizient.png',
  },
  {
    letter: 'T',
    title: 'Transparent',
    description:
      'Klare Kosten, offene Kommunikation und keine versteckten Schritte – bei uns wissen Sie stets, woran Sie sind.',
    icon: '/icons/kret/transparent.png',
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
    <section className="relative overflow-hidden bg-navy-900 py-20 lg:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-navy-950/60 via-transparent to-navy-950/40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-gold-500/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-400">
            Unsere Werte
          </p>
          <h2 className="mb-4 text-balance font-serif text-4xl font-bold text-white lg:text-5xl">
            Der KRET-Standard
          </h2>
          <p className="mx-auto max-w-xl text-slate-400">
            Bei uns erhalten Sie Qualität nach dem KRET-Standard – vier Werte, die alles
            beschreiben, wofür wir stehen.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {values.map(({ letter, title, description, icon }) => (
            <motion.div
              key={letter}
              variants={item}
              className="group rounded-card border border-white/5 bg-white/[0.02] p-6 text-center transition-colors hover:border-gold-500/25 hover:bg-white/[0.04]"
            >
              {/* Dunkler Kreis, damit die goldenen Icons ihre Farbe behalten */}
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy-950/70 ring-1 ring-gold-500/25 shadow-lg shadow-navy-950/40 transition-colors group-hover:ring-gold-400/50">
                <Image
                  src={icon}
                  alt=""
                  width={96}
                  height={96}
                  className="h-9 w-9 transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="mb-2 flex items-baseline justify-center">
                <span className="text-2xl font-black text-gold-400">{letter}</span>
                <span className="text-xl font-semibold tracking-tight text-white">
                  {title.substring(1)}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
