/**
 * Email delivery via Resend (https://resend.com).
 * Set RESEND_API_KEY and RESEND_FROM in your environment.
 * Falls back to console logging in dev / when key is absent.
 */

export interface EmailPayload {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
  cc?: string | string[]
}

const MAX_RETRIES = 3
const RETRY_DELAY_MS = 800

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

async function sendViaResend(payload: EmailPayload, attempt = 1): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM ?? 'TEAM Consulting <no-reply@team.co.zw>'

  if (!apiKey) {
    console.log('[Email:stub]', payload.subject, '->', payload.to)
    return
  }

  const body = {
    from,
    to: Array.isArray(payload.to) ? payload.to : [payload.to],
    subject: payload.subject,
    html: payload.html,
    ...(payload.replyTo ? { reply_to: payload.replyTo } : {}),
    ...(payload.cc ? { cc: Array.isArray(payload.cc) ? payload.cc : [payload.cc] } : {}),
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (res.ok) return

  const errorText = await res.text().catch(() => res.statusText)

  if (attempt < MAX_RETRIES) {
    console.warn(`[Email] Attempt ${attempt} failed (${res.status}). Retrying in ${RETRY_DELAY_MS * attempt}ms...`)
    await sleep(RETRY_DELAY_MS * attempt)
    return sendViaResend(payload, attempt + 1)
  }

  // All retries exhausted - log and re-throw so callers can handle
  console.error(`[Email] All ${MAX_RETRIES} attempts failed for "${payload.subject}":`, errorText)
  throw new Error(`Email delivery failed after ${MAX_RETRIES} attempts: ${errorText}`)
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  try {
    await sendViaResend(payload)
  } catch (error) {
    // Log but do not crash the calling route - the submission is already saved locally
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
          <tr><td style="padding:8px 0;${labelStyle}">Name</td><td style="padding:8px 0;">${data.name}</td></tr>
          <tr><td style="padding:8px 0;${labelStyle}">Email</td><td style="padding:8px 0;"><a href="mailto:${data.email}" style="${accentStyle}">${data.email}</a></td></tr>
          ${data.organisation ? `<tr><td style="padding:8px 0;${labelStyle}">Organisation</td><td style="padding:8px 0;">${data.organisation}</td></tr>` : ''}
          ${data.country ? `<tr><td style="padding:8px 0;${labelStyle}">Country</td><td style="padding:8px 0;">${data.country}</td></tr>` : ''}
          ${data.requestType ? `<tr><td style="padding:8px 0;${labelStyle}">Request Type</td><td style="padding:8px 0;">${data.requestType}</td></tr>` : ''}
        </table>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;" />
        <p style="${labelStyle}">Message:</p>
        <p style="white-space:pre-wrap;background:#f7fbfa;padding:16px;border-radius:6px;border-left:4px solid #09947d;">${data.message}</p>
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
        <p>Hi ${name},</p>
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
          <tr><td style="padding:8px 0;${labelStyle}">Event</td><td style="padding:8px 0;${accentStyle}">${data.eventTitle}</td></tr>
          ${data.eventDate ? `<tr><td style="padding:8px 0;${labelStyle}">Date</td><td style="padding:8px 0;">${data.eventDate}</td></tr>` : ''}
          <tr><td style="padding:8px 0;${labelStyle}">Name</td><td style="padding:8px 0;">${data.firstName} ${data.lastName}</td></tr>
          <tr><td style="padding:8px 0;${labelStyle}">Email</td><td style="padding:8px 0;"><a href="mailto:${data.email}" style="${accentStyle}">${data.email}</a></td></tr>
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
        <p>Hi ${data.firstName},</p>
        <p>You're registered for <strong style="${accentStyle}">${data.eventTitle}</strong>${data.eventDate ? ` on <strong>${data.eventDate}</strong>` : ''}.</p>
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
        <p>You'll receive insights, case studies, and event invitations directly to <strong>${email}</strong>.</p>
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
        <p>Hi ${data.name},</p>
        <p>Here is your diagnostic summary for <strong>${data.businessName}</strong>:</p>

        <div style="background:#f7fbfa;border-radius:8px;padding:20px;margin:16px 0;border-left:4px solid #09947d;">
          <p style="margin:0 0 8px;${labelStyle}">Overall Score</p>
          <p style="margin:0;font-size:32px;font-weight:700;${accentStyle}">${data.score}%</p>
          <p style="margin:4px 0 0;font-size:14px;color:#666;">${data.category}</p>
        </div>

        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <tr><td style="padding:8px 0;${labelStyle}">Est. Monthly Loss</td><td style="padding:8px 0;color:#b91c1c;font-weight:600;">$${data.monthlyLoss.toLocaleString()}</td></tr>
          <tr><td style="padding:8px 0;${labelStyle}">Est. Annual Loss</td><td style="padding:8px 0;color:#b91c1c;font-weight:600;">$${data.annualLoss.toLocaleString()}</td></tr>
        </table>

        <p style="${labelStyle}">Quick Win:</p>
        <p style="background:#f7fbfa;padding:12px 16px;border-radius:6px;">${data.quickWin}</p>

        <div style="margin-top:24px;text-align:center;">
          <a href="${data.siteUrl}/contact-us" style="display:inline-block;background:#09947d;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:700;">Book a Strategy Call</a>
        </div>
      </div>
    </div>`
}

// Legacy compat - kept for api/diagnostic/submit/route.ts
export { contactEmailTemplate as subscribeEmailTemplate }
export { contactEmailTemplate as eventRegistrationEmailTemplate }

