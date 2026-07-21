import 'server-only'

import { resolve, sep } from 'node:path'

/**
 * Uploads liegen bewusst NICHT in `public/`.
 *
 * `public/` wird zur Bauzeit als statisches Verzeichnis behandelt; Dateien, die
 * erst später über die Administration hinzukommen, wären bei einem
 * `output: 'standalone'`-Build nicht garantiert im Auslieferungsverzeichnis.
 * Stattdessen schreiben wir neben die Datenbank und liefern über einen Route
 * Handler aus – das verhält sich in dev, `next start` und Docker gleich.
 */
export const UPLOAD_DIR_DEFAULT = 'data/uploads'

/** Öffentlicher Pfadpräfix, unter dem der Route Handler die Dateien ausliefert. */
export const UPLOAD_URL_PREFIX = '/uploads'

export function uploadRoot(): string {
  return resolve(process.cwd(), process.env.UPLOAD_PATH || UPLOAD_DIR_DEFAULT)
}

/**
 * Löst Pfadsegmente aus der URL auf eine Datei im Upload-Verzeichnis auf.
 * Gibt `null` zurück, wenn der Pfad das Verzeichnis verlassen würde
 * (Path Traversal über `..`, absolute Pfade oder Null-Bytes).
 */
export function resolveUploadPath(segments: string[]): string | null {
  if (segments.length === 0) return null
  if (segments.some((segment) => !segment || segment.includes('\0'))) return null

  const root = uploadRoot()
  const candidate = resolve(root, ...segments)

  // `resolve` normalisiert '..' bereits – danach muss der Pfad noch unterhalb
  // der Wurzel liegen. Der Separator verhindert Treffer wie '/data/uploads-evil'.
  if (candidate !== root && !candidate.startsWith(root + sep)) return null

  return candidate
}

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf'] as const

export const EXTENSION_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
}

/** 10 MB – reicht für Produktfotos und mehrseitige Broschüren. */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

export const CONTENT_TYPE_BY_EXTENSION: Record<string, string> = {
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  pdf: 'application/pdf',
}

/**
 * Der vom Browser gemeldete MIME-Typ ist nur eine Behauptung und lässt sich
 * frei fälschen. Deshalb zusätzlich die Signatur am Dateianfang prüfen, damit
 * die Positivliste oben tatsächlich etwas aussagt.
 */
export function matchesSignature(type: string, bytes: Uint8Array): boolean {
  switch (type) {
    case 'image/jpeg':
      return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
    case 'image/png':
      return (
        bytes[0] === 0x89 &&
        bytes[1] === 0x50 &&
        bytes[2] === 0x4e &&
        bytes[3] === 0x47 &&
        bytes[4] === 0x0d &&
        bytes[5] === 0x0a &&
        bytes[6] === 0x1a &&
        bytes[7] === 0x0a
      )
    case 'image/webp':
      // "RIFF" .... "WEBP"
      return (
        String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' &&
        String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP'
      )
    case 'application/pdf':
      return String.fromCharCode(...bytes.slice(0, 5)) === '%PDF-'
    default:
      return false
  }
}
