import { SignJWT, jwtVerify } from 'jose'

/**
 * Reine Token-Logik ohne `next/headers`, damit sie auch in `proxy.ts`
 * importiert werden kann. Das Cookie-Handling liegt in `session.ts`.
 */
export const SESSION_COOKIE = 'kret_admin'
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7 // 7 Tage

export interface SessionPayload {
  /** Rolle statt Benutzer-ID: Es gibt genau ein Admin-Konto. */
  role: 'admin'
}

function secretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET
  if (!secret || secret.length < 32) {
    throw new Error(
      'SESSION_SECRET fehlt oder ist zu kurz (mindestens 32 Zeichen). Siehe .env.example.'
    )
  }
  return new TextEncoder().encode(secret)
}

export async function encryptSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(secretKey())
}

export async function decryptSession(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ['HS256'] })
    return payload.role === 'admin' ? { role: 'admin' } : null
  } catch {
    // Abgelaufen, manipuliert oder mit anderem Secret signiert.
    return null
  }
}
