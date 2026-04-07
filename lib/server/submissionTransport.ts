import type { SubmissionChannel } from './localSubmissionLog'

export type DeliveryMode = 'local-fallback' | 'resend' | 'sendgrid' | 'mailchimp'

interface DeliveryRequest {
  channel: SubmissionChannel
  payload: Record<string, unknown>
}

function requestedProviderForChannel(channel: SubmissionChannel): DeliveryMode {
  const provider = process.env.SUBMISSION_PROVIDER?.toLowerCase().trim()

  if (channel === 'newsletter' && provider === 'mailchimp') {
    return 'mailchimp'
  }

  if (provider === 'resend') {
    return 'resend'
  }

  if (provider === 'sendgrid') {
    return 'sendgrid'
  }

  return 'local-fallback'
}

function providerIsConfigured(mode: DeliveryMode): boolean {
  if (mode === 'resend') {
    return Boolean(process.env.RESEND_API_KEY)
  }

  if (mode === 'sendgrid') {
    return Boolean(process.env.SENDGRID_API_KEY)
  }

  if (mode === 'mailchimp') {
    return Boolean(process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_AUDIENCE_ID)
  }

  return true
}

export async function deliverSubmission(request: DeliveryRequest): Promise<DeliveryMode> {
  const mode = requestedProviderForChannel(request.channel)

  // Keep provider wiring explicit while local development runs without network.
  if (mode === 'local-fallback' || !providerIsConfigured(mode)) {
    return 'local-fallback'
  }

  if (mode === 'resend') {
    // Future: call Resend API using RESEND_API_KEY.
    return 'resend'
  }

  if (mode === 'sendgrid') {
    // Future: call SendGrid API using SENDGRID_API_KEY.
    return 'sendgrid'
  }

  if (mode === 'mailchimp') {
    // Future: add contact to Mailchimp audience.
    return 'mailchimp'
  }

  return 'local-fallback'
}
