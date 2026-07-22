import Link from 'next/link'
import {
  CheckCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline'
import { formatPrice } from '@/lib/format'
import { ACQUISITION_LABELS, type ProductWithCategory } from '@/types/product'

const trust = [
  { Icon: ChatBubbleLeftRightIcon, label: 'Kostenlose & unverbindliche Beratung' },
  { Icon: ShieldCheckIcon, label: 'Persönliche Einweisung inklusive' },
  { Icon: WrenchScrewdriverIcon, label: 'Wartung & Reparatur herstellerunabhängig' },
]

export default function ProductPurchasePanel({ product }: { product: ProductWithCategory }) {
  const mailtoHref = `mailto:info@kret-manufaktur.de?subject=${encodeURIComponent(
    `Anfrage: ${product.name}`
  )}`

  return (
    <div className="lg:sticky lg:top-24">
      <div className="flex items-center gap-3">
        {product.categoryName && product.categorySlug && (
          <Link
            href={`/katalog?kategorie=${product.categorySlug}`}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-gold-500 hover:text-navy-900"
          >
            {product.categoryName}
          </Link>
        )}
        {product.brand && (
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-gold-600">
            {product.brand}
          </span>
        )}
      </div>

      <h1 className="mt-4 text-balance font-serif text-3xl font-bold text-navy-900 lg:text-4xl">
        {product.name}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-slate-600">{product.cardSummary}</p>

      <div className="mt-8 rounded-card border border-slate-200 bg-slate-50 p-6 shadow-card">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-3xl font-black tracking-tight text-navy-900">
              {formatPrice(product.priceCents)}
            </p>
            {product.priceNote && (
              <p className="mt-1 text-sm text-slate-500">{product.priceNote}</p>
            )}
          </div>
        </div>

        {product.acquisition.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-200 pt-5">
            {product.acquisition.map((option) => (
              <li key={option} className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5 shrink-0 text-gold-500" />
                <span className="text-sm font-medium text-navy-900">
                  {ACQUISITION_LABELS[option]}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href={mailtoHref}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold-500 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold-600 hover:shadow-md"
          >
            <EnvelopeIcon className="h-5 w-5" />
            Jetzt anfragen
          </Link>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="https://wa.me/4915563338348"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#25D366] px-4 py-2.5 text-sm font-semibold text-[#25D366] transition-colors hover:bg-[#25D366] hover:text-white"
            >
              <img src="/icons/whatsapp.svg" alt="" className="h-5 w-5" />
              WhatsApp
            </Link>
            <Link
              href="tel:[TELEFON]"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-navy-900 px-4 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-navy-900 hover:text-white"
            >
              <PhoneIcon className="h-5 w-5" />
              Anrufen
            </Link>
          </div>
        </div>
      </div>

      <ul className="mt-6 space-y-3">
        {trust.map(({ Icon, label }) => (
          <li key={label} className="flex items-center gap-3 text-sm text-slate-600">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-500/10 ring-1 ring-gold-500/15">
              <Icon className="h-4 w-4 text-gold-600" />
            </span>
            {label}
          </li>
        ))}
      </ul>
    </div>
  )
}
