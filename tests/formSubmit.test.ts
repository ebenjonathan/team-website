import assert from 'node:assert/strict'
import test from 'node:test'
import { submitContactWithFormSubmit, type ContactSubmissionData } from '../lib/contact/formSubmit'

const submission: ContactSubmissionData = {
  name: 'QA Contact',
  email: 'qa@example.test',
  phone: '+263 77 000 0000',
  organisation: 'Example Organisation',
  country: 'Zimbabwe',
  requestType: 'general',
  message: 'A synthetic contact test with enough detail to validate delivery.',
  website: '',
}

test('FormSubmit receives the contact fields at the configured mailbox endpoint', async () => {
  let requestUrl = ''
  let requestBody: Record<string, unknown> = {}
  const result = await submitContactWithFormSubmit(submission, async (input, init) => {
    requestUrl = String(input)
    requestBody = JSON.parse(String(init?.body)) as Record<string, unknown>
    return new Response(JSON.stringify({ success: 'true', message: 'Form submitted successfully' }), { status: 200 })
  })

  assert.deepEqual(result, { success: true })
  assert.equal(requestUrl, 'https://formsubmit.co/ajax/info@team.co.zw')
  assert.deepEqual(requestBody, {
    name: submission.name,
    email: submission.email,
    _replyto: submission.email,
    phone: submission.phone,
    organisation: submission.organisation,
    country: submission.country,
    service_of_interest: 'General enquiry',
    message: submission.message,
    _subject: 'New enquiry (General enquiry) from QA Contact',
    _honey: '',
  })
})

test('FormSubmit activation responses are not reported as successful', async () => {
  const result = await submitContactWithFormSubmit(submission, async () =>
    new Response(JSON.stringify({ success: 'false', message: 'Please activate your email address' }), { status: 200 }),
  )

  assert.deepEqual(result, { success: false, reason: 'activation' })
})

test('FormSubmit provider rejection is not reported as successful', async () => {
  const result = await submitContactWithFormSubmit(submission, async () =>
    new Response(JSON.stringify({ success: false, message: 'Provider detail' }), { status: 200 }),
  )

  assert.deepEqual(result, { success: false, reason: 'delivery' })
})

test('FormSubmit throttling remains a user-visible failure', async () => {
  const result = await submitContactWithFormSubmit(submission, async () => new Response('', { status: 429 }))

  assert.deepEqual(result, { success: false, reason: 'rate' })
})
