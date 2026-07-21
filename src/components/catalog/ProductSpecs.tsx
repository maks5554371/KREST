import type { ProductSpecGroup } from '@/types/product'

export default function ProductSpecs({ specs }: { specs: ProductSpecGroup[] }) {
  if (specs.length === 0) return null

  return (
    <section className="py-12 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-[#0F172A] mb-6">
          Technische Daten
        </h2>

        <div className="space-y-8">
          {specs.map((group, groupIndex) => (
            <div key={`${group.group}-${groupIndex}`}>
              <h3 className="text-sm font-semibold tracking-widest text-[#B8943F] uppercase mb-3">
                {group.group}
              </h3>
              <dl className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                {group.items.map((item, itemIndex) => (
                  <div
                    key={`${item.label}-${itemIndex}`}
                    className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 px-5 py-3 border-b border-slate-100 last:border-b-0"
                  >
                    <dt className="text-sm text-slate-500 sm:w-2/5 shrink-0">
                      {item.label}
                    </dt>
                    <dd className="text-sm font-medium text-[#0F172A] sm:flex-1">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
