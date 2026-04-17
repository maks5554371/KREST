import type { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import ServicesGrid from '@/components/home/ServicesGrid'
import KretValues from '@/components/home/KretValues'
import ContactCTA from '@/components/home/ContactCTA'

export const metadata: Metadata = {
  title: 'KRET-Manufaktur – Kosmetikgeräte Wartung, Reparatur & Verkauf',
  description:
    'Professioneller Partner für Kosmetikgeräte in Deutschland. Wartung, Reparatur, Verkauf, Leasing und persönliche Beratung seit über 15 Jahren. Jetzt kostenlose Erstberatung sichern.',
  openGraph: {
    title: 'KRET-Manufaktur – Ihr Experte für Kosmetikgeräte',
    description:
      'Wartung, Reparatur und persönliche Beratung für professionelle Kosmetikgeräte. Seit über 15 Jahren Ihr zuverlässiger Partner.',
    url: 'https://www.kret-manufaktur.de',
    images: [
      {
        url: '/images/nikita-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Nikita von KRET-Manufaktur mit professionellen Kosmetikgeräten',
      },
    ],
  },
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesGrid />
      <KretValues />
      <ContactCTA />
    </>
  )
}
