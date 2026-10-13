import assert from 'node:assert/strict'
import test from 'node:test'
import { deliverSubmission } from '../lib/server/submissionTransport'

const environmentKeys = [
  'SUBMISSION_PROVIDER',
  'RESEND_API_KEY',
  'RESEND_FROM',
  'SENDGRID_API_KEY',
  'ADMIN_EMAIL',
  'ADMIN_NOTIFICATION_EMAIL',
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

test('event registration keeps the configured notification recipient and Resend route', async () => {
  await withEnvironment(
    {
      SUBMISSION_PROVIDER: 'resend',
      RESEND_API_KEY: 'fake-resend-key',
      RESEND_FROM: 'TEAM Consulting <no-reply@example.test>',
      ADMIN_EMAIL: 'admin-login@example.test',
      ADMIN_NOTIFICATION_EMAIL: 'events@example.test',
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
