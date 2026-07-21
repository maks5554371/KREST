import { ChevronDownIcon } from '@heroicons/react/24/outline'
import type { ProductFaqItem } from '@/types/product'

/** Bewusst mit <details>: aufklappbar ohne JavaScript und ohne Hydration-Kosten. */
export default function ProductFaq({ items }: { items: ProductFaqItem[] }) {
  if (items.length === 0) return null

  return (
    <section className="py-12 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-[#0F172A] mb-6">
          Häufige Fragen
        </h2>

        <div className="space-y-3">
          {items.map((item, index) => (
            <details
              key={`${item.question}-${index}`}
              className="group bg-slate-50 rounded-xl border border-slate-200 overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none font-semibold text-[#0F172A] hover:bg-slate-100 transition-colors">
                {item.question}
                <ChevronDownIcon className="w-5 h-5 text-[#B8943F] shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-5 pb-4 text-slate-600 leading-relaxed whitespace-pre-line">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
