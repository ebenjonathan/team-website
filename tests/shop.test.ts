import assert from 'node:assert/strict'
import test from 'node:test'
import {
  addWorkingDays,
  applyMarkup,
  computeTotals,
  formatInvoiceNumber,
  isAcceptableRate,
  toZar,
} from '../lib/shop/money'
import { fetchMarketRate } from '../lib/shop/fx'
import { checkoutSchema, priceLines, UnknownItemError } from '../lib/shop/orders'
import { pdfSafe } from '../lib/shop/invoicePdf'
import { bundleItemsTotal, shopBundles, shopProducts } from '../lib/data/shop'

test('prices match the pricing spreadsheet', () => {
  const prices = Object.fromEntries(shopProducts.map((p) => [p.id, p.price]))
  assert.deepEqual(prices, {
    'culture-leadership-playbook': 75,
    'culture-champions-playbook': 50,
    'teambuilding-playbook': 40,
    'card-deck': 25,
    pocketbook: 10,
  })
  for (const bundle of shopBundles) assert.ok(bundle.price < bundleItemsTotal(bundle), `${bundle.id} should be a saving`)
})

test('VAT is the portion included in the total, not added on top', () => {
  const t = computeTotals([{ unitPrice: 50, quantity: 2 }, { unitPrice: 25, quantity: 2 }, { unitPrice: 40, quantity: 1 }], 0, 15.5, null)
  assert.equal(t.total, 190)
  assert.equal(t.vat, 25.5) // 190 × 15.5 / 115.5 = 25.4978…
  assert.equal(t.totalZar, null)
})

test('rand amount rounds up to the next rand without float noise', () => {
  assert.equal(toZar(190, 17.4), 3306) // 3306.0000000000005 must not become 3307
  assert.equal(toZar(295, 17.4), 5133)
  assert.equal(toZar(25, 17.4321), 436) // 435.8025 → 436
  assert.equal(toZar(25, null), null)
  assert.equal(toZar(25, 0), null)
})

test('markup is applied to the market rate', () => {
  assert.equal(applyMarkup(17.4, 0), 17.4)
  assert.equal(applyMarkup(17.4, 2), 17.748)
})

test('a fetched rate is rejected when it jumps too far', () => {
  assert.equal(isAcceptableRate(17.5, 17.4, 5), true)
  assert.equal(isAcceptableRate(19, 17.4, 5), false)
  assert.equal(isAcceptableRate(0, 17.4, 5), false)
  assert.equal(isAcceptableRate('17', 17.4, 5), false)
  assert.equal(isAcceptableRate(17.4, null, 5), true)
})

test('working days skip weekends and public holidays (Harare time)', () => {
  // Thursday 22 October 2026, 10:00 Harare
  const thursday = new Date('2026-10-22T08:00:00Z')
  assert.equal(addWorkingDays(thursday, 3), '2026-10-27') // Fri, Mon, Tue
  assert.equal(addWorkingDays(thursday, 3, ['2026-10-26']), '2026-10-28')
  // 23:30 UTC on Friday is already Saturday in Harare
  assert.equal(addWorkingDays(new Date('2026-10-23T23:30:00Z'), 1), '2026-10-26')
})

test('invoice numbers are zero-padded', () => {
  assert.equal(formatInvoiceNumber('TEAM-WEB-', 1), 'TEAM-WEB-0001')
  assert.equal(formatInvoiceNumber('TEAM-WEB-', 12345), 'TEAM-WEB-12345')
})

test('order lines are priced from the catalogue and duplicates merged', () => {
  const lines = priceLines([
    { id: 'card-deck', quantity: 2 },
    { id: 'card-deck', quantity: 1 },
    { id: 'champion-kit', quantity: 1 },
  ])
  assert.deepEqual(
    lines.map((l) => [l.id, l.quantity, l.unitPrice, l.lineTotal]),
    [
      ['card-deck', 3, 25, 75],
      ['champion-kit', 1, 105, 105],
    ],
  )
  assert.match(lines[1].detail ?? '', /Culture Champions Playbook/)
  assert.throws(() => priceLines([{ id: 'nope', quantity: 1 }]), UnknownItemError)
})

test('checkout requires an address for delivery but not for collection', () => {
  const base = { items: [{ id: 'card-deck', quantity: 1 }], name: 'QA Buyer', email: 'qa@example.test', phone: '+263 77 000 0000', acceptTerms: true as const }
  assert.equal(checkoutSchema.safeParse({ ...base, deliveryId: 'collect' }).success, true)
  assert.equal(checkoutSchema.safeParse({ ...base, deliveryId: 'harare' }).success, false)
  assert.equal(checkoutSchema.safeParse({ ...base, deliveryId: 'harare', address: '1 Sample Road, Harare' }).success, true)
  assert.equal(checkoutSchema.safeParse({ ...base, deliveryId: 'collect', website: 'spam' }).success, false)
  assert.equal(checkoutSchema.safeParse({ ...base, deliveryId: 'collect', acceptTerms: false }).success, false)
})

test('exchange rate comes from Frankfurter, then the backup', async () => {
  const primary = await fetchMarketRate(async () =>
    new Response(JSON.stringify({ date: '2026-10-21', base: 'USD', quote: 'ZAR', rate: 17.41 }), { status: 200 }),
  )
  assert.deepEqual(primary, { rate: 17.41, source: 'Frankfurter', rateDate: '2026-10-21' })

  const backup = await fetchMarketRate(async (url) =>
    url.includes('frankfurter')
      ? new Response('down', { status: 503 })
      : new Response(JSON.stringify({ result: 'success', rates: { ZAR: 17.39 } }), { status: 200 }),
  )
  assert.equal(backup.rate, 17.39)
  assert.equal(backup.source, 'ExchangeRate-API')

  await assert.rejects(fetchMarketRate(async () => new Response('down', { status: 503 })))
})

test('PDF text is limited to characters the standard fonts can draw', () => {
  assert.equal(pdfSafe('Card Deck™ · Moyo’s'), 'Card Deck™ · Moyo’s')
  assert.equal(pdfSafe('東京 order'), '?? order')
})
