import { redirect } from 'next/navigation'
import LoginForm from '@/components/admin/LoginForm'
import { getSession } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  // Bereits angemeldet? Dann direkt in die Verwaltung.
  if (await getSession()) {
    redirect('/admin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-2xl font-black text-[#0F172A] tracking-tight">
            KRET<span className="text-[#B8943F]">-Manufaktur</span>
          </p>
          <p className="text-sm text-slate-500 mt-2">Verwaltung</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <LoginForm />
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Geschützter Bereich. Nur für Mitarbeitende der KRET-Manufaktur.
        </p>
      </div>
    </div>
  )
}
