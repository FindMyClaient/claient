import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isMantenimiento = process.env.MAINTENANCE_MODE === 'true'
  const { pathname } = request.nextUrl

  // Si NO está en mantenimiento, todo normal
  if (!isMantenimiento) {
    return NextResponse.next()
  }

  // Permitir acceso a la pagina de mantenimiento, recursos estaticos y favicon
  if (
    pathname.startsWith('/mantenimiento') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/health') ||
    pathname === '/favicon.ico' ||
    pathname === '/1.svg' ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|css|js)$/)
  ) {
    return NextResponse.next()
  }

  // Todo lo demas redirige a mantenimiento
  return NextResponse.redirect(new URL('/mantenimiento', request.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
