import 'server-only'

import { cookies } from 'next/headers'
import {
  decryptSession,
  encryptSession,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  type SessionPayload,
} from './token'

export { SESSION_COOKIE, decryptSession }
export type { SessionPayload }

/**
 * `Secure` verhindert, dass der Browser das Cookie über unverschlüsseltes HTTP
 * sendet. Standard ist daher: in der Produktion an.
 *
 * `COOKIE_SECURE="false"` schaltet es ab – gedacht für einen Testbetrieb ohne
 * TLS (z. B. Zugriff über die IP im lokalen Netz). Im öffentlichen Betrieb ist
 * das keine Option: Ohne TLS liest jeder auf dem Netzweg das Session-Cookie
 * mit und übernimmt damit die Verwaltung. Das Passwort selbst ginge beim
 * Anmelden ohnehin im Klartext über die Leitung.
 */
function secureCookieEnabled(): boolean {
  if (process.env.COOKIE_SECURE === 'false') return false
  if (process.env.COOKIE_SECURE === 'true') return true
  return process.env.NODE_ENV === 'production'
}

export async function createSession(): Promise<void> {
  const token = await encryptSession({ role: 'admin' })
  const cookieStore = await cookies()

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: secureCookieEnabled(),
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  return decryptSession(cookieStore.get(SESSION_COOKIE)?.value)
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}
