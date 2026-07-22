import { ArrowDownTrayIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import type { ProductDownload } from '@/types/product'

export default function ProductDownloads({ downloads }: { downloads: ProductDownload[] }) {
  if (downloads.length === 0) return null

  return (
    <section className="py-12 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 font-serif text-2xl font-bold text-navy-900 lg:text-3xl">
          Downloads
        </h2>

        <ul className="space-y-3">
          {downloads.map((download, index) => (
            <li key={`${download.url}-${index}`}>
              <a
                href={download.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-gold-500/60 hover:shadow-card-hover"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-500/10 ring-1 ring-gold-500/15 transition-colors group-hover:bg-gold-500/15">
                  <DocumentTextIcon className="h-6 w-6 text-gold-600" />
                </span>
                <span className="flex-1 font-medium text-navy-900">{download.label}</span>
                <ArrowDownTrayIcon className="h-5 w-5 shrink-0 text-slate-400 transition-colors group-hover:text-gold-600" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
