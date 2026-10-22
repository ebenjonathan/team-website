'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import type { FxHistoryEntry, Order, OrderStatus, ShopAdminSettings } from '@/lib/shop/types'
import { statusLabels } from '@/lib/shop/types'
import type { RateStatus } from '@/lib/shop/fx'
import { formatUsd, formatZar, longDate } from '@/lib/shop/money'

type AdminOrder = Order & { customerLink: string }

const panel = 'rounded-2xl border border-white/10 bg-white/5 p-5'
const input =
  'rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white placeholder-white/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
const btn = 'rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/80 transition-colors hover:border-primary hover:text-primary disabled:opacity-40'
const btnPrimary = 'rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-dark disabled:opacity-40'

const fmt = (ts?: string) =>
  ts
    ? new Date(ts).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Harare' })
    : '—'

const statusTone: Record<OrderStatus, string> = {
  awaiting_payment: 'bg-amber-400/15 text-amber-200',
  proof_received: 'bg-sky-400/15 text-sky-200',
  paid: 'bg-primary/25 text-white',
  dispatched: 'bg-primary/25 text-white',
  delivered: 'bg-white/10 text-white/70',
  cancelled: 'bg-red-400/15 text-red-200',
  expired: 'bg-white/10 text-white/50',
}

function downloadCSV(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return
  const headers = Object.keys(rows[0])
  const csv = [headers.join(','), ...rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? '')).join(','))].join('\r\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function FxPanel({
  fx,
  settings,
  history,
  onSaved,
}: {
  fx: RateStatus | null
  settings: ShopAdminSettings
  history: FxHistoryEntry[]
  onSaved: () => void
}) {
  const [markup, setMarkup] = useState(String(settings.markupPercent))
  const [override, setOverride] = useState(settings.manualOverride ? String(settings.manualOverride) : '')
  const [holidays, setHolidays] = useState(settings.holidays.join('\n'))
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    setMarkup(String(settings.markupPercent))
    setOverride(settings.manualOverride ? String(settings.manualOverride) : '')
    setHolidays(settings.holidays.join('\n'))
  }, [settings])

  async function save() {
    setBusy(true)
    setMsg('')
    const res = await fetch('/api/admin/shop/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        markupPercent: Number(markup) || 0,
        manualOverride: override.trim() ? Number(override) : null,
        holidays: holidays.split(/[\s,]+/).filter(Boolean),
      }),
    })
    const json = await res.json().catch(() => ({}))
    setMsg(res.ok ? 'Saved. New orders use these settings.' : json.message ?? 'Could not save.')
    setBusy(false)
    onSaved()
  }

  async function updateNow() {
    setBusy(true)
    setMsg('')
    const res = await fetch('/api/admin/shop/fx', { method: 'POST' })
    const json = await res.json().catch(() => ({}))
    setMsg(json.success ? `Updated: ${json.snapshot.marketRate} from ${json.snapshot.source}.` : json.message ?? 'Update failed.')
    setBusy(false)
    onSaved()
  }

  const inUse = fx?.inUse
  return (
    <section className={panel}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary">Rand exchange rate</p>
          {inUse ? (
            <p className="mt-1 text-2xl font-bold">
              R{inUse.rate} <span className="text-sm font-normal text-white/50">per US$ in use</span>
            </p>
          ) : (
            <p className="mt-1 text-lg font-semibold text-amber-200">No usable rate: invoices show the Zimbabwe account only</p>
          )}
          <p className="mt-1 text-sm text-white/60">
            {inUse?.manual
              ? 'Manual override is on.'
              : inUse
                ? `Market rate ${inUse.marketRate} from ${inUse.source} + ${inUse.markupPercent}% markup · updated ${fmt(inUse.updatedAt ?? undefined)}`
                : fx?.problem}
          </p>
        </div>
        <button onClick={updateNow} disabled={busy} className={`${btn} flex items-center gap-1.5`}>
          <RefreshCw className="w-3.5 h-3.5" /> Update now
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <label className="text-sm text-white/70">
          Markup %
          <input value={markup} onChange={(e) => setMarkup(e.target.value)} inputMode="decimal" className={`${input} mt-1 block w-full`} />
          <span className="mt-1 block text-xs text-white/40">Cushion on top of the market rate, e.g. 2.</span>
        </label>
        <label className="text-sm text-white/70">
          Manual override (R per US$)
          <input value={override} onChange={(e) => setOverride(e.target.value)} inputMode="decimal" placeholder="Leave blank for automatic" className={`${input} mt-1 block w-full`} />
          <span className="mt-1 block text-xs text-white/40">Used instead of the automatic rate until cleared.</span>
        </label>
        <label className="text-sm text-white/70">
          Public holidays (YYYY-MM-DD, one per line)
          <textarea value={holidays} onChange={(e) => setHolidays(e.target.value)} rows={3} className={`${input} mt-1 block w-full font-mono`} />
          <span className="mt-1 block text-xs text-white/40">Skipped when counting delivery days.</span>
        </label>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button onClick={save} disabled={busy} className={btnPrimary}>
          Save settings
        </button>
        {msg && <span className="text-sm text-white/70">{msg}</span>}
      </div>

      {history.length > 0 && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-white/60">Rate history</summary>
          <ul className="mt-2 space-y-1 text-xs text-white/60">
            {history.slice(0, 15).map((h) => (
              <li key={h.at + (h.message ?? '')}>
                {fmt(h.at)} · {h.ok ? `${h.marketRate} (${h.source})` : <span className="text-amber-200">{h.message}</span>}
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  )
}

function OrderDetail({ order, onChanged }: { order: AdminOrder; onChanged: () => void }) {
  const [account, setAccount] = useState<'zb-usd' | 'fnb-zar'>('zb-usd')
  const [amount, setAmount] = useState(String(order.total))
  const [note, setNote] = useState('')
  const [notes, setNotes] = useState(order.adminNotes ?? '')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    setAmount(String(account === 'zb-usd' ? order.total : order.totalZar ?? ''))
  }, [account, order.total, order.totalZar])

  async function act(body: Record<string, unknown>, confirmText?: string) {
    if (confirmText && !window.confirm(confirmText)) return
    setBusy(true)
    setMsg('')
    const res = await fetch(`/api/admin/shop/orders/${encodeURIComponent(order.invoiceNumber)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = await res.json().catch(() => ({}))
    setMsg(res.ok ? 'Done.' : json.message ?? 'Action failed.')
    setBusy(false)
    onChanged()
  }

  function markPaid() {
    const value = Number(amount)
    const expected = account === 'zb-usd' ? order.total : order.totalZar ?? 0
    if (!value) return setMsg('Enter the amount received.')
    const short = value < expected
    void act(
      { action: 'markPaid', account, amount: value },
      short
        ? `The amount received (${value}) is less than the invoice amount for this account (${expected}). Mark as paid anyway?`
        : `Mark ${order.invoiceNumber} as paid and email the customer?`,
    )
  }

  const c = order.customer
  return (
    <div className="grid gap-6 lg:grid-cols-3 bg-black/20 p-5 text-sm">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-widest text-white/40">Customer</p>
        <p className="font-semibold">{c.name}</p>
        {c.company && <p>{c.company}</p>}
        <p>
          <a href={`mailto:${c.email}`} className="underline">
            {c.email}
          </a>
        </p>
        <p>{c.phone}</p>
        {c.taxNumber && <p>TIN / VAT: {c.taxNumber}</p>}
        <p className="pt-3 text-xs uppercase tracking-widest text-white/40">Delivery</p>
        <p>{order.delivery.label}</p>
        {order.delivery.address && <p className="text-white/70">{order.delivery.address}</p>}
        {order.notes && <p className="text-white/70">Note: {order.notes}</p>}
        {order.expectedDeliveryDate && <p className="text-primary">Expected: {longDate(order.expectedDeliveryDate)}</p>}
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-white/40">Items</p>
        <ul className="mt-1 space-y-1">
          {order.items.map((i) => (
            <li key={i.id} className="flex justify-between gap-3">
              <span>
                {i.quantity} × {i.name}
              </span>
              <span>{formatUsd(i.lineTotal)}</span>
            </li>
          ))}
          <li className="flex justify-between gap-3 text-white/60">
            <span>Delivery</span>
            <span>{formatUsd(order.deliveryFee)}</span>
          </li>
          <li className="flex justify-between gap-3 border-t border-white/10 pt-1 font-semibold">
            <span>Total (incl. VAT {formatUsd(order.vat)})</span>
            <span>{formatUsd(order.total)}</span>
          </li>
          {order.totalZar && (
            <li className="flex justify-between gap-3 text-white/70">
              <span>Rand (R{order.zarPerUsd}/US$)</span>
              <span>{formatZar(order.totalZar)}</span>
            </li>
          )}
        </ul>
        <p className="mt-3 text-white/70">
          Proof of payment:{' '}
          {order.proof ? `received ${fmt(order.proof.receivedAt)} (${order.proof.filename}) — the file was emailed to the office` : 'not yet'}
        </p>
        {order.paidAt && (
          <p className="text-white/70">
            Paid {fmt(order.paidAt)}: {order.amountReceived} into {order.paidAccount === 'zb-usd' ? 'ZB (US$)' : 'FNB (ZAR)'}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-3 text-xs">
          <a href={order.customerLink} target="_blank" rel="noopener" className="underline text-white/70">
            Customer order page
          </a>
          <a
            href={`/api/shop/orders/${encodeURIComponent(order.invoiceNumber)}/invoice?k=${encodeURIComponent(order.uploadToken)}`}
            target="_blank"
            rel="noopener"
            className="underline text-white/70"
          >
            Invoice PDF
          </a>
        </div>
      </div>

      <div className="space-y-4">
        {['awaiting_payment', 'proof_received', 'expired'].includes(order.status) && (
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-white/40">Mark as paid</p>
            <div className="flex flex-wrap gap-2">
              <select value={account} onChange={(e) => setAccount(e.target.value as 'zb-usd' | 'fnb-zar')} className={input}>
                <option value="zb-usd">ZB Bank (US$)</option>
                <option value="fnb-zar" disabled={!order.totalZar}>
                  FNB (ZAR)
                </option>
              </select>
              <input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" className={`${input} w-28`} aria-label="Amount received" />
              <button onClick={markPaid} disabled={busy} className={btnPrimary}>
                Mark as paid
              </button>
            </div>
          </div>
        )}
        {['paid', 'dispatched'].includes(order.status) && (
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-white/40">{order.delivery.id === 'collect' ? 'Ready for collection' : 'Dispatch'}</p>
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional note, e.g. courier and tracking number" className={`${input} w-full`} />
            <div className="flex flex-wrap gap-2">
              <button onClick={() => act({ action: 'dispatch', note }, 'Email the customer that the order is on its way?')} disabled={busy} className={btnPrimary}>
                {order.delivery.id === 'collect' ? 'Mark ready & email' : 'Mark as dispatched'}
              </button>
              <button onClick={() => act({ action: 'delivered' })} disabled={busy} className={btn}>
                Mark as delivered
              </button>
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => act({ action: 'resendInvoice' }, 'Email the invoice to the customer again?')} disabled={busy} className={btn}>
            Resend invoice
          </button>
          {!['cancelled', 'delivered'].includes(order.status) && (
            <button onClick={() => act({ action: 'cancel' }, `Cancel ${order.invoiceNumber}? The customer is not emailed.`)} disabled={busy} className={`${btn} hover:border-red-400 hover:text-red-300`}>
              Cancel order
            </button>
          )}
        </div>
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-white/40">Admin notes</p>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={`${input} w-full`} />
          <button onClick={() => act({ action: 'notes', notes })} disabled={busy} className={btn}>
            Save notes
          </button>
        </div>
        {msg && <p className="text-white/70">{msg}</p>}
        {order.emailErrors.length > 0 && (
          <div className="rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-xs text-red-200">
            <p className="font-semibold">Email problems</p>
            {order.emailErrors.slice(-3).map((e) => (
              <p key={e}>{e}</p>
            ))}
          </div>
        )}
        <details>
          <summary className="cursor-pointer text-xs text-white/50">History</summary>
          <ul className="mt-1 space-y-0.5 text-xs text-white/50">
            {order.history.map((h) => (
              <li key={h.at + h.event}>
                {fmt(h.at)} · {h.event}
              </li>
            ))}
          </ul>
        </details>
      </div>
    </div>
  )
}

export default function ShopOrdersManager() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [settings, setSettings] = useState<ShopAdminSettings>({ markupPercent: 0, manualOverride: null, holidays: [] })
  const [fx, setFx] = useState<RateStatus | null>(null)
  const [history, setHistory] = useState<FxHistoryEntry[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<OrderStatus | 'all' | 'open'>('open')
  const [search, setSearch] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/shop/orders')
    const json = await res.json().catch(() => ({}))
    if (res.ok && json.success) {
      setOrders(json.orders)
      setSettings(json.settings)
      setFx(json.fx)
      setHistory(json.fxHistory)
      setError('')
    } else {
      setError(json.message ?? 'Could not load orders.')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return orders.filter((o) => {
      const statusOk =
        status === 'all' ? true : status === 'open' ? ['awaiting_payment', 'proof_received', 'paid', 'dispatched'].includes(o.status) : o.status === status
      const text = `${o.invoiceNumber} ${o.customer.name} ${o.customer.email} ${o.customer.company ?? ''}`.toLowerCase()
      return statusOk && (!q || text.includes(q))
    })
  }, [orders, status, search])

  const needsAction = orders.filter((o) => o.status === 'proof_received' || o.status === 'paid').length

  return (
    <div className="space-y-6">
      <FxPanel fx={fx} settings={settings} history={history} onSaved={load} />

      <section className={panel}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <input type="search" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} className={input} />
            <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className={input}>
              <option value="open">Open orders</option>
              <option value="all">All orders</option>
              {(Object.keys(statusLabels) as OrderStatus[]).map((s) => (
                <option key={s} value={s}>
                  {statusLabels[s]}
                </option>
              ))}
            </select>
            {needsAction > 0 && <span className="text-sm text-amber-200">{needsAction} need action</span>}
          </div>
          <button
            onClick={() =>
              downloadCSV(
                'shop-orders.csv',
                filtered.map((o) => ({
                  Invoice: o.invoiceNumber,
                  Date: o.createdAt,
                  Status: statusLabels[o.status],
                  Customer: o.customer.name,
                  Company: o.customer.company ?? '',
                  Email: o.customer.email,
                  Phone: o.customer.phone,
                  'TIN/VAT': o.customer.taxNumber ?? '',
                  Items: o.items.map((i) => `${i.quantity} x ${i.name}`).join('; '),
                  'Subtotal US$': o.subtotal,
                  'Delivery US$': o.deliveryFee,
                  'Total US$ (incl. VAT)': o.total,
                  'VAT US$': o.vat,
                  'Rate R/US$': o.zarPerUsd ?? '',
                  'Total ZAR': o.totalZar ?? '',
                  'Paid into': o.paidAccount ?? '',
                  'Amount received': o.amountReceived ?? '',
                  'Paid at': o.paidAt ?? '',
                  Delivery: o.delivery.label,
                  Address: o.delivery.address ?? '',
                })),
              )
            }
            className={btn}
          >
            Export CSV
          </button>
        </div>

        {loading && <p className="py-12 text-center text-sm text-white/40">Loading</p>}
        {error && <p className="py-6 text-center text-sm text-red-300">{error}</p>}
        {!loading && !error && filtered.length === 0 && <p className="py-12 text-center text-sm text-white/40">No orders here yet.</p>}

        {filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-widest text-white/40">
                  <th className="pb-3 pr-4">Invoice</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Customer</th>
                  <th className="pb-3 pr-4">US$</th>
                  <th className="pb-3 pr-4">Rand</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <FragmentRow key={o.invoiceNumber} order={o} open={openId === o.invoiceNumber} onToggle={() => setOpenId(openId === o.invoiceNumber ? null : o.invoiceNumber)} onChanged={load} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

function FragmentRow({ order, open, onToggle, onChanged }: { order: AdminOrder; open: boolean; onToggle: () => void; onChanged: () => void }) {
  return (
    <>
      <tr onClick={onToggle} className="cursor-pointer border-t border-white/5 hover:bg-white/5" aria-expanded={open}>
        <td className="py-2.5 pr-4 font-semibold">{order.invoiceNumber}</td>
        <td className="py-2.5 pr-4 text-white/50">{fmt(order.createdAt)}</td>
        <td className="py-2.5 pr-4">
          {order.customer.name}
          {order.customer.company && <span className="text-white/50"> · {order.customer.company}</span>}
        </td>
        <td className="py-2.5 pr-4">{formatUsd(order.total)}</td>
        <td className="py-2.5 pr-4 text-white/70">{order.totalZar ? formatZar(order.totalZar) : '—'}</td>
        <td className="py-2.5">
          <span className={`rounded-full px-2 py-0.5 text-xs ${statusTone[order.status]}`}>{statusLabels[order.status]}</span>
          {order.emailErrors.length > 0 && <span className="ml-2 text-xs text-red-300">email issue</span>}
        </td>
      </tr>
      {open && (
        <tr>
          <td colSpan={6} className="p-0">
            <OrderDetail order={order} onChanged={onChanged} />
          </td>
        </tr>
      )}
    </>
  )
}
