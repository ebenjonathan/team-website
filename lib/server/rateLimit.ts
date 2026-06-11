import { NextRequest, NextResponse } from 'next/server'

interface RateLimitRecord {
  count: number
  resetAt: number
}

// In-process store — resets on cold start / redeploy (acceptable for edge-case abuse prevention)
const store = new Map<string, RateLimitRecord>()

export interface RateLimitOptions {
  /** Max requests per window */
  limit: number
  /** Window duration in seconds */
  windowSeconds: number
}

/**
 * Returns a 429 response when the caller has exceeded the limit, or null if the
 * request is within quota. Uses the IP from the X-Forwarded-For header (set by
 * Vercel / most reverse proxies) with a fallback to the direct connection address.
 */
export function checkRateLimit(
  request: NextRequest,
  { limit, windowSeconds }: RateLimitOptions,
): NextResponse | null {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'

  const key = `${request.nextUrl.pathname}::${ip}`
  const now = Date.now()

  let record = store.get(key)

  if (!record || now > record.resetAt) {
    record = { count: 1, resetAt: now + windowSeconds * 1000 }
    store.set(key, record)
    return null
  }

  record.count += 1

  if (record.count > limit) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000)
    return NextResponse.json(
      { success: false, message: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(record.resetAt / 1000)),
        },
      },
    )
  }

  return null
}
