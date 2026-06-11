import type { SubmissionChannel } from './localSubmissionLog'
import {
  sendEmail,
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
  if (provider === 'resend' && process.env.RESEND_API_KEY) return 'resend'
  if (provider === 'sendgrid' && process.env.SENDGRID_API_KEY) return 'sendgrid'

  // Implicit resend: if no SUBMISSION_PROVIDER is set but RESEND_API_KEY exists, use it
  if (process.env.RESEND_API_KEY) return 'resend'

  return 'local-fallback'
}

const adminEmail = () =>
  process.env.ADMIN_NOTIFICATION_EMAIL ?? process.env.ADMIN_EMAIL ?? 'info@team.co.zw'
const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.teamadvisory.com'

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

      await Promise.allSettled([
        // Notification to admin
        sendEmail({
          to: adminEmail(),
          subject: `New Contact Inquiry from ${name}`,
          html: contactEmailTemplate({
            name,
            email,
            organisation: p.organisation as string | undefined,
            country: p.country as string | undefined,
            requestType: p.requestType as string | undefined,
            message,
          }),
          replyTo: email,
        }),
        // Confirmation to submitter
        sendEmail({
          to: email,
          subject: 'We received your message - TEAM Consulting',
          html: contactConfirmationTemplate(name),
        }),
      ])
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

