'use client'

import { TrashIcon } from '@heroicons/react/24/outline'
import { deleteProductAction } from '@/app/(admin)/admin/actions'

export default function DeleteProductButton({
  id,
  slug,
  name,
}: {
  id: number
  slug: string
  name: string
}) {
  return (
    <form
      action={deleteProductAction}
      onSubmit={(event) => {
        if (!window.confirm(`„${name}“ wirklich löschen? Das lässt sich nicht rückgängig machen.`)) {
          event.preventDefault()
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        aria-label={`${name} löschen`}
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </form>
  )
}
