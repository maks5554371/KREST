'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const navLinks = [
  { href: '/katalog', label: 'Katalog' },
  { href: '/wartung', label: 'Wartung' },
  { href: '/reparatur', label: 'Reparatur' },
  { href: '/geraete-verkauf', label: 'Geräte-Verkauf' },
  { href: '/mobiler-service', label: 'Mobiler Service' },
  { href: '/miete', label: 'Miete' },
  { href: '/beratung', label: 'Beratung' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0 text-xl font-black tracking-tight text-navy-900">
          KRET<span className="text-gold-500">-Manufaktur</span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-sm font-medium text-slate-700 transition-colors hover:text-gold-600"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="mailto:info@kret-manufaktur.de"
            className="whitespace-nowrap rounded-lg bg-navy-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-navy-800 hover:shadow-md"
          >
            Kontakt
          </Link>
        </div>

        <button
          className="p-2 lg:hidden"
          aria-label={mobileOpen ? 'Menü schließen' : 'Menü öffnen'}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <XMarkIcon className="h-6 w-6 text-navy-900" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-navy-900" />
          )}
        </button>
      </nav>

      {mobileOpen && (
        <div className="space-y-1 border-t border-slate-100 bg-white px-4 py-4 lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-gold-600"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="mailto:info@kret-manufaktur.de"
            onClick={() => setMobileOpen(false)}
            className="mt-2 block rounded-lg bg-navy-900 px-3 py-2 text-center text-sm font-medium text-white"
          >
            Kontakt
          </Link>
        </div>
      )}
    </header>
  )
}
