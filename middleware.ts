import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth/token'

const ADMIN_LOGIN = '/admin/login'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow the login page itself and its POST handler
  if (pathname === ADMIN_LOGIN || pathname === '/api/admin/auth') {
    return NextResponse.next()
  }

  const token = request.cookies.get('admin_token')?.value

  if (!token) {
    return redirectToLogin(request)
  }

  const payload = await verifyToken(token)
  if (!payload || payload.role !== 'admin') {
    const response = redirectToLogin(request)
    response.cookies.delete('admin_token')
    return response
  }

  return NextResponse.next()
}

function redirectToLogin(request: NextRequest): NextResponse {
  const url = request.nextUrl.clone()
  url.pathname = ADMIN_LOGIN
  url.searchParams.set('from', request.nextUrl.pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
