import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CookieConsent from '@/components/layout/CookieConsent'
import MotionProvider from '@/components/layout/MotionProvider'
import JsonLd from '@/components/ui/JsonLd'
import { localBusinessSchema } from '@/lib/schema'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      <JsonLd data={localBusinessSchema} />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CookieConsent />
    </MotionProvider>
  )
}
