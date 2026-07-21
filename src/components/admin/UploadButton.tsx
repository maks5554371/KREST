'use client'

import { useRef, useState } from 'react'
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'

/**
 * Lädt eine Datei zum Route Handler hoch und meldet die entstandene URL zurück.
 * Bewusst kein Server Action: Der Upload läuft unabhängig vom Absenden des
 * Formulars, damit der Bearbeitungsstand nicht verloren geht.
 */
export default function UploadButton({
  accept,
  label,
  onUploaded,
}: {
  accept: string
  label: string
  onUploaded: (url: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function upload(file: File) {
    setBusy(true)
    setError(null)
    try {
      const body = new FormData()
      body.append('file', file)

      const response = await fetch('/api/admin/upload', { method: 'POST', body })
      const result = await response.json()

      if (!response.ok) {
        setError(result.error ?? 'Upload fehlgeschlagen.')
        return
      }
      onUploaded(result.url)
    } catch {
      setError('Upload fehlgeschlagen. Bitte erneut versuchen.')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) void upload(file)
        }}
      />
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-2 border border-slate-300 bg-white px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:border-[#B8943F] disabled:opacity-60 transition-colors"
      >
        <ArrowUpTrayIcon className="w-4 h-4" />
        {busy ? 'Wird hochgeladen …' : label}
      </button>
      {error && (
        <p role="alert" className="text-xs text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  )
}
