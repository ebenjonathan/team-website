/**
 * API route auth guard — call at the top of every /api/admin/* handler.
 * Returns a 401 NextResponse if the request is unauthenticated; otherwise null.
 */
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth/token'

export async function requireAdminAuth(): Promise<NextResponse | null> {
  const token = cookies().get('admin_token')?.value
  if (!token) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }
  const payload = await verifyToken(token)
  if (!payload || payload.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }
  return null
}
