import { services } from '@/lib/services'
import ServiceCard from '@/components/service/ServiceCard'

export default function ServicesGrid() {
  return (
    <section id="leistungen" className="border-y border-slate-100 bg-slate-50 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            Was wir anbieten
          </p>
          <h2 className="mb-4 text-balance font-serif text-4xl font-bold text-navy-900 lg:text-5xl">
            Unsere Leistungen
          </h2>
          <p className="mx-auto max-w-2xl text-slate-600">
            Von der Wartung bis zur persönlichen Beratung – wir begleiten Sie auf dem gesamten Weg
            mit Ihrem Kosmetikgerät.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.slug} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
