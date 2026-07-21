import { listPublishedSlugs } from '@/lib/db/products'
import { SITE_URL } from '@/lib/schema'

export const dynamic = 'force-dynamic'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Produkt-URLs zur Laufzeit statt über next-sitemap: Die Katalogdaten stehen
 * erst in der Datenbank, wenn die Administration sie angelegt hat – eine zur
 * Bauzeit erzeugte Datei wäre sofort veraltet.
 *
 * In next-sitemap.config.js als `additionalSitemaps` verlinkt.
 */
export async function GET() {
  const products = await listPublishedSlugs()

  const urls = [
    `<url><loc>${SITE_URL}/katalog</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>`,
    ...products.map(
      (product) =>
        `<url><loc>${escapeXml(`${SITE_URL}/katalog/${product.slug}`)}</loc>` +
        `<lastmod>${new Date(product.updatedAt).toISOString()}</lastmod>` +
        `<changefreq>monthly</changefreq><priority>0.8</priority></url>`
    ),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  })
}
