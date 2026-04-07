import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { writeLocalSubmissionLog } from '@/lib/server/localSubmissionLog'
import { deliverSubmission } from '@/lib/server/submissionTransport'

// Event registration schema
const eventRegistrationSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  eventId: z.string(),
  eventTitle: z.string(),
  specialRequests: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validatedData = eventRegistrationSchema.parse(body)

    const mode = await deliverSubmission({
      channel: 'event-registration',
      payload: {
        providerHint: 'resend|sendgrid',
        ...validatedData,
      },
    })

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
