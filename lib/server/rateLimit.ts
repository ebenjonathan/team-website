import { createHash } from 'node:crypto'
import { isIP } from 'node:net'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

interface RateLimitRecord {
  count: number
  resetAt: number
}

export interface RateLimitOptions {
  /** Max requests per window */
  limit: number
  /** Window duration in seconds */
  windowSeconds: number
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  reset: number
  timedOut?: boolean
}

export interface RateLimitStore {
  limit(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult>
}

export interface RateLimitDependencies {
  store: () => RateLimitStore
  clientIdentifier: (request: NextRequest) => string
  now?: () => number
}

interface RateLimitEnvironment {
  VERCEL?: string
  NODE_ENV?: string
}

export class LocalRateLimitStore implements RateLimitStore {
  private readonly records = new Map<string, RateLimitRecord>()

  async limit(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
    const now = Date.now()
    let record = this.records.get(key)

    if (!record || now >= record.resetAt) {
      record = { count: 0, resetAt: now + windowSeconds * 1000 }
      this.records.set(key, record)
    }

    record.count += 1
    return {
      success: record.count <= limit,
      remaining: Math.max(0, limit - record.count),
      reset: record.resetAt,
    }
  }
}

export class UpstashRateLimitStore implements RateLimitStore {
  private readonly redis: Redis
  private readonly limiters = new Map<string, Ratelimit>()

  constructor(redis = Redis.fromEnv()) {
    this.redis = redis
  }

  async limit(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
    const limiterKey = `${limit}:${windowSeconds}`
    let limiter = this.limiters.get(limiterKey)

    if (!limiter) {
      limiter = new Ratelimit({
        redis: this.redis,
        limiter: Ratelimit.fixedWindow(limit, `${windowSeconds} s`),
        prefix: 'team-consulting:rate-limit',
        analytics: false,
        ephemeralCache: false,
        timeout: 2500,
      })
      this.limiters.set(limiterKey, limiter)
    }

    const result = await limiter.limit(key)
    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset,
      timedOut: result.reason === 'timeout',
    }
  }
}

export function resolveClientIdentifier(
  request: NextRequest,
  environment: RateLimitEnvironment = process.env,
): string {
  if (environment.VERCEL === '1') {
    const ip = request.headers.get('x-vercel-forwarded-for')?.split(',')[0].trim()
    if (!ip || isIP(ip) === 0) throw new Error('Trusted Vercel client IP is unavailable')
    return ip
  }

  if (environment.NODE_ENV === 'development') return 'local-development'
  throw new Error('Trusted client IP metadata is unavailable')
}

export function createRateLimitChecker(dependencies: RateLimitDependencies) {
  return async function checkRateLimit(
    request: NextRequest,
    { limit, windowSeconds }: RateLimitOptions,
  ): Promise<NextResponse | null> {
    try {
      const clientHash = createHash('sha256')
        .update(dependencies.clientIdentifier(request))
        .digest('hex')
      const key = `${request.nextUrl.pathname}:${clientHash}`
      const result = await dependencies.store().limit(key, limit, windowSeconds)
      if (result.timedOut) throw new Error('Shared rate-limit request timed out')

      if (result.success) return null

      const retryAfter = Math.max(1, Math.ceil((result.reset - (dependencies.now?.() ?? Date.now())) / 1000))
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Limit': String(limit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(result.reset / 1000)),
          },
        },
      )
    } catch {
      console.error('[RateLimit] Shared rate-limit service is unavailable.')
      return NextResponse.json(
        { success: false, code: 'rate_limit_unavailable', message: 'This request cannot be accepted right now.' },
        { status: 503 },
      )
    }
  }
}

const localStore = new LocalRateLimitStore()
let upstashStore: UpstashRateLimitStore | undefined

function resolveStore(): RateLimitStore {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim()
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim()

  if (url && token) {
    upstashStore ??= new UpstashRateLimitStore(new Redis({ url, token }))
    return upstashStore
  }

  if (process.env.NODE_ENV === 'development') return localStore
  throw new Error('Shared rate limiting is not configured')
}

const check = createRateLimitChecker({
  store: resolveStore,
  clientIdentifier: (request) => resolveClientIdentifier(request),
})

/**
 * Shared fixed-window limiter. Production fails closed with 503 if Upstash or
 * trusted platform IP metadata is unavailable; only local development uses memory.
 */
export async function checkRateLimit(
  request: NextRequest,
  options: RateLimitOptions,
): Promise<NextResponse | null> {
  return check(request, options)
}
