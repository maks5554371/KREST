'use client'

import type { ReactNode } from 'react'

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#B8943F] focus:outline-none focus:ring-2 focus:ring-[#B8943F]/20 disabled:bg-slate-50'

export function Field({
  label,
  htmlFor,
  hint,
  errors,
  required,
  children,
}: {
  label: string
  htmlFor?: string
  hint?: string
  errors?: string[]
  required?: boolean
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
      {errors?.map((error) => (
        <p key={error} role="alert" className="text-xs text-red-600 mt-1">
          {error}
        </p>
      ))}
    </div>
  )
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ''}`} />
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputClass} ${props.className ?? ''}`} />
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputClass} ${props.className ?? ''}`} />
}

export function SectionCard({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="font-semibold text-[#0F172A]">{title}</h2>
        {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  )
}
