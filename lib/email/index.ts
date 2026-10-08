/**
 * Email delivery via Resend (https://resend.com) or SendGrid.
 * Set SUBMISSION_PROVIDER plus RESEND_API_KEY (or SENDGRID_API_KEY) and
 * RESEND_FROM in your environment. With no key, emails are logged to the console.
 */

export interface EmailPayload {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
  cc?: string | string[]
}

const MAX_RETRIES = 2
const RETRY_DELAY_MS = 800
/** Give up on a single provider request after this long, so visitors are never left waiting. */
const REQUEST_TIMEOUT_MS = 8000

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

/** Escape visitor-supplied text before it goes into an HTML email. */
export function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export type EmailProvider = 'resend' | 'sendgrid'

/** Which provider is configured, or null when none is. */
export function configuredEmailProvider(): EmailProvider | null {
  const wanted = process.env.SUBMISSION_PROVIDER?.toLowerCase().trim()
  if (wanted === 'sendgrid' && process.env.SENDGRID_API_KEY) return 'sendgrid'
  if (wanted === 'resend' && process.env.RESEND_API_KEY) return 'resend'
  if (process.env.RESEND_API_KEY) return 'resend'
  if (process.env.SENDGRID_API_KEY) return 'sendgrid'
  return null
}

function fromAddress() {
  return process.env.RESEND_FROM ?? process.env.EMAIL_FROM ?? 'TEAM Consulting <no-reply@team.co.zw>'
}

function toList(v: string | string[]) {
  return Array.isArray(v) ? v : [v]
}

async function sendOnce(provider: EmailProvider, payload: EmailPayload): Promise<Response> {
  if (provider === 'resend') {
    return fetch('https://api.resend.com/emails', {
      method: 'POST',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress(),
        to: toList(payload.to),
        subject: payload.subject,
        html: payload.html,
        ...(payload.replyTo ? { reply_to: payload.replyTo } : {}),
        ...(payload.cc ? { cc: toList(payload.cc) } : {}),
      }),
    })
  }

  // SendGrid v3 mail send
  const from = fromAddress()
  const match = from.match(/^(.*)<(.+)>$/)
  return fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: {
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: toList(payload.to).map((email) => ({ email })),
          ...(payload.cc ? { cc: toList(payload.cc).map((email) => ({ email })) } : {}),
        },
      ],
      from: match ? { email: match[2].trim(), name: match[1].trim() } : { email: from },
      ...(payload.replyTo ? { reply_to: { email: payload.replyTo } } : {}),
      subject: payload.subject,
      content: [{ type: 'text/html', value: payload.html }],
    }),
  })
}

/**
 * Sends an email and throws if it could not be delivered. Use this when the
 * email IS the record of the submission (e.g. a new enquiry to the office).
 */
export async function sendEmailStrict(payload: EmailPayload): Promise<void> {
  const provider = configuredEmailProvider()
  if (!provider) throw new Error('No email provider is configured')

  let lastError = ''
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await sendOnce(provider, payload)
      if (res.ok) return
      lastError = `${res.status} ${await res.text().catch(() => res.statusText)}`
      // 4xx other than rate limiting will not succeed on retry
      if (res.status < 500 && res.status !== 429) break
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error)
    }
    if (attempt < MAX_RETRIES) await sleep(RETRY_DELAY_MS * attempt)
  }
  throw new Error(`[Email:${provider}] delivery failed for "${payload.subject}": ${lastError}`)
}

/**
 * Best-effort send: logs failures instead of throwing. Use for courtesy emails
 * (confirmations, welcomes) where a failure should not block the visitor.
 */
export async function sendEmail(payload: EmailPayload): Promise<void> {
  if (!configuredEmailProvider()) {
    console.log('[Email:stub]', payload.subject, '->', payload.to)
    return
  }
  try {
    await sendEmailStrict(payload)
  } catch (error) {
    console.error('[Email] Delivery error (suppressed):', error)
  }
}

// HTML templates

const baseStyle = `
  font-family: 'Open Sans', Arial, sans-serif;
  color: #444;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
`
const headerStyle = `
  background: #172624;
  padding: 24px 32px;
  border-radius: 8px 8px 0 0;
`
const bodyStyle = `
  background: #fff;
  padding: 32px;
  border: 1px solid #e5e7eb;
  border-radius: 0 0 8px 8px;
`
const labelStyle = `font-weight: 600; color: #172624;`
const accentStyle = `color: #09947d; font-weight: 700;`

export function contactEmailTemplate(data: {
  name: string
  email: string
  organisation?: string
  country?: string
  requestType?: string
  message: string
}): string {
  return `
    <div style="${baseStyle}">
      <div style="${headerStyle}">
        <p style="margin:0;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:#09947d;font-weight:700;">TEAM Consulting</p>
        <h1 style="margin:8px 0 0;font-size:22px;color:#fff;">New Contact Form Submission</h1>
      </div>
      <div style="${bodyStyle}">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;${labelStyle}">Name</td><td style="padding:8px 0;">${esc(data.name)}</td></tr>
          <tr><td style="padding:8px 0;${labelStyle}">Email</td><td style="padding:8px 0;"><a href="mailto:${encodeURIComponent(data.email)}" style="${accentStyle}">${esc(data.email)}</a></td></tr>
          ${data.organisation ? `<tr><td style="padding:8px 0;${labelStyle}">Organisation</td><td style="padding:8px 0;">${esc(data.organisation)}</td></tr>` : ''}
          ${data.country ? `<tr><td style="padding:8px 0;${labelStyle}">Country</td><td style="padding:8px 0;">${esc(data.country)}</td></tr>` : ''}
          ${data.requestType ? `<tr><td style="padding:8px 0;${labelStyle}">Request Type</td><td style="padding:8px 0;">${esc(data.requestType)}</td></tr>` : ''}
        </table>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;" />
        <p style="${labelStyle}">Message:</p>
        <p style="white-space:pre-wrap;background:#f7fbfa;padding:16px;border-radius:6px;border-left:4px solid #09947d;">${esc(data.message)}</p>
      </div>
    </div>`
}

export function contactConfirmationTemplate(name: string): string {
  return `
    <div style="${baseStyle}">
      <div style="${headerStyle}">
        <p style="margin:0;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:#09947d;font-weight:700;">TEAM Consulting</p>
        <h1 style="margin:8px 0 0;font-size:22px;color:#fff;">We received your message</h1>
      </div>
      <div style="${bodyStyle}">
        <p>Hi ${esc(name)},</p>
        <p>Thank you for reaching out. A member of our team will review your inquiry and get back to you within 1-2 business days.</p>
        <p style="${accentStyle}">TEAM Consulting<br/>info@team.co.zw | +263 77 220 2290</p>
      </div>
    </div>`
}

export function eventRegistrationTemplate(data: {
  firstName: string
  lastName: string
  email: string
  eventTitle: string
  eventDate?: string
}): string {
  return `
    <div style="${baseStyle}">
      <div style="${headerStyle}">
        <p style="margin:0;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:#09947d;font-weight:700;">TEAM Consulting</p>
        <h1 style="margin:8px 0 0;font-size:22px;color:#fff;">New Event Registration</h1>
      </div>
      <div style="${bodyStyle}">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;${labelStyle}">Event</td><td style="padding:8px 0;${accentStyle}">${esc(data.eventTitle)}</td></tr>
          ${data.eventDate ? `<tr><td style="padding:8px 0;${labelStyle}">Date</td><td style="padding:8px 0;">${esc(data.eventDate)}</td></tr>` : ''}
          <tr><td style="padding:8px 0;${labelStyle}">Name</td><td style="padding:8px 0;">${esc(data.firstName)} ${esc(data.lastName)}</td></tr>
          <tr><td style="padding:8px 0;${labelStyle}">Email</td><td style="padding:8px 0;"><a href="mailto:${encodeURIComponent(data.email)}" style="${accentStyle}">${esc(data.email)}</a></td></tr>
        </table>
      </div>
    </div>`
}

export function eventConfirmationTemplate(data: {
  firstName: string
  eventTitle: string
  eventDate?: string
}): string {
  return `
    <div style="${baseStyle}">
      <div style="${headerStyle}">
        <p style="margin:0;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:#09947d;font-weight:700;">TEAM Consulting</p>
        <h1 style="margin:8px 0 0;font-size:22px;color:#fff;">Registration Confirmed</h1>
      </div>
      <div style="${bodyStyle}">
        <p>Hi ${esc(data.firstName)},</p>
        <p>You're registered for <strong style="${accentStyle}">${esc(data.eventTitle)}</strong>${data.eventDate ? ` on <strong>${esc(data.eventDate)}</strong>` : ''}.</p>
        <p>We'll send you further details closer to the event. See you there!</p>
        <p style="${accentStyle}">TEAM Consulting<br/>info@team.co.zw</p>
      </div>
    </div>`
}

export function newsletterConfirmationTemplate(email: string): string {
  return `
    <div style="${baseStyle}">
      <div style="${headerStyle}">
        <p style="margin:0;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:#09947d;font-weight:700;">TEAM Consulting</p>
        <h1 style="margin:8px 0 0;font-size:22px;color:#fff;">You're subscribed</h1>
      </div>
      <div style="${bodyStyle}">
        <p>Thank you for subscribing to the TEAM Consulting newsletter.</p>
        <p>You'll receive insights, case studies, and event invitations directly to <strong>${esc(email)}</strong>.</p>
        <p>To unsubscribe, reply to this email with "Unsubscribe" in the subject line.</p>
        <p style="${accentStyle}">TEAM Consulting<br/>info@team.co.zw</p>
      </div>
    </div>`
}

export function diagnosticReportTemplate(data: {
  name: string
  businessName: string
  score: number
  category: string
  monthlyLoss: number
  annualLoss: number
  quickWin: string
  siteUrl: string
}): string {
  return `
    <div style="${baseStyle}">
      <div style="${headerStyle}">
        <p style="margin:0;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:#09947d;font-weight:700;">TEAM Consulting</p>
        <h1 style="margin:8px 0 0;font-size:22px;color:#fff;">Your GREATER Diagnostic Report</h1>
      </div>
      <div style="${bodyStyle}">
        <p>Hi ${esc(data.name)},</p>
        <p>Here is your diagnostic summary for <strong>${esc(data.businessName)}</strong>:</p>

        <div style="background:#f7fbfa;border-radius:8px;padding:20px;margin:16px 0;border-left:4px solid #09947d;">
          <p style="margin:0 0 8px;${labelStyle}">Overall Score</p>
          <p style="margin:0;font-size:32px;font-weight:700;${accentStyle}">${esc(data.score)}%</p>
          <p style="margin:4px 0 0;font-size:14px;color:#666;">${esc(data.category)}</p>
        </div>

        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <tr><td style="padding:8px 0;${labelStyle}">Est. Monthly Loss</td><td style="padding:8px 0;color:#b91c1c;font-weight:600;">$${data.monthlyLoss.toLocaleString()}</td></tr>
          <tr><td style="padding:8px 0;${labelStyle}">Est. Annual Loss</td><td style="padding:8px 0;color:#b91c1c;font-weight:600;">$${data.annualLoss.toLocaleString()}</td></tr>
        </table>

        <p style="${labelStyle}">Quick Win:</p>
        <p style="background:#f7fbfa;padding:12px 16px;border-radius:6px;">${esc(data.quickWin)}</p>

        <div style="margin-top:24px;text-align:center;">
          <a href="${esc(data.siteUrl)}/contact-us" style="display:inline-block;background:#09947d;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:700;">Book a Strategy Call</a>
        </div>
      </div>
    </div>`
}

// Legacy compat - kept for api/diagnostic/submit/route.ts
export { contactEmailTemplate as subscribeEmailTemplate }
export { contactEmailTemplate as eventRegistrationEmailTemplate }

