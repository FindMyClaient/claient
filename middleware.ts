import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublic = ['/login', '/planes', '/api', '/_next'].some(p => pathname.startsWith(p))
  
  if (isPublic) return NextResponse.next()

  const token = request.cookies.get('sb-gwgahijbkkvrcmdpwcoo-auth-token')
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}