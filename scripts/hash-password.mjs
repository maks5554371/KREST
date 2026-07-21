#!/usr/bin/env node
/**
 * Erzeugt den Wert für ADMIN_PASSWORD_HASH und ein passendes SESSION_SECRET.
 *
 *   node scripts/hash-password.mjs "mein-sicheres-passwort"
 *
 * Das Passwort selbst wird nirgends gespeichert – nur der scrypt-Hash landet
 * in der .env.local.
 */
import { randomBytes, scrypt } from 'node:crypto'
import { promisify } from 'node:util'

const scryptAsync = promisify(scrypt)
const KEY_LENGTH = 64

const password = process.argv[2]

if (!password) {
  console.error('Aufruf: node scripts/hash-password.mjs "<passwort>"')
  process.exit(1)
}

if (password.length < 12) {
  console.error('Bitte ein Passwort mit mindestens 12 Zeichen verwenden.')
  process.exit(1)
}

const salt = randomBytes(16)
const derived = await scryptAsync(password, salt, KEY_LENGTH)

// Trenner ':' statt '$': Next.js expandiert '$name' beim Laden der .env-Datei,
// ein Hash mit '$' käme abgeschnitten im Code an.
const hash = ['scrypt', salt.toString('hex'), derived.toString('hex')].join(':')

console.log('\nIn .env.local eintragen:\n')
console.log(`ADMIN_PASSWORD_HASH="${hash}"`)
console.log(`SESSION_SECRET="${randomBytes(32).toString('base64')}"`)
console.log('')
