import { esc } from '@/lib/email'
import { shopSettings } from '@/lib/data/shop'
import { formatUsd, formatZar, longDate, shortDate } from './money'
import type { Order } from './types'

// Order emails. Every value that came from a visitor goes through esc().

const PRIMARY = '#09947d'
const DEEP = '#172624'

export interface ShopEmail {
  subject: string
  html: string
}

function layout(title: string, body: string): string {
  const { seller } = shopSettings
  return `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:#f3f1ed;font-family:Arial,Helvetica,sans-serif;color:#1d1d1b;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f1ed;padding:24px 12px;"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-top:4px solid ${PRIMARY};">
<tr><td style="padding:24px 32px 4px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;color:${DEEP};letter-spacing:0.4px;">TEAM CONSULTING · CULTURE PRACTICE</td></tr>
<tr><td style="padding:12px 32px 28px;font-size:15px;line-height:1.55;">${body}</td></tr>
<tr><td style="padding:18px 32px 26px;border-top:1px solid #e3e1dc;font-size:12px;line-height:1.5;color:#5c5c58;">
${esc(seller.legalName)} t/a ${esc(seller.tradingName)}<br>${esc(seller.email)} · ${esc(seller.phones.join(' · '))}<br>${esc(seller.website)}
</td></tr></table></td></tr></table></body></html>`
}

const button = (href: string, label: string) =>
  `<p style="margin:22px 0;"><a href="${esc(href)}" style="background:${PRIMARY};color:#ffffff;text-decoration:none;padding:12px 20px;font-weight:bold;display:inline-block;border-radius:4px;">${esc(label)}</a></p>`

const firstName = (o: Order) => esc(o.customer.name.trim().split(/\s+/)[0] || o.customer.name)

function itemsTable(o: Order): string {
  const rows = o.items
    .map(
      (i) =>
        `<tr><td style="padding:6px 0;border-bottom:1px solid #e3e1dc;">${i.quantity} × ${esc(i.name)}</td><td align="right" style="padding:6px 0;border-bottom:1px solid #e3e1dc;white-space:nowrap;">${formatUsd(i.lineTotal)}</td></tr>`,
    )
    .join('')
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;margin:8px 0 4px;border-collapse:collapse;">
${rows}
<tr><td style="padding:6px 0;">${esc(o.delivery.label)}</td><td align="right" style="padding:6px 0;">${formatUsd(o.deliveryFee)}</td></tr>
<tr><td style="padding:8px 0;font-weight:bold;border-top:1px solid #1d1d1b;">Total due (incl. VAT)</td><td align="right" style="padding:8px 0;font-weight:bold;border-top:1px solid #1d1d1b;white-space:nowrap;">${formatUsd(o.total)}</td></tr>
<tr><td style="padding:0 0 6px;font-size:12px;color:#5c5c58;">Includes VAT at ${o.vatRatePercent}%</td><td align="right" style="padding:0 0 6px;font-size:12px;color:#5c5c58;">${formatUsd(o.vat)}</td></tr>
</table>`
}

function bankBlock(o: Order): string {
  const zb = shopSettings.banks.find((b) => b.id === 'zb-usd')!
  const fnb = shopSettings.banks.find((b) => b.id === 'fnb-zar')!
  const zar =
    o.totalZar && o.zarPerUsd
      ? `<tr><td style="padding:12px 16px;line-height:1.65;">
<strong style="color:${PRIMARY};">South Africa · pay ${formatZar(o.totalZar)}</strong><br>
${esc(fnb.bankName)} · branch code ${esc(fnb.branchCode)}<br>
Account name: ${esc(fnb.accountName)}<br>
Account number: <strong>${esc(fnb.accountNumber)}</strong> · SWIFT ${esc(fnb.swiftCode)}<br>
<span style="font-size:12px;color:#5c5c58;">Rand amount at R${o.zarPerUsd} per US$, fixed until ${shortDate(o.validUntil)}.</span>
</td></tr>`
      : ''
  return `<p style="margin:16px 0 6px;"><strong>${zar ? 'Pay into either account' : 'Pay by bank transfer'}</strong> · reference <strong>${esc(o.invoiceNumber)}</strong></p>
<table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px;margin:0 0 8px;border:1px solid ${PRIMARY};width:100%;">
<tr><td style="padding:12px 16px;line-height:1.65;${zar ? 'border-bottom:1px solid #e3e1dc;' : ''}">
<strong style="color:${PRIMARY};">Zimbabwe · pay ${formatUsd(o.total)}</strong><br>
${esc(zb.bankName)} · ${esc(zb.branch)} branch<br>
Account name: ${esc(zb.accountName)}<br>
Account number: <strong>${esc(zb.accountNumber)}</strong> (US$)
</td></tr>${zar}</table>`
}

export function orderReceivedEmail(o: Order, orderUrl: string): ShopEmail {
  const amounts = o.totalZar
    ? `<strong>${formatUsd(o.total)}</strong> in Zimbabwe or <strong>${formatZar(o.totalZar)}</strong> in South Africa`
    : `<strong>${formatUsd(o.total)}</strong>`
  return {
    subject: `Your TEAM Consulting invoice ${o.invoiceNumber}`,
    html: layout(
      'Your invoice',
      `<p>Dear ${firstName(o)},</p>
<p>Thank you for your order. Your pro-forma invoice <strong>${esc(o.invoiceNumber)}</strong> is attached.</p>
${itemsTable(o)}
<p style="margin-top:20px;"><strong>To complete your order:</strong></p>
<ol style="padding-left:20px;margin:0 0 8px;">
<li style="margin-bottom:6px;">Pay ${amounts} by bank transfer, using <strong>${esc(o.invoiceNumber)}</strong> as the reference.</li>
<li style="margin-bottom:6px;">Upload your proof of payment using the button below, or reply to this email with it attached.</li>
</ol>
${bankBlock(o)}
${button(orderUrl, 'Upload proof of payment')}
<p><strong>Delivery:</strong> ${esc(o.delivery.promise)}. This invoice is valid until ${shortDate(o.validUntil)}.</p>
<p>Kind regards,<br>TEAM Consulting</p>`,
    ),
  }
}

export function adminNewOrderEmail(o: Order, adminUrl: string): ShopEmail {
  const c = o.customer
  return {
    subject: `New shop order ${o.invoiceNumber}: ${formatUsd(o.total)} from ${c.name}`,
    html: layout(
      'New order',
      `<p><strong>New order received.</strong> The pro-forma invoice has been emailed to the customer.</p>
<p>Invoice: <strong>${esc(o.invoiceNumber)}</strong><br>
Customer: ${esc(c.name)}${c.company ? `, ${esc(c.company)}` : ''}<br>
Email: ${esc(c.email)}<br>Phone: ${esc(c.phone)}<br>
${c.taxNumber ? `TIN / VAT: ${esc(c.taxNumber)}<br>` : ''}
Delivery: ${esc(o.delivery.label)}${o.delivery.address ? ` · ${esc(o.delivery.address)}` : ''}<br>
${o.notes ? `Note: ${esc(o.notes)}<br>` : ''}</p>
${itemsTable(o)}
${o.totalZar ? `<p>Rand amount: ${formatZar(o.totalZar)} (R${o.zarPerUsd} per US$)</p>` : '<p>No rand option on this invoice (no current exchange rate).</p>'}
<p>Status: <strong>Awaiting payment</strong> (invoice valid until ${shortDate(o.validUntil)}).</p>
${button(adminUrl, 'Open the admin dashboard')}`,
    ),
  }
}

export function proofReceivedEmail(o: Order): ShopEmail {
  return {
    subject: `We have received your proof of payment (${o.invoiceNumber})`,
    html: layout(
      'Proof of payment received',
      `<p>Dear ${firstName(o)},</p>
<p>Thank you. We’ve received your proof of payment for invoice <strong>${esc(o.invoiceNumber)}</strong>.</p>
<p>We’ll check that the payment has reflected in our account and email you to confirm, usually within one working day.</p>
<p>Kind regards,<br>TEAM Consulting</p>`,
    ),
  }
}

export function adminProofEmail(o: Order, filename: string, adminUrl: string): ShopEmail {
  return {
    subject: `Proof of payment: ${o.invoiceNumber} (${o.customer.name})`,
    html: layout(
      'Proof of payment',
      `<p><strong>${esc(o.customer.name)}</strong> has uploaded proof of payment for <strong>${esc(o.invoiceNumber)}</strong>. The file (${esc(filename)}) is attached.</p>
<p>Invoice amount: ${formatUsd(o.total)}${o.totalZar ? ` or ${formatZar(o.totalZar)}` : ''}.</p>
<p>Once the money reflects, open the order and click <strong>Mark as paid</strong>.</p>
${button(adminUrl, 'Open the admin dashboard')}`,
    ),
  }
}

export function paymentConfirmedEmail(o: Order): ShopEmail {
  const collect = o.delivery.id === 'collect'
  return {
    subject: `Payment confirmed: your order ${o.invoiceNumber} is being prepared`,
    html: layout(
      'Payment confirmed',
      `<p>Dear ${firstName(o)},</p>
<p>Your payment for invoice <strong>${esc(o.invoiceNumber)}</strong> has been received. Thank you.</p>
<p><strong>${collect ? 'Ready for collection' : 'Expected delivery'}: by ${o.expectedDeliveryDate ? longDate(o.expectedDeliveryDate) : ''}</strong><br>
${esc(o.delivery.label)}${o.delivery.address ? ` · ${esc(o.delivery.address)}` : ''}</p>
${itemsTable(o)}
<p>Your tax invoice will follow separately.</p>
<p>Kind regards,<br>TEAM Consulting</p>`,
    ),
  }
}

export function dispatchedEmail(o: Order): ShopEmail {
  const collect = o.delivery.id === 'collect'
  return {
    subject: collect ? `Your order ${o.invoiceNumber} is ready for collection` : `Your order ${o.invoiceNumber} is on its way`,
    html: layout(
      collect ? 'Ready for collection' : 'Order on its way',
      `<p>Dear ${firstName(o)},</p>
<p>${collect ? `Your order <strong>${esc(o.invoiceNumber)}</strong> is ready for collection from TEAM Consulting.` : `Your order <strong>${esc(o.invoiceNumber)}</strong> is on its way to ${esc(o.delivery.address ?? '')}.`}</p>
${o.trackingNote ? `<p>${esc(o.trackingNote)}</p>` : ''}
<p>If anything arrives damaged or incorrect, please reply to this email within 7 days and we’ll put it right.</p>
<p>We hope the tools serve your team well. If you’d like support rolling them out, from a culture diagnostic to coaching or facilitated workshops, just reply to this email.</p>
<p>Kind regards,<br>TEAM Consulting</p>`,
    ),
  }
}

export function paymentReminderEmail(o: Order, orderUrl: string): ShopEmail {
  return {
    subject: `Reminder: invoice ${o.invoiceNumber} expires on ${shortDate(o.validUntil)}`,
    html: layout(
      'Payment reminder',
      `<p>Dear ${firstName(o)},</p>
<p>A quick reminder that invoice <strong>${esc(o.invoiceNumber)}</strong> for <strong>${formatUsd(o.total)}</strong>${o.totalZar ? ` (or <strong>${formatZar(o.totalZar)}</strong>)` : ''} expires on ${shortDate(o.validUntil)}.</p>
${bankBlock(o)}
${button(orderUrl, 'Upload proof of payment')}
<p>If you’ve already paid, please upload your proof of payment so we can process your order. If you no longer need the items, you can ignore this email.</p>
<p>Kind regards,<br>TEAM Consulting</p>`,
    ),
  }
}

export function fxAlertEmail(message: string, adminUrl: string): ShopEmail {
  return {
    subject: 'Shop: the rand exchange rate needs attention',
    html: layout(
      'Exchange rate alert',
      `<p><strong>The shop could not update the rand exchange rate.</strong></p>
<p>${esc(message)}</p>
<p>Until this is fixed, new invoices keep using the last good rate, or show only the Zimbabwe account if the rate is more than 4 days old. You can set a manual rate in the admin dashboard.</p>
${button(adminUrl, 'Open the admin dashboard')}`,
    ),
  }
}
