import { ChevronDownIcon } from '@heroicons/react/24/outline'
import type { ProductFaqItem } from '@/types/product'

/** Bewusst mit <details>: aufklappbar ohne JavaScript und ohne Hydration-Kosten. */
export default function ProductFaq({ items }: { items: ProductFaqItem[] }) {
  if (items.length === 0) return null

  return (
    <section className="py-12 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 font-serif text-2xl font-bold text-navy-900 lg:text-3xl">
          Häufige Fragen
        </h2>

        <div className="space-y-3">
          {items.map((item, index) => (
            <details
              key={`${item.question}-${index}`}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 transition-colors open:border-gold-500/40 open:bg-white open:shadow-card"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-navy-900 transition-colors hover:bg-slate-100 group-open:hover:bg-transparent">
                {item.question}
                <ChevronDownIcon className="h-5 w-5 shrink-0 text-gold-500 transition-transform group-open:rotate-180" />
              </summary>
              <div className="whitespace-pre-line px-5 pb-4 leading-relaxed text-slate-600">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
