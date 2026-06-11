import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyPassword } from '@/lib/auth/password'
import { signToken } from '@/lib/auth/token'
import { checkRateLimit } from '@/lib/server/rateLimit'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const COOKIE_NAME = 'admin_token'
const SESSION_HOURS = 8

/** POST /api/admin/auth — log in */
export async function POST(request: NextRequest) {
  // Brute-force protection: 5 attempts per 15 minutes per IP
  const limited = checkRateLimit(request, { limit: 5, windowSeconds: 900 })
  if (limited) return limited

  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    const adminEmail = process.env.ADMIN_EMAIL
    const adminHash = process.env.ADMIN_PASSWORD_HASH

    if (!adminEmail || !adminHash) {
      console.error('[Admin auth] ADMIN_EMAIL or ADMIN_PASSWORD_HASH not configured')
      return NextResponse.json({ success: false, message: 'Admin account not configured' }, { status: 503 })
    }

    // Constant-time email comparison + password verification
    const emailMatch = email.toLowerCase() === adminEmail.toLowerCase()
    const passwordMatch = verifyPassword(password, adminHash)

    if (!emailMatch || !passwordMatch) {
      // Log failed attempt (do not reveal which field was wrong)
      console.warn(`[Admin auth] Failed login attempt for "${email}" at ${new Date().toISOString()}`)
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
    }

    const token = await signToken({ email: adminEmail, role: 'admin' })

    console.info(`[Admin auth] Successful login for "${adminEmail}" at ${new Date().toISOString()}`)

    const response = NextResponse.json({ success: true })
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_HOURS * 60 * 60,
      path: '/',
    })
    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 })
    }
    console.error('[Admin auth] Login error:', error)
    return NextResponse.json({ success: false, message: 'Login failed' }, { status: 500 })
  }
}

/** DELETE /api/admin/auth — log out */
export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })
  return response
}
