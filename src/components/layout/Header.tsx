'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const navLinks = [
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
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-black text-[#0F172A] tracking-tight shrink-0">
          KRET<span className="text-[#B8943F]">-Manufaktur</span>
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-700 hover:text-[#B8943F] transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="mailto:info@kret-manufaktur.de"
            className="bg-[#0F172A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1e293b] transition-colors whitespace-nowrap"
          >
            Kontakt
          </Link>
        </div>

        <button
          className="lg:hidden p-2"
          aria-label={mobileOpen ? 'Menü schließen' : 'Menü öffnen'}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <XMarkIcon className="w-6 h-6 text-[#0F172A]" />
          ) : (
            <Bars3Icon className="w-6 h-6 text-[#0F172A]" />
          )}
        </button>
      </nav>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2 px-3 text-slate-700 hover:text-[#B8943F] hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="mailto:info@kret-manufaktur.de"
            onClick={() => setMobileOpen(false)}
            className="block mt-2 py-2 px-3 bg-[#0F172A] text-white rounded-lg text-sm font-medium text-center"
          >
            Kontakt
          </Link>
        </div>
      )}
    </header>
  )
}
