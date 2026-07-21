import type { Service } from '@/types/service'
import type { ProductFaqItem, ProductWithCategory } from '@/types/product'

export const SITE_URL = 'https://www.kret-manufaktur.de'

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
    url: `${SITE_URL}/${service.slug}`,
    provider: {
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL}/#business`,
    },
  }
}

export function buildProductSchema(product: ProductWithCategory) {
  const url = `${SITE_URL}/katalog/${product.slug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.metaDescription || product.cardSummary,
    url,
    ...(product.brand && { brand: { '@type': 'Brand', name: product.brand } }),
    ...(product.categoryName && { category: product.categoryName }),
    ...(product.heroImage && { image: `${SITE_URL}${product.heroImage}` }),
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'EUR',
      // Ohne gepflegten Preis gilt „auf Anfrage“ – dann keine Preisangabe,
      // sonst meldet die Rich-Results-Prüfung einen Widerspruch.
      ...(product.priceCents !== null && { price: (product.priceCents / 100).toFixed(2) }),
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'LocalBusiness',
        '@id': `${SITE_URL}/#business`,
      },
    },
  }
}

export function buildFaqSchema(items: ProductFaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}
