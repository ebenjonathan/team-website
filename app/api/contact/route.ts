import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { deliverSubmission, deliveryMode, SubmissionDeliveryError } from '@/lib/server/submissionTransport'
import { checkRateLimit } from '@/lib/server/rateLimit'
import { enquiryTopicValues } from '@/lib/data/enquiry'

const MAX_BODY_BYTES = 16 * 1024

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

async function readJsonBody(request: NextRequest): Promise<{ body: unknown } | { error: NextResponse }> {
  const contentLength = Number(request.headers.get('content-length'))
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return { error: NextResponse.json({ success: false, code: 'payload_too_large' }, { status: 413 }) }
  }

  const reader = request.body?.getReader()
  if (!reader) return { error: NextResponse.json({ success: false, code: 'invalid' }, { status: 400 }) }

  const chunks: Uint8Array[] = []
  let totalBytes = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      totalBytes += value.byteLength
      if (totalBytes > MAX_BODY_BYTES) {
        await reader.cancel()
        return { error: NextResponse.json({ success: false, code: 'payload_too_large' }, { status: 413 }) }
      }
      chunks.push(value)
    }
  } catch {
    return { error: NextResponse.json({ success: false, code: 'invalid' }, { status: 400 }) }
  } finally {
    reader.releaseLock()
  }

  const bytes = new Uint8Array(totalBytes)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }

  try {
    return { body: JSON.parse(new TextDecoder().decode(bytes)) as unknown }
  } catch {
    return { error: NextResponse.json({ success: false, code: 'invalid' }, { status: 400 }) }
  }
}

export async function POST(request: NextRequest) {
  const limited = await checkRateLimit(request, { limit: 5, windowSeconds: 60 })
  if (limited) return limited

  const parsedBody = await readJsonBody(request)
  if ('error' in parsedBody) return parsedBody.error
  const { body } = parsedBody

  if (body && typeof body === 'object' && 'website' in body && (body as { website?: string }).website) {
    return NextResponse.json({ success: false, code: 'invalid' }, { status: 400 })
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

  // Contact enquiries must reach Web3Forms; never report success without delivery.
  if (mode === 'local-fallback') {
    console.error('[Contact] Web3Forms is not configured; enquiry not delivered.')
    return NextResponse.json(
      { success: false, code: 'not_configured', fallbackEmail: FALLBACK_EMAIL },
      { status: 503 },
    )
  }

  try {
    await deliverSubmission({ channel: 'contact', payload: data })
  } catch (error) {
    if (error instanceof SubmissionDeliveryError && error.kind === 'rate_limited') {
      return NextResponse.json(
        { success: false, code: 'rate_limited' },
        { status: 429, headers: { 'Retry-After': String(error.retryAfterSeconds ?? 60) } },
      )
    }
    if (error instanceof SubmissionDeliveryError && error.kind === 'timeout') {
      return NextResponse.json({ success: false, code: 'timeout' }, { status: 504 })
    }

    return NextResponse.json(
      { success: false, code: 'delivery_failed', fallbackEmail: FALLBACK_EMAIL },
      { status: 502 },
    )
  }

  return NextResponse.json({ success: true })
}
