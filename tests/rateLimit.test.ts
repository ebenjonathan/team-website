import assert from 'node:assert/strict'
import test from 'node:test'
import { NextRequest } from 'next/server'
import {
  createRateLimitChecker,
  resolveClientIdentifier,
  type RateLimitResult,
  type RateLimitStore,
} from '../lib/server/rateLimit'

class SharedMockStore implements RateLimitStore {
  private readonly counts = new Map<string, { count: number; reset: number }>()

  async limit(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
    const now = Date.now()
    let record = this.counts.get(key)
    if (!record || record.reset <= now) {
      record = { count: 0, reset: now + windowSeconds * 1000 }
      this.counts.set(key, record)
    }

    record.count += 1
    return {
      success: record.count <= limit,
      remaining: Math.max(0, limit - record.count),
      reset: record.reset,
    }
  }
}

function request(headers: Record<string, string> = {}) {
  return new NextRequest('https://example.test/api/event-registration', { headers })
}

function checker(store: RateLimitStore) {
  return createRateLimitChecker({
    store: () => store,
    clientIdentifier: (incoming) => resolveClientIdentifier(incoming, { NODE_ENV: 'development' }),
  })
}

test('allows requests below the limit and returns 429 with retry headers after it', async () => {
  const check = checker(new SharedMockStore())
  const options = { limit: 2, windowSeconds: 60 }

  assert.equal(await check(request(), options), null)
  assert.equal(await check(request(), options), null)
  const limited = await check(request(), options)

  assert.equal(limited?.status, 429)
  assert.equal(limited?.headers.get('Retry-After'), '60')
  assert.equal(limited?.headers.get('X-RateLimit-Limit'), '2')
  assert.equal(limited?.headers.get('X-RateLimit-Remaining'), '0')
})

test('concurrent requests cannot exceed the atomic store limit', async () => {
  const check = checker(new SharedMockStore())
  const responses = await Promise.all(
    Array.from({ length: 40 }, () => check(request(), { limit: 5, windowSeconds: 60 })),
  )

  assert.equal(responses.filter((response) => response === null).length, 5)
  assert.equal(responses.filter((response) => response?.status === 429).length, 35)
})

test('separate checker instances share limits through the same persistent store', async () => {
  const store = new SharedMockStore()
  const firstInstance = checker(store)
  const secondInstance = checker(store)
  const restartedInstance = checker(store)
  const options = { limit: 3, windowSeconds: 60 }

  assert.equal(await firstInstance(request(), options), null)
  assert.equal(await firstInstance(request(), options), null)
  assert.equal(await secondInstance(request(), options), null)
  assert.equal((await restartedInstance(request(), options))?.status, 429)
})

test('caller-controlled forwarding headers do not create new local identities', async () => {
  const check = checker(new SharedMockStore())
  const statuses: Array<number | null> = []

  for (let index = 1; index <= 6; index += 1) {
    const response = await check(
      request({
        'X-Forwarded-For': `198.51.100.${index}`,
        'X-Real-IP': `203.0.113.${index}`,
      }),
      { limit: 5, windowSeconds: 60 },
    )
    statuses.push(response?.status ?? null)
  }

  assert.deepEqual(statuses, [null, null, null, null, null, 429])
})

test('missing trusted Vercel IP metadata fails closed', async () => {
  assert.throws(
    () => resolveClientIdentifier(request({ 'X-Forwarded-For': '198.51.100.10' }), { VERCEL: '1' }),
    /Trusted Vercel client IP is unavailable/,
  )
})

test('Vercel identity ignores caller-controlled forwarding headers', async () => {
  const store = new SharedMockStore()
  const vercelCheck = createRateLimitChecker({
    store: () => store,
    clientIdentifier: (incoming) => resolveClientIdentifier(incoming, { VERCEL: '1' }),
  })
  const options = { limit: 1, windowSeconds: 60 }

  assert.equal(
    await vercelCheck(
      request({ 'x-vercel-forwarded-for': '198.51.100.10', 'x-forwarded-for': '203.0.113.10' }),
      options,
    ),
    null,
  )
  assert.equal(
    (await vercelCheck(
      request({ 'x-vercel-forwarded-for': '198.51.100.10', 'x-forwarded-for': '203.0.113.11', 'x-real-ip': '203.0.113.11' }),
      options,
    ))?.status,
    429,
  )
})

test('store outages return a generic 503 without leaking provider errors', async () => {
  const check = createRateLimitChecker({
    store: () => ({ limit: async () => { throw new Error('private redis token') } }),
    clientIdentifier: () => 'local-test',
  })
  const response = await check(request(), { limit: 5, windowSeconds: 60 })

  assert.equal(response?.status, 503)
  const body = await response?.text()
  assert.match(body ?? '', /rate_limit_unavailable/)
  assert.doesNotMatch(body ?? '', /private redis token/)
})

test('Upstash timeout responses fail closed instead of allowing the request', async () => {
  const check = createRateLimitChecker({
    store: () => ({
      limit: async () => ({ success: true, remaining: 5, reset: Date.now() + 60000, timedOut: true }),
    }),
    clientIdentifier: () => 'local-test',
  })
  const response = await check(request(), { limit: 5, windowSeconds: 60 })

  assert.equal(response?.status, 503)
  assert.match(await response?.text() ?? '', /rate_limit_unavailable/)
})