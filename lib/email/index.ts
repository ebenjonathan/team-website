// Email utility — configure your provider in .env.local
// Supports: Nodemailer (SMTP), Resend, SendGrid

interface EmailPayload {
  to: string
  subject: string
  html: string
  replyTo?: string
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  // TODO: Swap this stub for your chosen provider.
  // Example — Nodemailer SMTP:
  //
  // import nodemailer from 'nodemailer'
  // const transporter = nodemailer.createTransport({
  //   host: process.env.SMTP_HOST,
  //   port: Number(process.env.SMTP_PORT),
  //   auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  // })
  // await transporter.sendMail({
  //   from: process.env.SMTP_FROM,
  //   ...payload,
  // })

  console.log('[Email]', payload.subject, '→', payload.to)
}

export function contactEmailTemplate(data: {
  name: string
  email: string
  subject: string
  message: string
}): string {
  return `
    <h2 style="color:#172624">New Contact Form Submission</h2>
    <p><strong>From:</strong> ${data.name} (${data.email})</p>
    <p><strong>Subject:</strong> ${data.subject}</p>
    <p><strong>Message:</strong></p>
    <p style="white-space:pre-wrap">${data.message}</p>
  `
}

export function subscribeEmailTemplate(email: string): string {
  return `
    <h2 style="color:#172624">New Newsletter Subscriber</h2>
    <p><strong>Email:</strong> ${email}</p>
  `
}

export function eventRegistrationEmailTemplate(data: {
  name: string
  email: string
  eventTitle: string
}): string {
  return `
    <h2 style="color:#172624">New Event Registration</h2>
    <p><strong>Event:</strong> ${data.eventTitle}</p>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
  `
}
