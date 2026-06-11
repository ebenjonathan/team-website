import { NextRequest, NextResponse } from 'next/server'
import { deleteSubscriber } from '@/lib/server/diagnosticStorage'
import { requireAdminAuth } from '@/lib/server/requireAuth'

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAdminAuth()
  if (authError) return authError

  try {
    const deleted = await deleteSubscriber(params.id)
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Subscriber not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Subscriber delete error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
