import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import JsonLd from '@/components/ui/JsonLd'
import Button from '@/components/ui/Button'
import ContentBlocks from '@/components/content/ContentBlocks'
import ProductHero from '@/components/catalog/ProductHero'
import ProductGallery from '@/components/catalog/ProductGallery'
import ProductSpecs from '@/components/catalog/ProductSpecs'
import ProductFaq from '@/components/catalog/ProductFaq'
import ProductDownloads from '@/components/catalog/ProductDownloads'
import ContactCTA from '@/components/home/ContactCTA'
import { getPublishedProductBySlug } from '@/lib/db/products'
import { buildFaqSchema, buildProductSchema } from '@/lib/schema'
import { formatPrice } from '@/lib/format'
import { ACQUISITION_LABELS } from '@/types/product'

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

  return (
    <>
      <JsonLd data={buildProductSchema(product)} />
      {product.faq.length > 0 && <JsonLd data={buildFaqSchema(product.faq)} />}

      <ProductHero product={product} />

      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {product.categoryName && product.categorySlug && (
            <Link
              href={`/katalog?kategorie=${product.categorySlug}`}
              className="inline-block text-sm font-medium text-[#B8943F] hover:text-[#9d7d34] mb-4"
            >
              {product.categoryName}
            </Link>
          )}

          <p className="text-slate-600 text-lg leading-relaxed mb-8">
            {product.cardSummary}
          </p>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
              <div>
                <p className="text-3xl font-black text-[#0F172A]">
                  {formatPrice(product.priceCents)}
                </p>
                {product.priceNote && (
                  <p className="text-sm text-slate-500 mt-1">{product.priceNote}</p>
                )}
              </div>
              <Button href="mailto:info@kret-manufaktur.de" variant="primary" size="lg">
                Jetzt anfragen
              </Button>
            </div>

            {product.acquisition.length > 0 && (
              <div className="pt-6 border-t border-slate-200">
                <p className="text-sm font-semibold text-[#0F172A] mb-3">
                  Verfügbar als:
                </p>
                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                  {product.acquisition.map((option) => (
                    <li key={option} className="flex items-center gap-2">
                      <CheckCircleIcon className="w-5 h-5 text-[#B8943F] shrink-0" />
                      <span className="text-slate-600 text-sm">
                        {ACQUISITION_LABELS[option]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      <ProductGallery images={product.gallery} />

      {product.blocks.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <ContentBlocks blocks={product.blocks} />
          </div>
        </section>
      )}

      <ProductSpecs specs={product.specs} />
      <ProductFaq items={product.faq} />
      <ProductDownloads downloads={product.downloads} />

      <ContactCTA />
    </>
  )
}
