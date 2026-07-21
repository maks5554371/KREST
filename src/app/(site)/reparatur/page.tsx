import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getServiceBySlug } from '@/lib/services'
import { buildServiceSchema } from '@/lib/schema'
import JsonLd from '@/components/ui/JsonLd'
import ServiceDetailHero from '@/components/service/ServiceDetailHero'
import ServiceContent from '@/components/service/ServiceContent'
import PlaceholderContent from '@/components/service/PlaceholderContent'
import ContactCTA from '@/components/home/ContactCTA'

const SLUG = 'reparatur'

export function generateMetadata(): Metadata {
  const service = getServiceBySlug(SLUG)
  if (!service) return {}
  return {
    title: service.meta.title,
    description: service.meta.description,
    keywords: service.meta.keywords,
    openGraph: {
      title: service.meta.title,
      description: service.meta.description,
      url: `https://www.kret-manufaktur.de/${service.slug}`,
    },
  }
}

export default function ServicePage() {
  const service = getServiceBySlug(SLUG)
  if (!service) notFound()

  return (
    <>
      <JsonLd data={buildServiceSchema(service)} />
      <ServiceDetailHero service={service} />
      {service.contentReady ? (
        <ServiceContent service={service} />
      ) : (
        <PlaceholderContent service={service} />
      )}
      <ContactCTA />
    </>
  )
}
