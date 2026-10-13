import assert from 'node:assert/strict'
import test from 'node:test'
import { deliverSubmission, SubmissionDeliveryError } from '../lib/server/submissionTransport'

const environmentKeys = [
  'SUBMISSION_PROVIDER',
  'RESEND_API_KEY',
  'RESEND_FROM',
  'SENDGRID_API_KEY',
  'ADMIN_EMAIL',
  'ADMIN_NOTIFICATION_EMAIL',
  'WEB3FORMS_ACCESS_KEY',
] as const

async function withEnvironment(
  values: Partial<Record<(typeof environmentKeys)[number], string | undefined>>,
  action: () => Promise<void>,
) {
  const previous = Object.fromEntries(environmentKeys.map((key) => [key, process.env[key]]))
  const previousFetch = globalThis.fetch

  for (const key of environmentKeys) {
    const value = values[key]
    if (value === undefined) delete process.env[key]
    else process.env[key] = value
  }

  try {
    await action()
  } finally {
    for (const key of environmentKeys) {
      const value = previous[key]
      if (value === undefined) delete process.env[key]
      else process.env[key] = value
    }
    globalThis.fetch = previousFetch
  }
}

test('contact transport calls Web3Forms with its server key, independent of mail provider settings', async () => {
  await withEnvironment(
    {
      SUBMISSION_PROVIDER: 'sendgrid',
      SENDGRID_API_KEY: 'fake-sendgrid-key',
      WEB3FORMS_ACCESS_KEY: 'fake-web3forms-key',
      ADMIN_NOTIFICATION_EMAIL: 'events@example.test',
    },
    async () => {
      const calls: Array<{ url: string; body: Record<string, unknown> }> = []
      globalThis.fetch = async (input, init) => {
        calls.push({ url: String(input), body: JSON.parse(String(init?.body)) as Record<string, unknown> })
        return new Response(JSON.stringify({ success: true }), { status: 200 })
      }

      const mode = await deliverSubmission({
        channel: 'contact',
        payload: {
          name: 'QA Enquiry',
          email: 'qa@example.test',
          organisation: 'Example Org',
          country: 'Zimbabwe',
          requestType: 'general',
          message: 'A sufficiently long mock-only contact message.',
        },
      })

      assert.equal(mode, 'web3forms')
      assert.equal(calls.length, 1)
      assert.equal(calls[0].url, 'https://api.web3forms.com/submit')
      assert.equal(calls[0].body.access_key, 'fake-web3forms-key')
      assert.equal(calls[0].body.email, 'qa@example.test')
      assert.equal(calls[0].body.message, 'A sufficiently long mock-only contact message.')
    },
  )
})

test('event registration keeps the configured notification recipient and Resend route', async () => {
  await withEnvironment(
    {
      SUBMISSION_PROVIDER: 'resend',
      RESEND_API_KEY: 'fake-resend-key',
      RESEND_FROM: 'TEAM Consulting <no-reply@example.test>',
      ADMIN_EMAIL: 'admin-login@example.test',
      ADMIN_NOTIFICATION_EMAIL: 'events@example.test',
      WEB3FORMS_ACCESS_KEY: 'fake-web3forms-key',
    },
    async () => {
      const calls: Array<{ url: string; body: Record<string, unknown> }> = []
      globalThis.fetch = async (input, init) => {
        calls.push({ url: String(input), body: JSON.parse(String(init?.body)) as Record<string, unknown> })
        return new Response(JSON.stringify({ id: 'mock-id' }), { status: 202 })
      }

      const mode = await deliverSubmission({
        channel: 'event-registration',
        payload: {
          firstName: 'QA',
          lastName: 'Attendee',
          email: 'attendee@example.test',
          eventTitle: 'Mock Event',
        },
      })

      assert.equal(mode, 'resend')
      assert.equal(calls.length, 2)
      assert.equal(calls[0].url, 'https://api.resend.com/emails')
      assert.deepEqual(calls[0].body.to, ['events@example.test'])
      assert.deepEqual(calls[1].body.to, ['attendee@example.test'])
    },
  )
})

test('a mocked Web3Forms 403 is surfaced as a generic delivery failure', async () => {
  await withEnvironment({ WEB3FORMS_ACCESS_KEY: 'fake-web3forms-key' }, async () => {
    globalThis.fetch = async () => new Response(JSON.stringify({ success: false, message: 'private provider detail' }), { status: 403 })

    await assert.rejects(
      () => deliverSubmission({ channel: 'contact', payload: { name: 'QA', email: 'qa@example.test' } }),
      (error: unknown) => error instanceof SubmissionDeliveryError && error.kind === 'rejected',
    )
  })
})

test('a mocked Web3Forms 429 is classified without forwarding provider details', async () => {
  await withEnvironment({ WEB3FORMS_ACCESS_KEY: 'fake-web3forms-key' }, async () => {
    globalThis.fetch = async () => new Response('private provider detail', { status: 429, headers: { 'Retry-After': '17' } })

    await assert.rejects(
      () => deliverSubmission({ channel: 'contact', payload: { name: 'QA', email: 'qa@example.test' } }),
      (error: unknown) => error instanceof SubmissionDeliveryError && error.kind === 'rate_limited' && error.retryAfterSeconds === 17,
    )
  })
})

test('Web3Forms must affirm success in its response body', async () => {
  await withEnvironment({ WEB3FORMS_ACCESS_KEY: 'fake-web3forms-key' }, async () => {
    globalThis.fetch = async () => new Response(JSON.stringify({ success: false, message: 'private provider detail' }), { status: 200 })

    await assert.rejects(
      () => deliverSubmission({ channel: 'contact', payload: { name: 'QA', email: 'qa@example.test' } }),
      (error: unknown) => error instanceof SubmissionDeliveryError && error.kind === 'rejected',
    )
  })
})

test('Web3Forms timeouts are classified without exposing the underlying error', async () => {
  await withEnvironment({ WEB3FORMS_ACCESS_KEY: 'fake-web3forms-key' }, async () => {
    globalThis.fetch = async () => { throw Object.assign(new Error('secret-bearing timeout detail'), { name: 'TimeoutError' }) }

    await assert.rejects(
      () => deliverSubmission({ channel: 'contact', payload: { name: 'QA', email: 'qa@example.test' } }),
      (error: unknown) => error instanceof SubmissionDeliveryError && error.kind === 'timeout',
    )
  })
})