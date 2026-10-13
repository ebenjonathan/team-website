import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { writeLocalSubmissionLog } from '@/lib/server/localSubmissionLog'
import { deliverSubmission } from '@/lib/server/submissionTransport'
import { checkRateLimit } from '@/lib/server/rateLimit'

// Event registration schema
const eventRegistrationSchema = z.object({
  firstName: z.string().trim().min(2).max(100),
  lastName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().min(7).max(40),
  company: z.string().trim().max(200).optional(),
  jobTitle: z.string().trim().max(120).optional(),
  eventId: z.string().trim().min(1).max(120),
  eventTitle: z.string().trim().min(1).max(200),
  specialRequests: z.string().trim().max(5000).optional(),
})

export async function POST(request: NextRequest) {
  const limited = await checkRateLimit(request, { limit: 5, windowSeconds: 60 })
  if (limited) return limited

  try {
    const body = await request.json().catch(() => null)

    // Validate request body
    const validatedData = eventRegistrationSchema.parse(body)

    const mode = await deliverSubmission({
      channel: 'event-registration',
      payload: {
        providerHint: 'resend|sendgrid',
        ...validatedData,
      },
    })

    if (mode === 'local-fallback' && process.env.NODE_ENV === 'production') {
      console.error('[Event registration] No email provider configured; registration not delivered.')
      return NextResponse.json(
        { success: false, code: 'not_configured', message: 'Event registration is temporarily unavailable.' },
        { status: 503 },
      )
    }

    await writeLocalSubmissionLog({
      channel: 'event-registration',
      mode,
      payload: validatedData,
    })

    return NextResponse.json(
      {
        success: true,
        mode,
        message:
          mode === 'local-fallback'
            ? 'Registration captured locally. Delivery service will be enabled when network/provider keys are available.'
            : 'Registration successful',
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Event registration error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 },
      )
    }

    return NextResponse.json(
      { success: false, message: 'Failed to register' },
      { status: 500 },
    )
  }
}
