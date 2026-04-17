import { services } from '@/lib/services'
import ServiceCard from '@/components/service/ServiceCard'

export default function ServicesGrid() {
  return (
    <section id="leistungen" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold tracking-widest text-[#B8943F] uppercase mb-3">
            Was wir anbieten
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-4">
            Unsere Leistungen
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
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
