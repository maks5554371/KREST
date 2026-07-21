import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CookieNotice from '@/components/layout/CookieNotice'
import JsonLd from '@/components/ui/JsonLd'
import { localBusinessSchema } from '@/lib/schema'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={localBusinessSchema} />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CookieNotice />
    </>
  )
}
