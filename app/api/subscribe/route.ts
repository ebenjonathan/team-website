import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { writeLocalSubmissionLog } from '@/lib/server/localSubmissionLog'
import { deliverSubmission } from '@/lib/server/submissionTransport'

// Newsletter subscription schema
const subscribeSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  interests: z.array(z.string()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validatedData = subscribeSchema.parse(body)

    const mode = await deliverSubmission({
      channel: 'newsletter',
      payload: {
        providerHint: 'mailchimp',
        ...validatedData,
      },
    })

    await writeLocalSubmissionLog({
      channel: 'newsletter',
      mode,
      payload: validatedData,
    })

    return NextResponse.json(
      {
        success: true,
        mode,
        message:
          mode === 'local-fallback'
            ? 'Subscription captured locally. Mailchimp integration will be enabled when network/API keys are available.'
            : 'Successfully subscribed to newsletter',
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Newsletter subscription error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 },
      )
    }

    return NextResponse.json(
      { success: false, message: 'Failed to subscribe' },
      { status: 500 },
    )
  }
}
