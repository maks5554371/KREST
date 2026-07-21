import Link from 'next/link'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { logoutAction } from '@/app/(admin)/admin/actions'

/**
 * Oberfläche der angemeldeten Verwaltung. Die Route-Gruppe `(panel)` fasst alle
 * geschützten Seiten zusammen, ohne die URL zu verändern (/admin, /admin/produkte …).
 * Die Login-Seite liegt ausserhalb und bekommt diese Navigation nicht.
 */
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#0F172A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="font-black tracking-tight whitespace-nowrap">
              KRET<span className="text-[#B8943F]">-Verwaltung</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-6 text-sm">
              <Link href="/admin" className="text-slate-300 hover:text-white transition-colors">
                Produkte
              </Link>
              <Link
                href="/admin/kategorien"
                className="text-slate-300 hover:text-white transition-colors"
              >
                Kategorien
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/katalog"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors"
            >
              Katalog ansehen
              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-sm text-slate-300 hover:text-white transition-colors"
              >
                Abmelden
              </button>
            </form>
          </div>
        </div>

        <nav className="sm:hidden border-t border-white/10 px-4 py-2 flex gap-4 text-sm">
          <Link href="/admin" className="text-slate-300">
            Produkte
          </Link>
          <Link href="/admin/kategorien" className="text-slate-300">
            Kategorien
          </Link>
        </nav>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
