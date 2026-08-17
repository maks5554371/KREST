'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ShieldCheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import {
  ALLOW_ALL,
  consentStore,
  DENY_ALL,
  OPTIONAL_CATEGORIES,
  onOpenCookieSettings,
  saveConsent,
  useConsent,
  type ConsentSelection,
  type OptionalCategory,
} from '@/lib/consent'

/* --------------------------------------------------------------- Kategorien */

type CategoryInfo = {
  title: string
  description: string
  /** Konkret eingesetzte Dienste bzw. Cookies – Transparenzpflicht nach Art. 13 DSGVO. */
  services: string
}

const NECESSARY: CategoryInfo = {
  title: 'Notwendig',
  description:
    'Erforderlich für den Betrieb der Website. Dazu zählen die Speicherung Ihrer Cookie-Auswahl und das Sitzungs-Cookie des geschützten Admin-Bereichs. Ohne diese Funktionen ist die Website nicht nutzbar.',
  services:
    'Cookie-Auswahl (lokale Speicherung), Admin-Sitzung · Rechtsgrundlage: § 25 Abs. 2 Nr. 2 TDDDG – einwilligungsfrei.',
}

const OPTIONAL_INFO: Record<OptionalCategory, CategoryInfo> = {
  functional: {
    title: 'Funktional',
    description:
      'Ermöglicht eingebettete Inhalte und Komfortfunktionen von Drittanbietern, etwa Karten, Videos oder den direkten Messenger-Kontakt. Dabei kann Ihre IP-Adresse an den jeweiligen Anbieter übermittelt werden.',
    services: 'Derzeit ist in dieser Kategorie kein Dienst aktiv.',
  },
  statistics: {
    title: 'Statistik',
    description:
      'Hilft uns zu verstehen, welche Seiten besucht werden und wie unser Angebot genutzt wird. Die Auswertung erfolgt ausschliesslich in zusammengefasster Form.',
    services: 'Derzeit ist in dieser Kategorie kein Dienst aktiv.',
  },
  marketing: {
    title: 'Marketing',
    description:
      'Erlaubt es, Ihnen passende Angebote auszuspielen und den Erfolg von Kampagnen zu messen. Dazu gehört das seitenübergreifende Wiedererkennen Ihres Browsers.',
    services: 'Derzeit ist in dieser Kategorie kein Dienst aktiv.',
  },
}

/* ------------------------------------------------------------------ Schalter */

function ConsentSwitch({
  checked,
  disabled = false,
  onChange,
  label,
}: {
  checked: boolean
  disabled?: boolean
  onChange?: (next: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? 'bg-gold-500' : 'bg-slate-300'
      } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:opacity-90'}`}
    >
      <span
        aria-hidden
        className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-sm transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

/* -------------------------------------------------------------------- Dialog */

export default function CookieConsent() {
  const consent = useConsent()
  const [reopened, setReopened] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [selection, setSelection] = useState<ConsentSelection>(DENY_ALL)

  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  // Noch keine Entscheidung getroffen -> Dialog erscheint automatisch.
  // Über den Footer erneut geöffnet -> `reopened`.
  const open = consent === null || reopened

  // „Cookie-Einstellungen“ im Footer öffnet den Dialog mit der gespeicherten Auswahl.
  useEffect(
    () =>
      onOpenCookieSettings(() => {
        setSelection(consentStore.getSnapshot()?.categories ?? DENY_ALL)
        setShowDetails(true)
        setReopened(true)
      }),
    [],
  )

  const close = useCallback(() => {
    setReopened(false)
    setShowDetails(false)
  }, [])

  const decide = useCallback(
    (categories: ConsentSelection) => {
      saveConsent(categories)
      close()
    },
    [close],
  )

  // Seiteninhalt bleibt stehen, solange der Dialog offen ist.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  // Fokus im Dialog halten (Tastaturbedienung, WCAG 2.4.3). Escape schliesst nur,
  // wenn bereits eine Einwilligung vorliegt – sonst gäbe es einen Weg an der
  // Entscheidung vorbei.
  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    if (!panel) return

    const focusables = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ),
      )

    focusables()[0]?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && consent !== null) {
        close()
        return
      }
      if (event.key !== 'Tab') return
      const items = focusables()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement
      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, showDetails, consent, close])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-100 flex items-end justify-center bg-navy-950/60 backdrop-blur-sm sm:items-center sm:p-6"
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-card bg-white shadow-elevated sm:rounded-card"
          >
            {/* Kopf */}
            <div className="flex items-start gap-4 border-b border-slate-100 p-6 sm:p-8">
              <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-500/10 text-gold-600 sm:inline-flex">
                <ShieldCheckIcon className="h-6 w-6" />
              </span>
              <div className="flex-1">
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
                  Datenschutz
                </p>
                <h2 id={titleId} className="font-serif text-xl text-navy-900 sm:text-2xl">
                  {showDetails ? 'Cookie-Einstellungen' : 'Wir respektieren Ihre Privatsphäre'}
                </h2>
              </div>
              {consent !== null && (
                <button
                  type="button"
                  onClick={close}
                  aria-label="Dialog schliessen"
                  className="-mr-2 -mt-2 shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-navy-900"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Inhalt */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              <p id={descriptionId} className="text-sm leading-relaxed text-slate-600">
                Wir setzen Cookies und ähnliche Technologien ein. Technisch notwendige
                benötigen wir für den Betrieb der Website – alle übrigen nur mit Ihrer
                Einwilligung. Sie entscheiden selbst, was Sie zulassen, und können Ihre
                Auswahl jederzeit über „Cookie-Einstellungen“ im Footer ändern oder
                widerrufen.
              </p>

              {showDetails && (
                <div className="mt-6 space-y-3">
                  <CategoryRow info={NECESSARY} checked disabled />
                  {OPTIONAL_CATEGORIES.map((category) => (
                    <CategoryRow
                      key={category}
                      info={OPTIONAL_INFO[category]}
                      checked={selection[category]}
                      onChange={(next) =>
                        setSelection((current) => ({ ...current, [category]: next }))
                      }
                    />
                  ))}
                </div>
              )}

              <p className="mt-6 text-xs leading-relaxed text-slate-500">
                Weitere Informationen finden Sie in unserer{' '}
                <Link
                  href="/datenschutz"
                  className="font-medium text-gold-600 underline underline-offset-2 hover:text-gold-700"
                >
                  Datenschutzerklärung
                </Link>{' '}
                und im{' '}
                <Link
                  href="/impressum"
                  className="font-medium text-gold-600 underline underline-offset-2 hover:text-gold-700"
                >
                  Impressum
                </Link>
                .
              </p>
            </div>

            {/* Aktionen – Ablehnen ist gleichrangig zum Akzeptieren (kein Dark Pattern). */}
            <div className="border-t border-slate-100 bg-slate-50/70 p-6 sm:p-8">
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => decide(DENY_ALL)}
                  className="order-2 rounded-lg border-2 border-navy-900 px-6 py-3 text-sm font-semibold text-navy-900 transition-colors hover:bg-navy-900 hover:text-white sm:order-1"
                >
                  Nur notwendige
                </button>
                <button
                  type="button"
                  onClick={() => decide(ALLOW_ALL)}
                  className="order-1 rounded-lg bg-gold-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gold-600 sm:order-2"
                >
                  Alle akzeptieren
                </button>
              </div>

              <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                {showDetails ? (
                  <button
                    type="button"
                    onClick={() => decide(selection)}
                    className="text-sm font-semibold text-navy-900 underline underline-offset-4 transition-colors hover:text-gold-600"
                  >
                    Auswahl speichern
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowDetails(true)}
                    className="text-sm font-medium text-slate-600 underline underline-offset-4 transition-colors hover:text-navy-900"
                  >
                    Einstellungen anpassen
                  </button>
                )}
                {showDetails && (
                  <button
                    type="button"
                    onClick={() => setShowDetails(false)}
                    className="text-sm font-medium text-slate-500 transition-colors hover:text-navy-900"
                  >
                    Übersicht
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function CategoryRow({
  info,
  checked,
  disabled = false,
  onChange,
}: {
  info: CategoryInfo
  checked: boolean
  disabled?: boolean
  onChange?: (next: boolean) => void
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-navy-900">
            {info.title}
            {disabled && (
              <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                Immer aktiv
              </span>
            )}
          </p>
        </div>
        <ConsentSwitch
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          label={`Kategorie ${info.title}`}
        />
      </div>
      <p className="mt-2 text-xs leading-relaxed text-slate-600">{info.description}</p>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-400">{info.services}</p>
    </div>
  )
}
