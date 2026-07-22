import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/20/solid'

type Crumb = { label: string; href?: string }

/** Schlichte Breadcrumb-Navigation für die Produktseite. */
export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRightIcon className="h-4 w-4 text-slate-300" aria-hidden />}
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-gold-600">
                {item.label}
              </Link>
            ) : (
              <span className="max-w-[16rem] truncate font-medium text-navy-900" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
