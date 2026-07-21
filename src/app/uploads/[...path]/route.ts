import { readFile, stat } from 'node:fs/promises'
import { extname } from 'node:path'
import { CONTENT_TYPE_BY_EXTENSION, resolveUploadPath } from '@/lib/uploads'

export const dynamic = 'force-dynamic'

/**
 * Liefert die in der Administration hochgeladenen Dateien aus.
 * Öffentlich lesbar (die Bilder stehen ohnehin im Katalog), aber streng auf das
 * Upload-Verzeichnis begrenzt – siehe `resolveUploadPath`.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params
  const filePath = resolveUploadPath(segments)

  if (!filePath) {
    return new Response('Not found', { status: 404 })
  }

  const extension = extname(filePath).slice(1).toLowerCase()
  const contentType = CONTENT_TYPE_BY_EXTENSION[extension]

  // Nur bekannte Typen ausliefern – verhindert, dass versehentlich abgelegte
  // Dateien als beliebiger Inhaltstyp im Browser landen.
  if (!contentType) {
    return new Response('Not found', { status: 404 })
  }

  try {
    const stats = await stat(filePath)
    if (!stats.isFile()) {
      return new Response('Not found', { status: 404 })
    }

    const file = await readFile(filePath)

    return new Response(new Uint8Array(file), {
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(stats.size),
        // Dateinamen enthalten eine UUID und werden nie überschrieben.
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
