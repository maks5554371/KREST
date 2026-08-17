import Link from 'next/link'
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'
import CookieSettingsButton from '@/components/layout/CookieSettingsButton'

const serviceLinks = [
  { href: '/katalog', label: 'Geräte-Katalog' },
  { href: '/wartung', label: 'Wartung' },
  { href: '/reparatur', label: 'Reparatur' },
  { href: '/geraete-verkauf', label: 'Geräte-Verkauf / Leasing' },
  { href: '/mobiler-service', label: 'Mobiler Service' },
  { href: '/miete', label: 'Miete' },
  { href: '/beratung', label: 'Beratung' },
]

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white">
      {/* Feine goldene Akzentlinie als Übergang von der Seite zum Footer. */}
      <div
        aria-hidden
        className="h-px bg-linear-to-r from-transparent via-gold-500/40 to-transparent"
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <p className="mb-3 text-xl font-black tracking-tight">
              KRET<span className="text-gold-500">-Manufaktur</span>
            </p>
            <p className="mb-4 text-sm leading-relaxed text-slate-400">
              Ihr professioneller Partner für Kosmetikgeräte seit über 15 Jahren.
              Kundenorientiert. Rentabel. Effizient. Transparent.
            </p>
            <div className="space-y-2">
              <a
                href="mailto:info@kret-manufaktur.de"
                className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-gold-400"
              >
                <EnvelopeIcon className="h-4 w-4" />
                info@kret-manufaktur.de
              </a>
              <a
                href="tel:[TELEFON]"
                className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-gold-400"
              >
                <PhoneIcon className="h-4 w-4" />
                [TELEFON]
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-slate-200">
              Leistungen
            </h4>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-gold-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-slate-200">
              Rechtliches
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/impressum"
                  className="text-sm text-slate-400 transition-colors hover:text-gold-400"
                >
                  Impressum
                </Link>
              </li>
              <li>
                <Link
                  href="/datenschutz"
                  className="text-sm text-slate-400 transition-colors hover:text-gold-400"
                >
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link
                  href="/agb"
                  className="text-sm text-slate-400 transition-colors hover:text-gold-400"
                >
                  AGB
                </Link>
              </li>
              <li>
                <CookieSettingsButton className="text-left text-sm text-slate-400 transition-colors hover:text-gold-400" />
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} KRET-Manufaktur. Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  )
}
