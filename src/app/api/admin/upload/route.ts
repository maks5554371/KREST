import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import { assertAdmin } from '@/lib/auth/guard'
import {
  ALLOWED_DOCUMENT_TYPES,
  ALLOWED_IMAGE_TYPES,
  EXTENSION_BY_TYPE,
  matchesSignature,
  MAX_UPLOAD_BYTES,
  UPLOAD_URL_PREFIX,
  uploadRoot,
} from '@/lib/uploads'

export const dynamic = 'force-dynamic'

const ALLOWED_TYPES: string[] = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES]

export async function POST(request: Request) {
  // Route Handler sind wie öffentliche Endpunkte zu behandeln.
  const session = await assertAdmin()
  if (!session) {
    return Response.json({ error: 'Nicht angemeldet.' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file')

  if (!(file instanceof File)) {
    return Response.json({ error: 'Keine Datei übermittelt.' }, { status: 400 })
  }

  if (file.size === 0) {
    return Response.json({ error: 'Die Datei ist leer.' }, { status: 400 })
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return Response.json(
      { error: `Datei ist zu gross (max. ${MAX_UPLOAD_BYTES / 1024 / 1024} MB).` },
      { status: 413 }
    )
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return Response.json(
      { error: 'Nur JPG, PNG, WebP und PDF sind erlaubt.' },
      { status: 415 }
    )
  }

  const bytes = new Uint8Array(await file.arrayBuffer())

  if (!matchesSignature(file.type, bytes)) {
    return Response.json(
      { error: 'Der Dateiinhalt passt nicht zum Dateityp.' },
      { status: 415 }
    )
  }

  // Der vom Browser gelieferte Dateiname fliesst bewusst NICHT in den Pfad ein.
  const extension = EXTENSION_BY_TYPE[file.type]
  const year = String(new Date().getFullYear())
  const fileName = `${randomUUID()}.${extension}`

  const targetDir = join(uploadRoot(), year)
  await mkdir(targetDir, { recursive: true })
  await writeFile(join(targetDir, fileName), bytes)

  return Response.json({ url: `${UPLOAD_URL_PREFIX}/${year}/${fileName}` })
}
