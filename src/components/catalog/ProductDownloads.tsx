import { ArrowDownTrayIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import type { ProductDownload } from '@/types/product'

export default function ProductDownloads({ downloads }: { downloads: ProductDownload[] }) {
  if (downloads.length === 0) return null

  return (
    <section className="py-12 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-[#0F172A] mb-6">Downloads</h2>

        <ul className="space-y-3">
          {downloads.map((download, index) => (
            <li key={`${download.url}-${index}`}>
              <a
                href={download.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white rounded-xl border border-slate-200 px-5 py-4 hover:border-[#B8943F] hover:shadow-md transition-all group"
              >
                <DocumentTextIcon className="w-6 h-6 text-[#B8943F] shrink-0" />
                <span className="flex-1 font-medium text-[#0F172A]">{download.label}</span>
                <ArrowDownTrayIcon className="w-5 h-5 text-slate-400 group-hover:text-[#B8943F] transition-colors shrink-0" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
