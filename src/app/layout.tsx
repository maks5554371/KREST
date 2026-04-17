import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import JsonLd from '@/components/ui/JsonLd'
import { localBusinessSchema } from '@/lib/schema'
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <JsonLd data={localBusinessSchema} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
