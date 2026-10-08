import type { SubmissionChannel } from './localSubmissionLog'
import { enquiryTopicLabel } from '@/lib/data/enquiry'
import {
  sendEmail,
  sendEmailStrict,
  configuredEmailProvider,
  contactEmailTemplate,
  contactConfirmationTemplate,
  eventRegistrationTemplate,
  eventConfirmationTemplate,
  newsletterConfirmationTemplate,
} from '@/lib/email'

export type DeliveryMode = 'local-fallback' | 'resend' | 'sendgrid' | 'mailchimp'

interface DeliveryRequest {
  channel: SubmissionChannel
  payload: Record<string, unknown>
}

function resolveMode(channel: SubmissionChannel): DeliveryMode {
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

  if (mode === 'local-fallback') return 'local-fallback'

  if (mode === 'resend' || mode === 'sendgrid') {
    // Contact form
    if (request.channel === 'contact') {
      const name = String(p.name ?? '')
      const email = String(p.email ?? '')
      const message = String(p.message ?? '')

      const topic = enquiryTopicLabel(String(p.requestType ?? 'general'))

      // The notification to the office IS the enquiry, so it must succeed.
      // If it fails this throws and the visitor is told to email us instead.
      await sendEmailStrict({
        to: adminEmail(),
        subject: `New enquiry (${topic}) from ${name}`,
        html: contactEmailTemplate({
          name,
          email,
          organisation: p.organisation as string | undefined,
          country: p.country as string | undefined,
          requestType: topic,
          message,
        }),
        replyTo: email,
      })

      // The confirmation to the visitor is a courtesy; a failure is only logged.
      await sendEmail({
        to: email,
        subject: 'We received your message - TEAM Consulting',
        html: contactConfirmationTemplate(name),
      })
    }

    // Event registration
    if (request.channel === 'event-registration') {
      const firstName = String(p.firstName ?? '')
      const lastName = String(p.lastName ?? '')
      const email = String(p.email ?? '')
      const eventTitle = String(p.eventTitle ?? 'TEAM Event')

      await Promise.allSettled([
        sendEmail({
          to: adminEmail(),
          subject: `Event Registration: ${eventTitle} - ${firstName} ${lastName}`,
          html: eventRegistrationTemplate({ firstName, lastName, email, eventTitle }),
        }),
        sendEmail({
          to: email,
          subject: `Registration Confirmed - ${eventTitle}`,
          html: eventConfirmationTemplate({ firstName, eventTitle }),
        }),
      ])
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

