'use client'

import { useActionState, useState } from 'react'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

import {
  deleteCategoryAction,
  saveCategoryAction,
} from '@/app/(admin)/admin/actions'
import { Field, TextArea, TextInput } from './AdminFields'
import { slugify, type FormState } from '@/lib/validation/product'
import type { Category } from '@/types/product'

const initialState: FormState = {}

function CategoryForm({
  category,
  onDone,
}: {
  category: Category | null
  onDone?: () => void
}) {
  const [state, action, pending] = useActionState(saveCategoryAction, initialState)
  const [name, setName] = useState(category?.name ?? '')
  const [slug, setSlug] = useState(category?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(Boolean(category))

  const errors = state.errors ?? {}

  // Nach erfolgreichem Anlegen das Formular wieder einklappen.
  if (state.ok && onDone) {
    queueMicrotask(onDone)
  }

  return (
    <form action={action} className="space-y-4">
      {category && <input type="hidden" name="id" value={category.id} />}

      {state.message && (
        <p
          role="alert"
          className={`rounded-lg border px-4 py-2.5 text-sm ${
            state.ok
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {state.message}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Name" required errors={errors.name}>
          <TextInput
            name="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              if (!slugTouched) setSlug(slugify(event.target.value))
            }}
            placeholder="z. B. Diodenlaser"
          />
        </Field>

        <Field label="Slug" required hint={`/katalog?kategorie=${slug || '…'}`} errors={errors.slug}>
          <TextInput
            name="slug"
            value={slug}
            onChange={(event) => {
              setSlugTouched(true)
              setSlug(event.target.value)
            }}
            onBlur={(event) => setSlug(slugify(event.target.value))}
          />
        </Field>
      </div>

      <Field label="Beschreibung" errors={errors.description}>
        <TextArea
          name="description"
          rows={2}
          defaultValue={category?.description ?? ''}
          placeholder="Kurzer Einleitungstext für die Kategorieseite."
        />
      </Field>

      <Field label="Sortierung" hint="Kleinere Zahl erscheint weiter oben." errors={errors.sortOrder}>
        <TextInput
          name="sortOrder"
          type="number"
          min={0}
          defaultValue={category?.sortOrder ?? 0}
          className="sm:w-32"
        />
      </Field>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="bg-[#0F172A] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#1e293b] disabled:opacity-60 transition-colors"
        >
          {pending ? 'Wird gespeichert …' : 'Speichern'}
        </button>
        {onDone && (
          <button
            type="button"
            onClick={onDone}
            className="text-sm font-medium text-slate-500 hover:text-[#0F172A] transition-colors"
          >
            Abbrechen
          </button>
        )}
      </div>
    </form>
  )
}

export default function CategoryManager({ categories }: { categories: Category[] }) {
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {categories.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">
            Noch keine Kategorien angelegt.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {categories.map((category) => (
              <li key={category.id} className="p-4">
                {editingId === category.id ? (
                  <CategoryForm
                    category={category}
                    onDone={() => setEditingId(null)}
                  />
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#0F172A]">{category.name}</p>
                      <p className="text-sm text-slate-500 truncate">
                        {category.slug}
                        {category.description ? ` · ${category.description}` : ''}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingId(category.id)}
                      className="text-sm font-medium text-slate-600 hover:text-[#B8943F] px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      Bearbeiten
                    </button>
                    <form
                      action={deleteCategoryAction}
                      onSubmit={(event) => {
                        if (
                          !window.confirm(
                            `Kategorie „${category.name}“ löschen? Die zugeordneten Produkte bleiben erhalten und verlieren nur ihre Kategorie.`
                          )
                        ) {
                          event.preventDefault()
                        }
                      }}
                    >
                      <input type="hidden" name="id" value={category.id} />
                      <button
                        type="submit"
                        aria-label={`${category.name} löschen`}
                        className="text-slate-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {creating ? (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-[#0F172A] mb-4">Neue Kategorie</h2>
          <CategoryForm category={null} onDone={() => setCreating(false)} />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 bg-[#B8943F] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#9d7d34] transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Neue Kategorie
        </button>
      )}
    </div>
  )
}
