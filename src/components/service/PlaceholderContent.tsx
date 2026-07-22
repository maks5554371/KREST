'use client'

import { motion } from 'framer-motion'
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline'
import Button from '@/components/ui/Button'
import type { Service } from '@/types/service'

const knownFacts: Record<string, string[]> = {
  'geraete-verkauf': [
    'Geräte aus Mittelklasse bis Premium – für jedes Budget das Richtige',
    'Spanische und israelische Premiumgeräte (Spark, ENECA)',
    'Flexible Zahlungsmodelle: Kauf, Leasing und Finanzierung',
    'Persönliche Beratung vor der Kaufentscheidung inklusive',
    'Erfahrung mit Geräten aus Deutschland, Spanien, China, Israel und Polen',
  ],
  'mobiler-service': [
    'Unser Techniker kommt direkt zu Ihnen ins Studio',
    'Wartungen und Reparaturen werden direkt vor Ort durchgeführt',
    'Kein Transport Ihrer Geräte notwendig – minimale Ausfallzeit',
    'Flexibler Terminvereinbarung nach Ihren Bedürfnissen',
  ],
  miete: [
    'Professionelle Kosmetikgeräte zur flexiblen Miete',
    'Ideal für den Einstieg oder das Testen neuer Behandlungen',
    'Geringe Anfangsinvestition, sofort einsatzbereit',
    'Miete kann auf späteren Kauf angerechnet werden',
  ],
}

export default function PlaceholderContent({ service }: { service: Service }) {
  const facts = knownFacts[service.slug] || []

  return (
    <section className="py-16 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <p className="text-slate-600 text-lg leading-relaxed mb-10">
          {service.cardSummary}
        </p>

        {facts.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-6 font-serif text-2xl font-bold text-navy-900">
              Das erwartet Sie bei uns
            </h2>
            <ul className="space-y-4">
              {facts.map((fact, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" />
                  <span className="text-slate-600">{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-card border border-slate-200 bg-slate-50 p-8 text-center shadow-card lg:p-10">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/10 ring-1 ring-gold-500/20">
            <ClockIcon className="h-7 w-7 text-gold-600" />
          </div>
          <h3 className="mb-3 text-xl font-bold tracking-tight text-navy-900">
            Detaillierte Informationen folgen in Kürze
          </h3>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            Haben Sie Fragen zu {service.title}? Sprechen Sie uns direkt an – wir beraten Sie
            persönlich und unverbindlich.
          </p>
          <Button href="mailto:info@kret-manufaktur.de" variant="primary" size="lg">
            Jetzt anfragen
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
