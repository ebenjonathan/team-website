import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { writeLocalSubmissionLog } from '@/lib/server/localSubmissionLog'
import { deliverSubmission, deliveryMode } from '@/lib/server/submissionTransport'
import { checkRateLimit } from '@/lib/server/rateLimit'
import { enquiryTopicValues } from '@/lib/data/enquiry'

const contactSchema = z.object({
  name: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().max(40).optional().default(''),
  organisation: z.string().trim().min(2).max(200),
  country: z.string().trim().min(2).max(100),
  requestType: z.enum(enquiryTopicValues),
  message: z.string().trim().min(20).max(5000),
  // Honeypot: real visitors never see or fill this field.
  website: z.string().max(0).optional().default(''),
})

const FALLBACK_EMAIL = 'info@team.co.zw'

export async function POST(request: NextRequest) {
  const limited = checkRateLimit(request, { limit: 5, windowSeconds: 60 })
  if (limited) return limited

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, code: 'invalid' }, { status: 400 })
  }

  // Bots that fill the hidden field get a normal-looking success and nothing is sent.
  if (body && typeof body === 'object' && 'website' in body && (body as { website?: string }).website) {
    return NextResponse.json({ success: true })
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, code: 'invalid', errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  const { website: _honeypot, ...data } = parsed.data
  const mode = deliveryMode('contact')

  // In production an enquiry with no email provider would vanish, so refuse it
  // clearly instead of pretending it was sent.
  if (mode === 'local-fallback' && process.env.NODE_ENV === 'production') {
    console.error('[Contact] No email provider configured; enquiry not delivered.')
    await writeLocalSubmissionLog({ channel: 'contact', mode, payload: data })
    return NextResponse.json(
      { success: false, code: 'not_configured', fallbackEmail: FALLBACK_EMAIL },
      { status: 503 },
    )
  }

  try {
    await deliverSubmission({ channel: 'contact', payload: data })
  } catch (error) {
    console.error('[Contact] Delivery failed:', error)
    await writeLocalSubmissionLog({ channel: 'contact', mode, payload: { ...data, deliveryFailed: true } })
    return NextResponse.json(
      { success: false, code: 'delivery_failed', fallbackEmail: FALLBACK_EMAIL },
      { status: 502 },
    )
  }

  await writeLocalSubmissionLog({ channel: 'contact', mode, payload: data })
  return NextResponse.json({ success: true, mode })
}
