'use client'

import { openCookieSettings } from '@/lib/consent'

/**
 * Öffnet den Consent-Dialog nachträglich. Muss dauerhaft erreichbar sein: Der
 * Widerruf der Einwilligung muss nach Art. 7 Abs. 3 DSGVO so einfach sein wie
 * ihre Erteilung.
 */
export default function CookieSettingsButton({ className = '' }: { className?: string }) {
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      Cookie-Einstellungen
    </button>
  )
}
