import type { ProductSpecGroup } from '@/types/product'

export default function ProductSpecs({ specs }: { specs: ProductSpecGroup[] }) {
  if (specs.length === 0) return null

  return (
    <section className="border-t border-slate-100 bg-slate-50 py-14 lg:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 font-serif text-2xl font-bold text-navy-900 lg:text-3xl">
          Technische Daten
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {specs.map((group, groupIndex) => (
            <div
              key={`${group.group}-${groupIndex}`}
              className="overflow-hidden rounded-card border border-slate-200 bg-white shadow-card"
            >
              <h3 className="border-b border-slate-100 bg-slate-50/60 px-5 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-gold-600">
                {group.group}
              </h3>
              <dl>
                {group.items.map((item, itemIndex) => (
                  <div
                    key={`${item.label}-${itemIndex}`}
                    className="flex flex-col gap-1 border-b border-slate-100 px-5 py-3.5 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-4"
                  >
                    <dt className="shrink-0 text-sm text-slate-500 sm:w-2/5">{item.label}</dt>
                    <dd className="text-sm font-medium text-navy-900 sm:flex-1">{item.value}</dd>
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
