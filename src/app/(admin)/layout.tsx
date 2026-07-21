import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verwaltung',
  robots: { index: false, follow: false },
}

/**
 * Rahmen für den gesamten Verwaltungsbereich – ohne Header/Footer der Website.
 * Bewusst OHNE Anmeldeprüfung: die Login-Seite liegt ebenfalls darunter, und
 * Layouts rendern bei Navigation nicht neu. Die Prüfung sitzt in jeder Seite
 * (`requireAdmin`) und in jeder Server Action.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen flex-1 bg-slate-100">{children}</div>
}
