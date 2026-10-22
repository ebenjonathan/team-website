// Pure money, VAT, exchange-rate and date helpers for the shop. No I/O here,
// so everything can be unit-tested (tests/shop.test.ts).

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100
}

export interface PricedLine {
  unitPrice: number
  quantity: number
}

export interface OrderTotals {
  subtotal: number
  deliveryFee: number
  /** Amount due in US$, VAT included. */
  total: number
  /** VAT portion contained in the total. */
  vat: number
  /** Amount due in rand, rounded up to the next whole rand; null when no usable rate. */
  totalZar: number | null
}

/**
 * Prices include VAT, so VAT is the portion of the total, not an addition:
 * vat = total × rate ÷ (100 + rate).
 */
export function computeTotals(
  lines: PricedLine[],
  deliveryFee: number,
  vatRatePercent: number,
  zarPerUsd: number | null,
): OrderTotals {
  const subtotal = round2(lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0))
  const total = round2(subtotal + deliveryFee)
  const vat = round2((total * vatRatePercent) / (100 + vatRatePercent))
  return { subtotal, deliveryFee: round2(deliveryFee), total, vat, totalZar: toZar(total, zarPerUsd) }
}

/** Rand amount for a US$ total, rounded UP to the next whole rand. */
export function toZar(totalUsd: number, zarPerUsd: number | null): number | null {
  if (!zarPerUsd || !Number.isFinite(zarPerUsd) || zarPerUsd <= 0) return null
  // Round to cents first so float noise (e.g. 3306.0000000004) does not add a rand.
  return Math.ceil(round2(totalUsd * zarPerUsd))
}

/** Market rate plus the optional cushion, to 4 decimal places. */
export function applyMarkup(marketRate: number, markupPercent: number): number {
  return Math.round(marketRate * (1 + markupPercent / 100) * 10000) / 10000
}

/** True when a newly fetched rate is usable compared with the last good rate. */
export function isAcceptableRate(next: unknown, previous: number | null, maxChangePercent: number): next is number {
  if (typeof next !== 'number' || !Number.isFinite(next) || next <= 0) return false
  if (!previous) return true
  return Math.abs(next - previous) / previous <= maxChangePercent / 100
}

export function formatUsd(n: number): string {
  return `US$${n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatZar(n: number): string {
  return `R${n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatInvoiceNumber(prefix: string, n: number): string {
  return `${prefix}${String(n).padStart(4, '0')}`
}

// ─── Dates (Harare time, UTC+2 all year) ─────────────────────────────────────

/** YYYY-MM-DD for the given instant in Harare. */
export function harareDate(at: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Harare',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(at)
}

/**
 * The date `days` working days after `from` (Harare time), skipping Saturdays,
 * Sundays and the given public holidays (YYYY-MM-DD).
 */
export function addWorkingDays(from: Date, days: number, holidays: Iterable<string> = []): string {
  const skip = new Set(holidays)
  const [y, m, d] = harareDate(from).split('-').map(Number)
  const cursor = new Date(Date.UTC(y, m - 1, d))
  let added = 0
  while (added < days) {
    cursor.setUTCDate(cursor.getUTCDate() + 1)
    const dow = cursor.getUTCDay()
    const iso = cursor.toISOString().slice(0, 10)
    if (dow !== 0 && dow !== 6 && !skip.has(iso)) added++
  }
  return cursor.toISOString().slice(0, 10)
}

/** "Friday 23 October 2026" for a YYYY-MM-DD date. */
export function longDate(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/** "23 October 2026" for an instant, in Harare time. */
export function shortDate(at: string | Date): string {
  return new Date(at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Africa/Harare',
  })
}
