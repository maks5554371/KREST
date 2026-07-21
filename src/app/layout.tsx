import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.kret-manufaktur.de'),
  title: {
    template: '%s | KRET-Manufaktur',
    default: 'KRET-Manufaktur – Kosmetikgeräte Wartung, Reparatur & Verkauf',
  },
  description:
    'Professioneller Partner für Kosmetikgeräte in Deutschland. Wartung, Reparatur, Verkauf, Leasing und persönliche Beratung seit über 15 Jahren.',
  keywords:
    'Kosmetikgeräte Wartung, Kosmetikgeräte Reparatur, Laser Reparatur, Kosmetikgerät kaufen, KRET-Manufaktur',
  openGraph: {
    locale: 'de_DE',
    type: 'website',
    siteName: 'KRET-Manufaktur',
  },
  robots: {
    index: true,
    follow: true,
  },
}

/**
 * Nur die Dokumenthülle. Header/Footer hängen an der Route-Gruppe `(site)`,
 * damit die Administration eine eigene Oberfläche bekommt.
 *
 * `data-scroll-behavior="smooth"` ist seit Next.js 16 nötig, damit das globale
 * `scroll-behavior: smooth` aus globals.css bei Navigationen nicht stört.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="de"
      data-scroll-behavior="smooth"
      className={`${inter.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
