import { NextResponse, type NextRequest } from 'next/server'
import { decryptSession, SESSION_COOKIE } from '@/lib/auth/token'

/**
 * Seit Next.js 16 heisst die frühere `middleware` `proxy` (Node.js-Runtime).
 *
 * Das hier ist NUR eine optimistische Prüfung für saubere Weiterleitungen –
 * ausdrücklich keine Sicherheitsgrenze. Die liegt in `requireAdmin()`, das jede
 * Seite und jede Server Action selbst aufruft.
 */
export async function proxy(request: NextRequest) {
  const session = await decryptSession(request.cookies.get(SESSION_COOKIE)?.value)

  if (!session) {
    const loginUrl = new URL('/admin/login', request.nextUrl)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // Die Login-Seite selbst muss erreichbar bleiben, sonst entsteht eine Schleife.
  matcher: ['/admin', '/admin/((?!login).*)'],
}
