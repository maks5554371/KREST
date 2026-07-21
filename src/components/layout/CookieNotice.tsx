'use client'

import { useSyncExternalStore } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'kret-cookie-notice-v1'

const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  // Zweiter Tab bestätigt? Dann hier ebenfalls ausblenden.
  window.addEventListener('storage', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', listener)
  }
}

function isAcknowledged(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'ack'
  } catch {
    // Privater Modus o. Ä.: als bestätigt behandeln, sonst erschiene der
    // Hinweis bei jedem Seitenaufruf erneut.
    return true
  }
}

/** Auf dem Server gilt „bestätigt“ – so wird serverseitig nichts gerendert. */
function serverSnapshot(): boolean {
  return true
}

function acknowledge(): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, 'ack')
  } catch {
    // Nicht speicherbar – der Hinweis verschwindet trotzdem für diese Sitzung.
  }
  for (const listener of listeners) listener()
}

/**
 * Bewusst nur ein Hinweis, keine Consent-Verwaltung: Die Website lädt keine
 * Analyse- oder Marketing-Skripte und setzt ausser dem Admin-Session-Cookie
 * keine Cookies. Damit sind nach § 25 Abs. 2 TTDSG technisch notwendige Cookies
 * einwilligungsfrei – ein Hinweis genügt.
 *
 * Die Bestätigung liegt im localStorage, damit der Hinweis selbst kein Cookie
 * setzt. Gelesen wird über `useSyncExternalStore`: Das ist die vorgesehene Art,
 * einen externen Speicher anzubinden, ohne beim ersten Rendern einen
 * Hydration-Mismatch zu erzeugen.
 *
 * Sobald Tracking dazukommt, muss das hier durch echte Consent-Kategorien
 * ersetzt und die Skripte müssen daran gekoppelt werden.
 */
export default function CookieNotice() {
  const acknowledged = useSyncExternalStore(subscribe, isAcknowledged, serverSnapshot)

  if (acknowledged) return null

  return (
    <div
      role="region"
      aria-label="Hinweis zu Cookies"
      className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6"
    >
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 shadow-xl rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-sm text-slate-600 leading-relaxed flex-1">
          Diese Website verwendet ausschliesslich technisch notwendige Cookies. Es findet
          kein Tracking und keine Analyse Ihres Verhaltens statt. Mehr dazu in unserer{' '}
          <Link
            href="/datenschutz"
            className="text-[#B8943F] font-medium underline underline-offset-2 hover:text-[#9d7d34]"
          >
            Datenschutzerklärung
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={acknowledge}
          className="shrink-0 bg-[#0F172A] text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#1e293b] transition-colors"
        >
          Verstanden
        </button>
      </div>
    </div>
  )
}
