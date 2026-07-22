import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/ui/JsonLd'
import ContentBlocks from '@/components/content/ContentBlocks'
import Breadcrumb from '@/components/catalog/Breadcrumb'
import ProductGallery from '@/components/catalog/ProductGallery'
import ProductPurchasePanel from '@/components/catalog/ProductPurchasePanel'
import ProductSpecs from '@/components/catalog/ProductSpecs'
import ProductFaq from '@/components/catalog/ProductFaq'
import ProductDownloads from '@/components/catalog/ProductDownloads'
import ProductStickyCTA from '@/components/catalog/ProductStickyCTA'
import RelatedProducts from '@/components/catalog/RelatedProducts'
import ContactCTA from '@/components/home/ContactCTA'
import { getPublishedProductBySlug } from '@/lib/db/products'
import { buildFaqSchema, buildProductSchema } from '@/lib/schema'
import type { GalleryImage } from '@/types/product'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getPublishedProductBySlug(slug)
  if (!product) return {}

  const title = product.metaTitle || product.name
  const description = product.metaDescription || product.cardSummary

  return {
    title,
    description,
    ...(product.metaKeywords && { keywords: product.metaKeywords }),
    openGraph: {
      title,
      description,
      url: `https://www.kret-manufaktur.de/katalog/${product.slug}`,
      ...(product.heroImage && { images: [{ url: product.heroImage }] }),
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getPublishedProductBySlug(slug)
  if (!product) notFound()

  // Hero-Bild + Galerie zu einem Bildersatz zusammenführen (ohne Dubletten),
  // damit dasselbe Foto nicht zweimal erscheint.
  const galleryImages: GalleryImage[] = []
  const seen = new Set<string>()
  const push = (img: GalleryImage | null) => {
    if (img?.url && !seen.has(img.url)) {
      seen.add(img.url)
      galleryImages.push(img)
    }
  }
  if (product.heroImage) push({ url: product.heroImage, alt: product.heroImageAlt || product.name })
  product.gallery.forEach(push)

  return (
    <>
      <JsonLd data={buildProductSchema(product)} />
      {product.faq.length > 0 && <JsonLd data={buildFaqSchema(product.faq)} />}

      <div className="border-b border-slate-100">
        <Breadcrumb
          items={[
            { label: 'Katalog', href: '/katalog' },
            ...(product.categoryName && product.categorySlug
              ? [{ label: product.categoryName, href: `/katalog?kategorie=${product.categorySlug}` }]
              : []),
            { label: product.name },
          ]}
        />
      </div>

      {/* Kopfzeile: Galerie links, Kaufpanel rechts */}
      <section className="bg-white py-8 pb-28 lg:py-12 lg:pb-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-12 gap-y-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <ProductGallery images={galleryImages} />
          <ProductPurchasePanel product={product} />
        </div>
      </section>

      {product.blocks.length > 0 && (
        <section className="border-t border-slate-100 bg-white py-14">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <ContentBlocks blocks={product.blocks} />
          </div>
        </section>
      )}

      <ProductSpecs specs={product.specs} />
      <ProductFaq items={product.faq} />
      <ProductDownloads downloads={product.downloads} />

      <RelatedProducts categorySlug={product.categorySlug} currentSlug={product.slug} />

      <ContactCTA />

      <ProductStickyCTA product={product} />
    </>
  )
}
