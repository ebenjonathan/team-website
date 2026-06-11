import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { addSubscriber, listSubscribers } from '@/lib/server/diagnosticStorage'
import { requireAdminAuth } from '@/lib/server/requireAuth'

const subscriberSchema = z.object({
  email: z.string().email(),
})

export async function GET() {
  const authError = await requireAdminAuth()
  if (authError) return authError

  try {
    const subscribers = await listSubscribers()
    return NextResponse.json({ success: true, subscribers })
  } catch (error) {
    console.error('Subscriber list error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth()
  if (authError) return authError

  try {
    const body = await request.json()
    const data = subscriberSchema.parse(body)
    const subscriber = {
      id: `sub_${Date.now()}`,
      email: data.email,
      createdAt: new Date().toISOString(),
    }

    await addSubscriber(subscriber)
    return NextResponse.json({ success: true, subscriber })
  } catch (error) {
    console.error('Subscriber create error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 })
    }
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
