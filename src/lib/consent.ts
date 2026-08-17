'use client'

import { useSyncExternalStore } from 'react'

/**
 * Consent-Verwaltung nach DSGVO / § 25 TDDDG.
 *
 * Zustand liegt im localStorage (nicht in einem Cookie): Der Banner selbst darf
 * ohne Einwilligung nichts speichern, was nicht technisch notwendig ist – und
 * localStorage ist hier die schlankere, gleichwertig zulässige Ablage.
 *
 * Gelesen wird über `useSyncExternalStore` (siehe `useConsent`), damit beim
 * ersten Rendern kein Hydration-Mismatch entsteht.
 *
 * Sobald ein Dienst eingebunden wird (Analytics, Maps, YouTube, Pixel …), muss
 * er hinter `useConsent().categories.<kategorie>` gehängt werden – erst laden,
 * wenn die Kategorie `true` ist.
 */

/** Version der Einwilligung. Erhöhen, sobald sich Kategorien oder Dienste
 *  ändern – gespeicherte Einwilligungen werden dadurch ungültig und der
 *  Banner erscheint erneut. */
export const CONSENT_VERSION = 1

const STORAGE_KEY = 'kret-cookie-consent'

export type OptionalCategory = 'functional' | 'statistics' | 'marketing'

export type ConsentSelection = Record<OptionalCategory, boolean>

export type StoredConsent = {
  version: number
  /** ISO-Zeitstempel – Nachweispflicht der Einwilligung nach Art. 7 Abs. 1 DSGVO. */
  timestamp: string
  categories: ConsentSelection
}

export const DENY_ALL: ConsentSelection = {
  functional: false,
  statistics: false,
  marketing: false,
}

export const ALLOW_ALL: ConsentSelection = {
  functional: true,
  statistics: true,
  marketing: true,
}

export const OPTIONAL_CATEGORIES: OptionalCategory[] = [
  'functional',
  'statistics',
  'marketing',
]

/* ------------------------------------------------------------------ Store */

const listeners = new Set<() => void>()

/** Fallback, wenn localStorage nicht verfügbar ist (privater Modus, gesperrte
 *  Speicherung). Die Auswahl gilt dann nur für die laufende Sitzung – besser,
 *  als den Banner bei jedem Seitenaufruf erneut zu zeigen. */
let memoryConsent: StoredConsent | null = null

/** Zuletzt gelesener Rohwert samt geparstem Objekt. `useSyncExternalStore`
 *  verlangt referenzstabile Snapshots – ohne Cache entstünde bei jedem Aufruf
 *  ein neues Objekt und damit eine Endlosschleife. */
let cachedRaw: string | null = null
let cachedValue: StoredConsent | null = null

/** Platzhalter für das Server-Rendering: „Einwilligung liegt vor, alles
 *  abgelehnt“. So rendert der Server keinen Banner (kein Layout-Sprung, kein
 *  Mismatch) und lädt gleichzeitig keine optionalen Dienste. */
const SERVER_SNAPSHOT: StoredConsent = {
  version: CONSENT_VERSION,
  timestamp: '',
  categories: DENY_ALL,
}

function parse(raw: string | null): StoredConsent | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Partial<StoredConsent>
    if (parsed?.version !== CONSENT_VERSION) return null
    const categories = parsed.categories
    if (!categories || typeof categories !== 'object') return null
    return {
      version: CONSENT_VERSION,
      timestamp: typeof parsed.timestamp === 'string' ? parsed.timestamp : '',
      categories: {
        functional: categories.functional === true,
        statistics: categories.statistics === true,
        marketing: categories.marketing === true,
      },
    }
  } catch {
    return null
  }
}

function readConsent(): StoredConsent | null {
  let raw: string | null
  try {
    raw = window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return memoryConsent
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw
    cachedValue = parse(raw)
  }
  return cachedValue ?? memoryConsent
}

function emit(): void {
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  // Auswahl in einem zweiten Tab getroffen? Dann hier ebenfalls übernehmen.
  window.addEventListener('storage', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', listener)
  }
}

/* ------------------------------------------------------------- Öffentliche API */

export const consentStore = {
  subscribe,
  getSnapshot: readConsent,
  getServerSnapshot: (): StoredConsent => SERVER_SNAPSHOT,
}

/**
 * Aktuelle Einwilligung. `null` bedeutet: noch keine Entscheidung getroffen –
 * dann darf ausser den technisch notwendigen Cookies nichts gesetzt werden.
 */
export function useConsent(): StoredConsent | null {
  return useSyncExternalStore(subscribe, readConsent, consentStore.getServerSnapshot)
}

/** Kurzform für Dienste: „Darf ich laden?“ */
export function useHasConsent(category: OptionalCategory): boolean {
  return useConsent()?.categories[category] === true
}

/** Speichert die Auswahl und benachrichtigt alle Abonnenten. */
export function saveConsent(categories: ConsentSelection): void {
  const value: StoredConsent = {
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
    categories,
  }
  memoryConsent = value
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    // Nicht speicherbar – `memoryConsent` trägt die Auswahl durch die Sitzung.
  }
  cachedRaw = null
  emit()
}

/** Widerruf: löscht die Einwilligung, der Banner erscheint wieder. */
export function revokeConsent(): void {
  memoryConsent = null
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nichts zu löschen.
  }
  cachedRaw = null
  cachedValue = null
  emit()
}

/* ------------------------------- Einstellungen nachträglich öffnen (Footer) */

const openListeners = new Set<() => void>()

/** Öffnet den Consent-Dialog erneut – z. B. über „Cookie-Einstellungen“ im
 *  Footer. Pflicht nach DSGVO: Der Widerruf muss so einfach sein wie die
 *  Erteilung. */
export function openCookieSettings(): void {
  for (const listener of openListeners) listener()
}

export function onOpenCookieSettings(listener: () => void): () => void {
  openListeners.add(listener)
  return () => {
    openListeners.delete(listener)
  }
}
