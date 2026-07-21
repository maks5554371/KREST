import 'server-only'

import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scryptAsync = promisify(scrypt)

const KEY_LENGTH = 64
const PREFIX = 'scrypt'
/**
 * Trenner ist bewusst `:` und nicht das übliche `$`: Next.js lädt .env-Dateien
 * mit dotenv-Expansion, die `$abc` als Variablenreferenz auflöst. Ein Hash mit
 * `$` käme dadurch verstümmelt im Code an und jede Anmeldung schlüge fehl.
 */
const SEPARATOR = ':'

/**
 * Format: `scrypt:<salt-hex>:<hash-hex>`.
 * scrypt kommt aus node:crypto – kein nativer Build nötig (anders als bcrypt/argon2).
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16)
  const derived = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer
  return [PREFIX, salt.toString('hex'), derived.toString('hex')].join(SEPARATOR)
}

export async function verifyPassword(
  password: string,
  stored: string | undefined
): Promise<boolean> {
  if (!stored) return false

  const [prefix, saltHex, hashHex] = stored.split(SEPARATOR)
  if (prefix !== PREFIX || !saltHex || !hashHex) return false

  let expected: Buffer
  try {
    expected = Buffer.from(hashHex, 'hex')
  } catch {
    return false
  }
  if (expected.length !== KEY_LENGTH) return false

  const derived = (await scryptAsync(
    password,
    Buffer.from(saltHex, 'hex'),
    KEY_LENGTH
  )) as Buffer

  return timingSafeEqual(derived, expected)
}
