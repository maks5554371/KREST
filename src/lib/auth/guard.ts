import 'server-only'

import { cache } from 'react'
import { redirect } from 'next/navigation'
import { getSession, type SessionPayload } from './session'

/**
 * Die eigentliche Sicherheitsgrenze.
 *
 * Server Actions und Route Handler sind laut Next.js-Doku direkt per POST
 * erreichbar – nicht nur über die UI. Deshalb MUSS jede mutierende Action und
 * jeder geschützte Route Handler diese Funktion selbst aufrufen. Eine Prüfung
 * im Layout genügt nicht (Layouts rendern bei Navigation nicht neu).
 *
 * `cache` dedupliziert den Aufruf innerhalb eines Renderdurchlaufs.
 */
export const requireAdmin = cache(async (): Promise<SessionPayload> => {
  const session = await getSession()
  if (!session) {
    redirect('/admin/login')
  }
  return session
})

/** Wie `requireAdmin`, wirft aber statt umzuleiten – für Route Handler. */
export async function assertAdmin(): Promise<SessionPayload | null> {
  return getSession()
}
