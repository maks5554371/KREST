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
      <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-card border border-slate-200 bg-white p-5 shadow-elevated sm:flex-row sm:items-center sm:p-6">
        <p className="flex-1 text-sm leading-relaxed text-slate-600">
          Diese Website verwendet ausschliesslich technisch notwendige Cookies. Es findet
          kein Tracking und keine Analyse Ihres Verhaltens statt. Mehr dazu in unserer{' '}
          <Link
            href="/datenschutz"
            className="font-medium text-gold-600 underline underline-offset-2 hover:text-gold-700"
          >
            Datenschutzerklärung
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={acknowledge}
          className="shrink-0 rounded-lg bg-navy-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
        >
          Verstanden
        </button>
      </div>
    </div>
  )
}
