'use client'

import { useActionState } from 'react'
import { loginAction } from '@/app/(admin)/admin/actions'
import type { FormState } from '@/lib/validation/product'

const initialState: FormState = {}

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState)

  return (
    <form action={action} className="space-y-5">
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          Passwort
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#B8943F] focus:outline-none focus:ring-2 focus:ring-[#B8943F]/20"
        />
      </div>

      {state.message && (
        <p role="alert" className="text-sm text-red-600">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-[#0F172A] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1e293b] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {pending ? 'Wird geprüft …' : 'Anmelden'}
      </button>
    </form>
  )
}
