import { randomBytes, timingSafeEqual } from 'crypto'
import { z } from 'zod'
import { SITE_URL } from '@/lib/seo/site'
import { configuredEmailProvider, sendEmailStrict, type EmailAttachment } from '@/lib/email'
import {
  availableDeliveryOptions,
  deliveryPromise,
  findProduct,
  findShopItem,
  shopSettings,
} from '@/lib/data/shop'
import { addWorkingDays, computeTotals, formatInvoiceNumber, round2 } from './money'
import { getRateStatus } from './fx'
import { shopStore } from './store'
import { renderInvoicePdf } from './invoicePdf'
import {
  adminNewOrderEmail,
  adminProofEmail,
  dispatchedEmail,
  orderReceivedEmail,
  paymentConfirmedEmail,
  paymentReminderEmail,
  proofReceivedEmail,
  type ShopEmail,
} from './emails'
import type { Order, OrderLine } from './types'

// ─── Validation ──────────────────────────────────────────────────────────────

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined))

export const checkoutSchema = z
  .object({
    items: z
      .array(z.object({ id: z.string().trim().min(1).max(80), quantity: z.number().int().min(1).max(shopSettings.maxQuantity) }))
      .min(1)
      .max(20),
    name: z.string().trim().min(2).max(120),
    company: optionalText(160),
    email: z.string().trim().email().max(320),
    phone: z.string().trim().min(7).max(40),
    taxNumber: optionalText(40),
    deliveryId: z.string().trim().min(1).max(40),
    address: optionalText(400),
    notes: optionalText(1000),
    acceptTerms: z.literal(true),
    /** Honeypot: real visitors never fill this in. */
    website: z.string().max(0).optional(),
  })
  .superRefine((v, ctx) => {
    const option = availableDeliveryOptions().find((o) => o.id === v.deliveryId)
    if (!option) ctx.addIssue({ code: 'custom', path: ['deliveryId'], message: 'Choose a delivery option.' })
    if (option?.needsAddress && (!v.address || v.address.length < 5)) {
      ctx.addIssue({ code: 'custom', path: ['address'], message: 'Enter a delivery address.' })
    }
  })

export type CheckoutInput = z.infer<typeof checkoutSchema>

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function adminEmailAddress(): string {
  return process.env.ADMIN_NOTIFICATION_EMAIL ?? process.env.ADMIN_EMAIL ?? shopSettings.seller.email
}

export function orderUrl(o: Pick<Order, 'invoiceNumber' | 'uploadToken'>): string {
  return `${SITE_URL}/shop/order/${encodeURIComponent(o.invoiceNumber)}?k=${encodeURIComponent(o.uploadToken)}`
}

export function invoicePdfPath(o: Pick<Order, 'invoiceNumber' | 'uploadToken'>): string {
  return `/api/shop/orders/${encodeURIComponent(o.invoiceNumber)}/invoice?k=${encodeURIComponent(o.uploadToken)}`
}

export const adminUrl = () => `${SITE_URL}/admin`

export function tokenMatches(order: Order, token: string | null | undefined): boolean {
  if (!token) return false
  const a = Buffer.from(order.uploadToken)
  const b = Buffer.from(token)
  return a.length === b.length && timingSafeEqual(a, b)
}

/** Loads an order only if the secret token from the customer's link matches. */
export async function getOrderForCustomer(invoiceNumber: string, token: string | null | undefined): Promise<Order | null> {
  if (!/^[A-Z0-9-]{4,40}$/.test(invoiceNumber)) return null
  const order = await shopStore().getOrder(invoiceNumber)
  return order && tokenMatches(order, token) ? order : null
}

const now = () => new Date().toISOString()
const log = (o: Order, event: string) => o.history.push({ at: now(), event })

/** Prices every line from the catalogue — never from what the browser sent. */
export function priceLines(items: CheckoutInput['items']): OrderLine[] {
  const merged = new Map<string, number>()
  for (const i of items) merged.set(i.id, Math.min(shopSettings.maxQuantity, (merged.get(i.id) ?? 0) + i.quantity))
  return [...merged].map(([id, quantity]) => {
    const item = findShopItem(id)
    if (!item) throw new UnknownItemError(id)
    const detail =
      item.kind === 'bundle'
        ? `Includes: ${item.items.map((p) => findProduct(p)?.name ?? p).join(', ')}`
        : undefined
    return { id, name: item.name, detail, quantity, unitPrice: item.price, lineTotal: round2(item.price * quantity) }
  })
}

export class UnknownItemError extends Error {
  constructor(id: string) {
    super(`Unknown item: ${id}`)
  }
}

async function send(o: Order, to: string, email: ShopEmail, attachments?: EmailAttachment[]) {
  try {
    await sendEmailStrict({ to, ...email, attachments, replyTo: to === o.customer.email ? shopSettings.seller.email : o.customer.email })
    return true
  } catch (error) {
    const message = `${now()} ${email.subject}: ${error instanceof Error ? error.message : String(error)}`
    console.error('[Shop] Email failed:', message)
    o.emailErrors.push(message)
    return false
  }
}

export function canSendEmail(): boolean {
  return !!configuredEmailProvider() || process.env.NODE_ENV !== 'production'
}

async function sendOrStub(o: Order, to: string, email: ShopEmail, attachments?: EmailAttachment[]) {
  if (!configuredEmailProvider()) {
    console.log('[Shop email stub]', email.subject, '->', to)
    return true
  }
  return send(o, to, email, attachments)
}

// ─── Create ──────────────────────────────────────────────────────────────────

export async function createOrder(input: CheckoutInput): Promise<Order> {
  const store = shopStore()
  const items = priceLines(input.items)
  const option = availableDeliveryOptions().find((o) => o.id === input.deliveryId)!
  const rate = await getRateStatus().catch(() => null)
  const zarPerUsd = rate?.inUse?.rate ?? null
  const totals = computeTotals(items, option.price ?? 0, shopSettings.tax.vatRatePercent, zarPerUsd)

  const created = new Date()
  const validUntil = new Date(created.getTime() + shopSettings.invoice.validForDays * 86_400_000)
  const seq = await store.nextSequence()

  const order: Order = {
    invoiceNumber: formatInvoiceNumber(shopSettings.invoice.numberPrefix, seq),
    createdAt: created.toISOString(),
    validUntil: validUntil.toISOString(),
    status: 'awaiting_payment',
    customer: {
      name: input.name,
      company: input.company,
      email: input.email,
      phone: input.phone,
      taxNumber: input.taxNumber,
    },
    delivery: {
      id: option.id,
      label: option.label,
      price: option.price ?? 0,
      address: option.needsAddress ? input.address : undefined,
      promise: deliveryPromise(option),
      workingDays: option.workingDays,
    },
    notes: input.notes,
    items,
    ...totals,
    vatRatePercent: shopSettings.tax.vatRatePercent,
    zarPerUsd: totals.totalZar ? zarPerUsd : null,
    uploadToken: randomBytes(24).toString('base64url'),
    emailErrors: [],
    history: [],
  }
  log(order, `Order placed${zarPerUsd ? ` (rand rate ${zarPerUsd}, ${rate?.inUse?.source})` : ' (no rand option)'}`)
  await store.saveOrder(order)

  const pdf = await renderInvoicePdf(order, orderUrl(order))
  const attachment: EmailAttachment = { filename: `${order.invoiceNumber}.pdf`, content: pdf, contentType: 'application/pdf' }
  const customerOk = await sendOrStub(order, order.customer.email, orderReceivedEmail(order, orderUrl(order)), [attachment])
  const adminOk = await sendOrStub(order, adminEmailAddress(), adminNewOrderEmail(order, adminUrl()), [attachment])
  log(order, `Invoice email ${customerOk ? 'sent' : 'FAILED'}; office alert ${adminOk ? 'sent' : 'FAILED'}`)
  await store.saveOrder(order)
  return order
}

// ─── Proof of payment ────────────────────────────────────────────────────────

export const PROOF_MAX_BYTES = 4 * 1024 * 1024 // Vercel caps request bodies at 4.5 MB
export const PROOF_TYPES: Record<string, string> = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpg',
  'image/png': 'png',
}

/** Emails the proof to the office (the email is the record), then updates the order. */
export async function recordProof(order: Order, file: { name: string; type: string; bytes: Uint8Array }): Promise<boolean> {
  const ext = PROOF_TYPES[file.type]
  const filename = `${order.invoiceNumber}-proof-of-payment.${ext}`
  const delivered = await sendOrStub(order, adminEmailAddress(), adminProofEmail(order, file.name, adminUrl()), [
    { filename, content: file.bytes, contentType: file.type },
  ])
  if (!delivered) {
    await shopStore().saveOrder(order)
    return false
  }
  order.proof = { filename: file.name.slice(0, 200), receivedAt: now() }
  if (order.status === 'awaiting_payment' || order.status === 'expired') order.status = 'proof_received'
  log(order, `Proof of payment uploaded (${file.name.slice(0, 80)})`)
  await sendOrStub(order, order.customer.email, proofReceivedEmail(order))
  await shopStore().saveOrder(order)
  return true
}

// ─── Admin actions ───────────────────────────────────────────────────────────

export const adminActionSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('markPaid'), account: z.enum(['zb-usd', 'fnb-zar']), amount: z.number().positive().max(1_000_000) }),
  z.object({ action: z.literal('dispatch'), note: z.string().trim().max(500).optional() }),
  z.object({ action: z.literal('delivered') }),
  z.object({ action: z.literal('cancel') }),
  z.object({ action: z.literal('notes'), notes: z.string().max(5000) }),
  z.object({ action: z.literal('resendInvoice') }),
])

export type AdminAction = z.infer<typeof adminActionSchema>

export class OrderActionError extends Error {}

export async function applyAdminAction(order: Order, action: AdminAction): Promise<Order> {
  const store = shopStore()
  switch (action.action) {
    case 'markPaid': {
      if (['paid', 'dispatched', 'delivered'].includes(order.status)) throw new OrderActionError('This order is already paid.')
      if (order.status === 'cancelled') throw new OrderActionError('This order was cancelled.')
      const settings = await store.getSettings()
      order.status = 'paid'
      order.paidAt = now()
      order.paidAccount = action.account
      order.amountReceived = action.amount
      order.expectedDeliveryDate = addWorkingDays(new Date(), order.delivery.workingDays, settings.holidays)
      log(order, `Marked as paid: ${action.amount} into ${action.account === 'zb-usd' ? 'ZB (US$)' : 'FNB (ZAR)'}`)
      await sendOrStub(order, order.customer.email, paymentConfirmedEmail(order))
      break
    }
    case 'dispatch': {
      if (!['paid', 'dispatched'].includes(order.status)) throw new OrderActionError('Mark the order as paid first.')
      order.status = 'dispatched'
      order.dispatchedAt = now()
      order.trackingNote = action.note || undefined
      log(order, 'Marked as dispatched')
      await sendOrStub(order, order.customer.email, dispatchedEmail(order))
      break
    }
    case 'delivered':
      order.status = 'delivered'
      order.deliveredAt = now()
      log(order, 'Marked as delivered')
      break
    case 'cancel':
      order.status = 'cancelled'
      order.cancelledAt = now()
      log(order, 'Cancelled')
      break
    case 'notes':
      order.adminNotes = action.notes
      break
    case 'resendInvoice': {
      const pdf = await renderInvoicePdf(order, orderUrl(order))
      const ok = await sendOrStub(order, order.customer.email, orderReceivedEmail(order, orderUrl(order)), [
        { filename: `${order.invoiceNumber}.pdf`, content: pdf, contentType: 'application/pdf' },
      ])
      log(order, `Invoice re-sent${ok ? '' : ' (FAILED)'}`)
      break
    }
  }
  await store.saveOrder(order)
  return order
}

// ─── Daily job ───────────────────────────────────────────────────────────────

const REMINDER_HOURS_BEFORE_EXPIRY = 48

/** Sends reminders two days before expiry and expires unpaid invoices. */
export async function runOrderHousekeeping(at = new Date()): Promise<{ reminded: string[]; expired: string[] }> {
  const store = shopStore()
  const reminded: string[] = []
  const expired: string[] = []
  for (const order of await store.listOrders()) {
    if (order.status !== 'awaiting_payment') continue
    const msLeft = Date.parse(order.validUntil) - at.getTime()
    if (msLeft <= 0) {
      order.status = 'expired'
      order.expiredAt = at.toISOString()
      log(order, 'Expired unpaid')
      await store.saveOrder(order)
      expired.push(order.invoiceNumber)
    } else if (!order.reminderSentAt && msLeft <= REMINDER_HOURS_BEFORE_EXPIRY * 3_600_000) {
      order.reminderSentAt = at.toISOString()
      await sendOrStub(order, order.customer.email, paymentReminderEmail(order, orderUrl(order)))
      log(order, 'Payment reminder sent')
      await store.saveOrder(order)
      reminded.push(order.invoiceNumber)
    }
  }
  return { reminded, expired }
}
