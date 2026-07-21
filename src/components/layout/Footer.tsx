import Link from 'next/link'
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'

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
    <footer className="bg-[#0F172A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <p className="text-xl font-black mb-3">
              KRET<span className="text-[#B8943F]">-Manufaktur</span>
            </p>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Ihr professioneller Partner für Kosmetikgeräte seit über 15 Jahren.
              Kundenorientiert. Rentabel. Effizient. Transparent.
            </p>
            <div className="space-y-2">
              <a
                href="mailto:info@kret-manufaktur.de"
                className="flex items-center gap-2 text-slate-400 hover:text-[#B8943F] transition-colors text-sm"
              >
                <EnvelopeIcon className="w-4 h-4" />
                info@kret-manufaktur.de
              </a>
              <a
                href="tel:[TELEFON]"
                className="flex items-center gap-2 text-slate-400 hover:text-[#B8943F] transition-colors text-sm"
              >
                <PhoneIcon className="w-4 h-4" />
                [TELEFON]
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-slate-200 text-sm uppercase tracking-wider">
              Leistungen
            </h4>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-[#B8943F] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-slate-200 text-sm uppercase tracking-wider">
              Rechtliches
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/impressum"
                  className="text-slate-400 hover:text-[#B8943F] transition-colors text-sm"
                >
                  Impressum
                </Link>
              </li>
              <li>
                <Link
                  href="/datenschutz"
                  className="text-slate-400 hover:text-[#B8943F] transition-colors text-sm"
                >
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link
                  href="/agb"
                  className="text-slate-400 hover:text-[#B8943F] transition-colors text-sm"
                >
                  AGB
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 text-center text-slate-500 text-xs">
          © {new Date().getFullYear()} KRET-Manufaktur. Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  )
}
