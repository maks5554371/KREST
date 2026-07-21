import 'server-only'

import { createClient, type Client } from '@libsql/client'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { migrations } from './migrations'

const DEFAULT_PATH = 'data/kret.db'

function databaseUrl(): string {
  const file = resolve(process.cwd(), process.env.DATABASE_PATH || DEFAULT_PATH)
  // libSQL legt die Datei an, aber nicht den Ordner darüber.
  mkdirSync(dirname(file), { recursive: true })
  return pathToFileURL(file).href
}

async function migrate(client: Client): Promise<void> {
  await client.execute(
    `CREATE TABLE IF NOT EXISTS _migrations (
      id TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL
    )`
  )

  const applied = await client.execute('SELECT id FROM _migrations')
  const done = new Set(applied.rows.map((row) => String(row.id)))

  for (const migration of migrations) {
    if (done.has(migration.id)) continue

    // batch('write') läuft als eine Transaktion: entweder alles oder nichts.
    await client.batch(
      [
        ...migration.statements.map((sql) => ({ sql, args: [] })),
        {
          sql: 'INSERT INTO _migrations (id, applied_at) VALUES (?, ?)',
          args: [migration.id, new Date().toISOString()],
        },
      ],
      'write'
    )
  }
}

/**
 * In der Entwicklung wird das Modul bei jedem Hot-Reload neu ausgewertet.
 * Ohne globalThis-Cache entstünde pro Reload eine neue Verbindung.
 */
const globalForDb = globalThis as typeof globalThis & {
  __kretDb?: Promise<Client>
}

async function connect(): Promise<Client> {
  const client = createClient({ url: databaseUrl() })
  await client.execute('PRAGMA foreign_keys = ON')
  await migrate(client)
  return client
}

export function getDb(): Promise<Client> {
  globalForDb.__kretDb ??= connect()
  return globalForDb.__kretDb
}
