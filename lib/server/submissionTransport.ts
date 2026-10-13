import type { SubmissionChannel } from './localSubmissionLog'
import { enquiryTopicLabel } from '@/lib/data/enquiry'
import {
  sendEmail,
  sendEmailStrict,
  configuredEmailProvider,
  eventRegistrationTemplate,
  eventConfirmationTemplate,
  newsletterConfirmationTemplate,
} from '@/lib/email'

export type DeliveryMode = 'local-fallback' | 'web3forms' | 'resend' | 'sendgrid' | 'mailchimp'

interface DeliveryRequest {
  channel: SubmissionChannel
  payload: Record<string, unknown>
}

function resolveMode(channel: SubmissionChannel): DeliveryMode {
  if (channel === 'contact') {
    return process.env.WEB3FORMS_ACCESS_KEY?.trim() ? 'web3forms' : 'local-fallback'
  }

  const provider = process.env.SUBMISSION_PROVIDER?.toLowerCase().trim()
  if (channel === 'newsletter' && provider === 'mailchimp') return 'mailchimp'
  return configuredEmailProvider() ?? 'local-fallback'
}

export function deliveryMode(channel: SubmissionChannel): DeliveryMode {
  return resolveMode(channel)
}

const adminEmail = () =>
  process.env.ADMIN_NOTIFICATION_EMAIL ?? process.env.ADMIN_EMAIL ?? 'info@team.co.zw'
const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.teamadvisoryservices.com'

export async function deliverSubmission(request: DeliveryRequest): Promise<DeliveryMode> {
  const mode = resolveMode(request.channel)
  const p = request.payload

  if (request.channel === 'contact') {
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY?.trim()
    if (!accessKey) throw new Error('WEB3FORMS_ACCESS_KEY is not configured')

    const name = String(p.name ?? '')
    const email = String(p.email ?? '')
    const topic = enquiryTopicLabel(String(p.requestType ?? 'general'))
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      signal: AbortSignal.timeout(10000),
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `New enquiry (${topic}) from ${name}`,
        from_name: 'TEAM Consulting website',
        name,
        email,
        replyto: email,
        phone: String(p.phone ?? ''),
        organisation: String(p.organisation ?? ''),
        country: String(p.country ?? ''),
        enquiry_type: topic,
        message: String(p.message ?? ''),
        botcheck: '',
      }),
    })
    const result = await response.json().catch(() => null)
    if (!response.ok || result?.success !== true) {
      throw new Error(`Web3Forms rejected the enquiry (HTTP ${response.status})`)
    }
    return 'web3forms'
  }

  if (mode === 'local-fallback') return 'local-fallback'

  if (mode === 'resend' || mode === 'sendgrid') {
    // Event registration
    if (request.channel === 'event-registration') {
      const firstName = String(p.firstName ?? '')
      const lastName = String(p.lastName ?? '')
      const email = String(p.email ?? '')
      const eventTitle = String(p.eventTitle ?? 'TEAM Event')

      await sendEmailStrict({
        to: adminEmail(),
        subject: `Event Registration: ${eventTitle} - ${firstName} ${lastName}`,
        html: eventRegistrationTemplate({ firstName, lastName, email, eventTitle }),
      })
      await sendEmail({
        to: email,
        subject: `Registration Confirmed - ${eventTitle}`,
        html: eventConfirmationTemplate({ firstName, eventTitle }),
      })
    }

    // Newsletter subscription
    if (request.channel === 'newsletter') {
      const email = String(p.email ?? '')
      await sendEmail({
        to: email,
        subject: 'Welcome to the TEAM Consulting newsletter',
        html: newsletterConfirmationTemplate(email),
      })
    }

    // Diagnostic (email report handled separately in /api/diagnostic/submit)
    // Nothing extra needed here

    return mode
  }

  if (mode === 'mailchimp') {
    // Mailchimp API integration - add contact to audience
    const apiKey = process.env.MAILCHIMP_API_KEY
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID
    const dataCenter = apiKey?.split('-')[1] // e.g. "us21"

    if (apiKey && audienceId && dataCenter && request.channel === 'newsletter') {
      const email = String(p.email ?? '')
      const name = String(p.name ?? '')
      const [firstName, ...rest] = name.split(' ')

      await fetch(`https://${dataCenter}.api.mailchimp.com/3.0/lists/${audienceId}/members`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
          merge_fields: { FNAME: firstName ?? '', LNAME: rest.join(' ') },
        }),
      }).catch((err) => console.error('[Mailchimp] Subscribe error:', err))
    }

    return 'mailchimp'
  }

  return 'local-fallback'
}

