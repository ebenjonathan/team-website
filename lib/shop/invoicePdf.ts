import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage, type RGB } from 'pdf-lib'
import { shopSettings } from '@/lib/data/shop'
import { formatUsd, formatZar, shortDate } from './money'
import { TEAM_LOGO_PNG_BASE64 } from './logo'
import type { Order } from './types'

// Draws the pro-forma invoice as an A4 PDF with pdf-lib (pure JavaScript, so it
// runs on Vercel without a browser). Layout follows the agreed invoice design.

const A4: [number, number] = [595.28, 841.89]
const M = 48 // page margin
const RIGHT = A4[0] - M

const C = {
  ink: rgb(0.11, 0.11, 0.106),
  deep: rgb(0.09, 0.149, 0.141),
  primary: rgb(0.035, 0.58, 0.49),
  grey: rgb(0.36, 0.36, 0.345),
  rule: rgb(0.89, 0.88, 0.86),
}

/** Standard PDF fonts only cover Windows-1252; replace anything else. */
const WIN_ANSI_EXTRA = '€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ'
export function pdfSafe(text: string): string {
  return Array.from(text.normalize('NFC'))
    .map((ch) => {
      const code = ch.codePointAt(0) ?? 63
      if (ch === '\n' || ch === '\t') return ' '
      if ((code >= 32 && code <= 126) || (code >= 160 && code <= 255) || WIN_ANSI_EXTRA.includes(ch)) return ch
      return '?'
    })
    .join('')
}

interface Ctx {
  doc: PDFDocument
  page: PDFPage
  regular: PDFFont
  bold: PDFFont
}

function text(
  ctx: Ctx,
  value: string,
  x: number,
  y: number,
  opts: { size?: number; bold?: boolean; color?: RGB; align?: 'left' | 'right' } = {},
) {
  const font = opts.bold ? ctx.bold : ctx.regular
  const size = opts.size ?? 9.5
  const safe = pdfSafe(value)
  const width = font.widthOfTextAtSize(safe, size)
  ctx.page.drawText(safe, {
    x: opts.align === 'right' ? x - width : x,
    y,
    size,
    font,
    color: opts.color ?? C.ink,
  })
  return width
}

/** Splits text into lines that fit `maxWidth`, breaking long words if needed. */
function wrap(font: PDFFont, value: string, size: number, maxWidth: number): string[] {
  const words = pdfSafe(value).split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let line = ''
  const fits = (s: string) => font.widthOfTextAtSize(s, size) <= maxWidth
  for (let word of words) {
    while (!fits(word)) {
      // Break very long tokens such as URLs.
      let cut = word.length - 1
      while (cut > 1 && !fits(word.slice(0, cut))) cut--
      if (line) {
        lines.push(line)
        line = ''
      }
      lines.push(word.slice(0, cut))
      word = word.slice(cut)
    }
    const candidate = line ? `${line} ${word}` : word
    if (fits(candidate)) line = candidate
    else {
      lines.push(line)
      line = word
    }
  }
  if (line) lines.push(line)
  return lines.length ? lines : ['']
}

function hr(ctx: Ctx, y: number, color = C.rule, thickness = 0.75, from = M, to = RIGHT) {
  ctx.page.drawLine({ start: { x: from, y }, end: { x: to, y }, thickness, color })
}

function label(ctx: Ctx, value: string, x: number, y: number) {
  text(ctx, value.toUpperCase(), x, y, { size: 7, bold: true, color: C.grey })
}

export async function renderInvoicePdf(order: Order, uploadUrl: string): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  doc.setTitle(`${shopSettings.invoice.documentTitle} ${order.invoiceNumber}`)
  doc.setAuthor(shopSettings.seller.tradingName)
  doc.setCreator('teamadvisoryservices.com')

  const ctx: Ctx = {
    doc,
    page: doc.addPage(A4),
    regular: await doc.embedFont(StandardFonts.Helvetica),
    bold: await doc.embedFont(StandardFonts.HelveticaBold),
  }
  const { seller, banks, invoice, tax } = shopSettings
  const logo = await doc.embedPng(Buffer.from(TEAM_LOGO_PNG_BASE64, 'base64'))

  // ─── Header ────────────────────────────────────────────────────────────────
  let y = A4[1] - M
  const logoH = 52
  const logoW = (logo.width / logo.height) * logoH
  ctx.page.drawImage(logo, { x: M, y: y - logoH, width: logoW, height: logoH })
  const sx = M + logoW + 12
  text(ctx, seller.legalName, sx, y - 11, { size: 11, bold: true })
  text(ctx, `t/a ${seller.tradingName} · Culture Practice`, sx, y - 24, { size: 8.5, color: C.grey })
  text(ctx, seller.address, sx, y - 35, { size: 8.5, color: C.grey })
  text(ctx, `TIN ${seller.tin} · VAT ${seller.vatNumber}`, sx, y - 46, { size: 8.5, color: C.grey })

  text(ctx, invoice.documentTitle, RIGHT, y - 16, { size: 18, bold: true, color: C.primary, align: 'right' })
  const meta: [string, string][] = [
    ['Invoice no.', order.invoiceNumber],
    ['Date', shortDate(order.createdAt)],
    ['Valid until', shortDate(order.validUntil)],
  ]
  meta.forEach(([k, v], i) => {
    const ry = y - 34 - i * 12
    text(ctx, v, RIGHT, ry, { size: 9, bold: i === 0, align: 'right' })
    text(ctx, k, RIGHT - 160, ry, { size: 9, color: C.grey })
  })

  y -= 76
  hr(ctx, y, C.primary, 1.5)

  // ─── Parties ───────────────────────────────────────────────────────────────
  y -= 20
  const colB = M + 260
  label(ctx, 'Bill to', M, y)
  label(ctx, 'Deliver to', colB, y)
  let ly = y - 14
  const billLines = [
    order.customer.name,
    order.customer.company,
    order.customer.email,
    order.customer.phone,
    order.customer.taxNumber ? `TIN / VAT: ${order.customer.taxNumber}` : undefined,
  ].filter(Boolean) as string[]
  billLines.forEach((l, i) => {
    text(ctx, l, M, ly, { bold: i === 0 })
    ly -= 13
  })
  let ry = y - 14
  text(ctx, order.delivery.label, colB, ry, { bold: true })
  ry -= 13
  for (const l of wrap(ctx.regular, order.delivery.address ?? '', 9.5, RIGHT - colB)) {
    if (!l) continue
    text(ctx, l, colB, ry)
    ry -= 13
  }
  if (order.notes) {
    for (const l of wrap(ctx.regular, `Note: ${order.notes}`, 9, RIGHT - colB).slice(0, 4)) {
      text(ctx, l, colB, ry, { size: 9, color: C.grey })
      ry -= 12
    }
  }
  y = Math.min(ly, ry) - 10

  // ─── Items ─────────────────────────────────────────────────────────────────
  const cQty = M + 300
  const cUnit = M + 390
  const drawItemHeader = () => {
    label(ctx, 'Item', M, y)
    text(ctx, 'QTY', cQty, y, { size: 7, bold: true, color: C.grey, align: 'right' })
    text(ctx, 'UNIT PRICE', cUnit, y, { size: 7, bold: true, color: C.grey, align: 'right' })
    text(ctx, 'AMOUNT', RIGHT, y, { size: 7, bold: true, color: C.grey, align: 'right' })
    y -= 6
    hr(ctx, y, C.ink, 0.75)
    y -= 14
  }
  drawItemHeader()
  for (const item of order.items) {
    const nameLines = wrap(ctx.regular, item.name, 9.5, 250)
    const detailLines = item.detail ? wrap(ctx.regular, item.detail, 8, 250) : []
    const rowH = nameLines.length * 12 + detailLines.length * 10 + 8
    if (y - rowH < 260) {
      ctx.page = doc.addPage(A4)
      y = A4[1] - M
      drawItemHeader()
    }
    let iy = y
    nameLines.forEach((l) => {
      text(ctx, l, M, iy)
      iy -= 12
    })
    detailLines.forEach((l) => {
      text(ctx, l, M, iy + 1, { size: 8, color: C.grey })
      iy -= 10
    })
    text(ctx, String(item.quantity), cQty, y, { align: 'right' })
    text(ctx, formatUsd(item.unitPrice), cUnit, y, { align: 'right' })
    text(ctx, formatUsd(item.lineTotal), RIGHT, y, { align: 'right' })
    y = iy - 7
    hr(ctx, y + 9)
  }

  // ─── Totals ────────────────────────────────────────────────────────────────
  const tx = RIGHT - 210
  y -= 8
  text(ctx, 'Subtotal', tx, y)
  text(ctx, formatUsd(order.subtotal), RIGHT, y, { align: 'right' })
  y -= 15
  text(ctx, 'Delivery', tx, y)
  text(ctx, formatUsd(order.deliveryFee), RIGHT, y, { align: 'right' })
  y -= 9
  hr(ctx, y, C.ink, 0.75, tx, RIGHT)
  y -= 16
  text(ctx, tax.pricesIncludeVat ? 'Total due (incl. VAT)' : 'Total due', tx, y, { size: 12, bold: true })
  text(ctx, formatUsd(order.total), RIGHT, y, { size: 12, bold: true, align: 'right' })
  y -= 14
  text(ctx, `Includes VAT at ${order.vatRatePercent}%`, tx, y, { size: 8, color: C.grey })
  text(ctx, formatUsd(order.vat), RIGHT, y, { size: 8, color: C.grey, align: 'right' })

  // ─── Payment ───────────────────────────────────────────────────────────────
  y -= 28
  label(ctx, `Pay by bank transfer${order.totalZar ? ' into either account' : ''}  ·  Payment reference:`, M, y)
  const refX = M + ctx.bold.widthOfTextAtSize(
    pdfSafe(`Pay by bank transfer${order.totalZar ? ' into either account' : ''}  ·  Payment reference:`.toUpperCase()),
    7,
  )
  text(ctx, order.invoiceNumber, refX + 5, y, { size: 7.5, bold: true })
  y -= 10

  const zb = banks.find((b) => b.id === 'zb-usd')!
  const fnb = banks.find((b) => b.id === 'fnb-zar')!
  const boxes: { title: string; amount: string; rows: [string, string][]; note?: string }[] = [
    {
      title: 'Option A · Zimbabwe · US$',
      amount: formatUsd(order.total),
      rows: [
        ['Bank', zb.bankName],
        ['Account name', zb.accountName],
        ['Account no.', zb.accountNumber],
        ['Branch', zb.branch],
      ],
    },
  ]
  if (order.totalZar && order.zarPerUsd) {
    boxes.push({
      title: 'Option B · South Africa · ZAR',
      amount: formatZar(order.totalZar),
      rows: [
        ['Bank', fnb.bankName],
        ['Account name', fnb.accountName],
        ['Account no.', fnb.accountNumber],
        ['Branch code', fnb.branchCode ?? ''],
        ['SWIFT', fnb.swiftCode ?? ''],
      ],
      note: `Rand amount at R${order.zarPerUsd} per US$, fixed until ${shortDate(order.validUntil)}.`,
    })
  }
  const gap = 14
  const boxW = boxes.length === 2 ? (RIGHT - M - gap) / 2 : (RIGHT - M - gap) / 2
  const boxH = 128
  boxes.forEach((b, i) => {
    const bx = M + i * (boxW + gap)
    ctx.page.drawRectangle({ x: bx, y: y - boxH, width: boxW, height: boxH, borderColor: C.primary, borderWidth: 0.9 })
    let by = y - 16
    text(ctx, b.title, bx + 12, by, { size: 8.5, bold: true, color: C.primary })
    by -= 19
    text(ctx, b.amount, bx + 12, by, { size: 14, bold: true })
    by -= 17
    for (const [k, v] of b.rows) {
      text(ctx, k, bx + 12, by, { size: 8.5, color: C.grey })
      const vLines = wrap(ctx.regular, v, 8.5, boxW - 90)
      vLines.forEach((l, li) => text(ctx, l, bx + 82, by - li * 10.5, { size: 8.5, bold: k === 'Account no.' }))
      by -= 10.5 * vLines.length + 2.5
    }
    if (b.note) {
      wrap(ctx.regular, b.note, 7.5, boxW - 24).forEach((l, li) => text(ctx, l, bx + 12, by - 3 - li * 9, { size: 7.5, color: C.grey }))
    }
  })
  y -= boxH + 22

  // ─── Next steps ────────────────────────────────────────────────────────────
  label(ctx, 'What happens next', M, y)
  y -= 14
  const steps = [
    order.totalZar ? 'Pay the amount shown for the account you choose.' : 'Pay the amount shown by bank transfer.',
    `Upload your proof of payment at ${uploadUrl}, or reply to the invoice email with it attached.`,
    `We confirm your payment by email. ${order.delivery.promise}.`,
  ]
  steps.forEach((s, i) => {
    const lines = wrap(ctx.regular, s, 9, RIGHT - M - 14)
    text(ctx, `${i + 1}.`, M, y, { size: 9 })
    lines.forEach((l, li) => text(ctx, l, M + 14, y - li * 11.5, { size: 9 }))
    y -= lines.length * 11.5 + 3
  })
  y -= 6
  text(ctx, `This invoice is valid until ${shortDate(order.validUntil)}. ${invoice.footerNote}`, M, y, { size: 8, color: C.grey })

  // ─── Footer on every page ──────────────────────────────────────────────────
  for (const page of doc.getPages()) {
    ctx.page = page
    hr(ctx, M - 10 + 14)
    text(ctx, `${seller.email} · ${seller.phones.join(' · ')}`, M, M - 10, { size: 7.5, color: C.grey })
    text(ctx, seller.website, RIGHT, M - 10, { size: 7.5, color: C.grey, align: 'right' })
  }

  return doc.save()
}
