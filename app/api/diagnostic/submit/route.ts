import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { computeGreaterDiagnostic } from '@/lib/diagnostic/greaterEngine'
import { saveDiagnosticSubmission } from '@/lib/server/diagnosticStorage'
import { sendEmail, diagnosticReportTemplate } from '@/lib/email'
import { checkRateLimit } from '@/lib/server/rateLimit'

const answerSchema = z.object({
  id: z.string().min(1),
  pillar: z.enum(['growth', 'revenue', 'efficiency', 'alignment', 'talent', 'execution', 'resilience']),
  value: z.enum(['yes', 'not_sure', 'no']),
})

const payloadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  businessName: z.string().min(2),
  businessType: z.string().min(2),
  teamSize: z.number().min(1),
  monthlyRevenue: z.number().min(0),
  hourlyCost: z.number().min(0),
  manualHoursPerWeek: z.number().min(0),
  emailReport: z.boolean().default(true),
  answers: z.array(answerSchema).min(1),
})

export async function POST(request: NextRequest) {
  const limited = checkRateLimit(request, { limit: 3, windowSeconds: 120 })
  if (limited) return limited

  try {
    const raw = await request.json()
    const data = payloadSchema.parse(raw)

    const result = computeGreaterDiagnostic(data)

    const id = `diag_${Date.now()}`
    const timestamp = new Date().toISOString()

    await saveDiagnosticSubmission({
      id,
      timestamp,
      name: data.name,
      email: data.email,
      businessName: data.businessName,
      businessType: data.businessType,
      score: result.score,
      payload: {
        input: data,
        result,
      },
    })

    if (data.emailReport) {
      await sendEmail({
        to: data.email,
        subject: 'Your GREATER Diagnostic Report - TEAM Consulting',
        html: diagnosticReportTemplate({
          name: data.name,
          businessName: data.businessName,
          score: result.score,
          category: result.category,
          monthlyLoss: result.financialImpact.monthlyLoss,
          annualLoss: result.financialImpact.annualLoss,
          quickWin: result.quickWin,
          siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.teamadvisory.com',
        }),
      })
    }

    return NextResponse.json({
      success: true,
      id,
      timestamp,
      result,
    })
  } catch (error) {
    console.error('Diagnostic submit error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 })
    }
    return NextResponse.json({ success: false, message: 'Failed to submit diagnostic' }, { status: 500 })
  }
}

