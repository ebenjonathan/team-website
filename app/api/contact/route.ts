import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { writeLocalSubmissionLog } from '@/lib/server/localSubmissionLog'
import { deliverSubmission } from '@/lib/server/submissionTransport'
import { checkRateLimit } from '@/lib/server/rateLimit'

// Form validation schema
const contactSchema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email().max(320),
  organisation: z.string().min(2).max(200),
  country: z.string().min(2).max(100),
  requestType: z.string().min(2).max(100),
  message: z.string().min(10).max(5000),
})

export async function POST(request: NextRequest) {
  const limited = checkRateLimit(request, { limit: 5, windowSeconds: 60 })
  if (limited) return limited

  try {
    const body = await request.json()

    // Validate request body
    const validatedData = contactSchema.parse(body)

    const mode = await deliverSubmission({
      channel: 'contact',
      payload: {
        providerHint: 'resend|sendgrid',
        ...validatedData,
      },
    })

    await writeLocalSubmissionLog({
      channel: 'contact',
      mode,
      payload: validatedData,
    })

    return NextResponse.json(
      {
        success: true,
        mode,
        message:
          mode === 'local-fallback'
            ? 'Message captured locally. Delivery service will be enabled when network/provider keys are available.'
            : 'Message sent successfully',
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Contact form error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 },
      )
    }

    return NextResponse.json(
      { success: false, message: 'Failed to send message' },
      { status: 500 },
    )
  }
}
