import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { writeLocalSubmissionLog } from '@/lib/server/localSubmissionLog'
import { deliverSubmission } from '@/lib/server/submissionTransport'
import { checkRateLimit } from '@/lib/server/rateLimit'

const sectionScoreSchema = z.object({
  score: z.number().min(0).max(100),
  weight: z.number().min(0).max(1),
  weightedContribution: z.number().min(0).max(100),
  penaltyApplied: z.number().min(0).max(50),
})

const criticalFindingSchema = z.object({
  title: z.string(),
  severity: z.enum(['Critical', 'High', 'Medium']),
  estimatedFinancialImpact: z.number().min(0),
  recommendation: z.string(),
})

const requestSchema = z.object({
  profile: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    organisation: z.string().min(2),
    country: z.string().min(2),
    teamSize: z.number().min(1),
    manualHoursPerPersonPerWeek: z.number().min(0),
    averageHourlyRateUsd: z.number().min(0),
    emailReport: z.boolean().default(true),
  }),
  responses: z.record(
    z.object({
      binaryAnswers: z.record(z.enum(['yes', 'no', 'not_sure'])),
      multiAnswers: z.record(z.string()),
      painPointIds: z.array(z.string()),
    }),
  ),
  result: z.object({
    score: z.number().min(0).max(100),
    category: z.enum(['Critical', 'Unstable', 'Growing', 'Structured', 'Optimized']),
    sectionScores: z.object({
      growth: sectionScoreSchema,
      revenue: sectionScoreSchema,
      execution: sectionScoreSchema,
      automation: sectionScoreSchema,
      talent: sectionScoreSchema,
      experience: sectionScoreSchema,
      strategy: sectionScoreSchema,
    }),
    financialImpact: z.object({
      monthlyLoss: z.number().min(0),
      annualLoss: z.number().min(0),
      hoursLost: z.number().min(0),
    }),
    insights: z.array(z.string()).min(1),
    criticalFindings: z.array(criticalFindingSchema).min(1),
    quickWin: z.string(),
  }),
})

export async function POST(request: NextRequest) {
  const limited = checkRateLimit(request, { limit: 3, windowSeconds: 60 })
  if (limited) return limited

  try {
    const body = await request.json()
    const validated = requestSchema.parse(body)

    const mode = await deliverSubmission({
      channel: 'diagnostic',
      payload: {
        providerHint: validated.profile.emailReport ? 'resend|sendgrid' : 'none',
        ...validated,
      },
    })

    await writeLocalSubmissionLog({
      channel: 'diagnostic',
      mode,
      payload: validated,
    })

    return NextResponse.json(
      {
        success: true,
        mode,
        output: validated.result,
        reportDelivery: validated.profile.emailReport ? 'requested' : 'not-requested',
        message:
          mode === 'local-fallback'
            ? 'Diagnostic captured locally. Email delivery will be enabled when provider keys are configured.'
            : 'Diagnostic captured and delivery pipeline triggered.',
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Diagnostic submission error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 })
    }

    return NextResponse.json(
      { success: false, message: 'Failed to process diagnostic submission' },
      { status: 500 },
    )
  }
}
