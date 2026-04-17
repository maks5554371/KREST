import type { Service } from '@/types/service'

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://www.kret-manufaktur.de/#business',
  name: 'KRET-Manufaktur',
  description:
    'Professioneller Service für Kosmetikgeräte: Wartung, Reparatur, Verkauf, Leasing und persönliche Beratung seit 15 Jahren.',
  url: 'https://www.kret-manufaktur.de',
  telephone: '[TELEFON]',
  email: '[EMAIL]',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '[STRASSE]',
    addressLocality: '[STADT]',
    postalCode: '[PLZ]',
    addressCountry: 'DE',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Deutschland',
  },
  priceRange: '€€',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Kosmetikgeräte-Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Kosmetikgerät-Wartung' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Kosmetikgerät-Reparatur' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Geräte-Verkauf und Leasing' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Mobiler Reparaturservice' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Gerätemiete' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Persönliche Beratung' } },
    ],
  },
}

export function buildServiceSchema(service: Service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.headline,
    description: service.meta.description,
    url: `https://www.kret-manufaktur.de/${service.slug}`,
    provider: {
      '@type': 'LocalBusiness',
      '@id': 'https://www.kret-manufaktur.de/#business',
    },
  }
}
