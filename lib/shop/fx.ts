import { shopSettings } from '@/lib/data/shop'
import { applyMarkup, isAcceptableRate } from './money'
import { shopStore } from './store'
import type { FxSnapshot } from './types'

/*
 * Rand exchange rate.
 *
 * The market US$→ZAR rate is fetched from Frankfurter (central-bank rates,
 * no key needed), with open.er-api.com as a backup. It is refreshed by the
 * daily job (/api/shop/cron) and, if that has not run, whenever a cached rate
 * is older than refreshAfterHours. Each order saves the rate it used, so a
 * customer's rand amount never changes after the invoice is issued.
 */

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>

export interface FetchedRate {
  rate: number
  source: string
  rateDate?: string
}

async function getJson(fetchImpl: FetchLike, url: string): Promise<unknown> {
  const res = await fetchImpl(url, { signal: AbortSignal.timeout(6000), cache: 'no-store' })
  if (!res.ok) throw new Error(`${url} responded ${res.status}`)
  return res.json()
}

/** Reads the US$→ZAR rate from the primary source, then the backup. */
export async function fetchMarketRate(fetchImpl: FetchLike = fetch): Promise<FetchedRate> {
  const { source, backupSource } = shopSettings.exchangeRate
  const errors: string[] = []

  try {
    // Response: { "date": "2026-10-21", "base": "USD", "quote": "ZAR", "rate": 17.4 }
    const data = (await getJson(fetchImpl, source)) as { rate?: unknown; date?: unknown; quote?: unknown }
    if (typeof data.rate === 'number' && (data.quote === undefined || data.quote === 'ZAR')) {
      return { rate: data.rate, source: 'Frankfurter', rateDate: typeof data.date === 'string' ? data.date : undefined }
    }
    errors.push('Frankfurter: unexpected response')
  } catch (error) {
    errors.push(`Frankfurter: ${error instanceof Error ? error.message : String(error)}`)
  }

  try {
    // Response: { "result": "success", "time_last_update_utc": "...", "rates": { "ZAR": 17.4, ... } }
    const data = (await getJson(fetchImpl, backupSource)) as {
      result?: unknown
      rates?: Record<string, unknown>
      time_last_update_utc?: unknown
    }
    const rate = data.rates?.ZAR
    if (data.result === 'success' && typeof rate === 'number') {
      return {
        rate,
        source: 'ExchangeRate-API',
        rateDate: typeof data.time_last_update_utc === 'string' ? data.time_last_update_utc : undefined,
      }
    }
    errors.push('ExchangeRate-API: unexpected response')
  } catch (error) {
    errors.push(`ExchangeRate-API: ${error instanceof Error ? error.message : String(error)}`)
  }

  throw new Error(errors.join('; '))
}

export type RefreshResult = { ok: true; snapshot: FxSnapshot } | { ok: false; message: string }

/** Fetches a new market rate, checks it against the last good one and saves it. */
export async function refreshRate(fetchImpl: FetchLike = fetch): Promise<RefreshResult> {
  const store = shopStore()
  const previous = await store.getFx()
  const at = new Date().toISOString()

  let fetched: FetchedRate
  try {
    fetched = await fetchMarketRate(fetchImpl)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    await store.addFxHistory({ at, ok: false, message })
    return { ok: false, message }
  }

  const { maxDailyChangePercent } = shopSettings.exchangeRate
  if (!isAcceptableRate(fetched.rate, previous?.marketRate ?? null, maxDailyChangePercent)) {
    const message = `Rejected ${fetched.rate} from ${fetched.source}: more than ${maxDailyChangePercent}% away from the last rate (${previous?.marketRate}). The previous rate is still in use.`
    await store.addFxHistory({ at, ok: false, source: fetched.source, marketRate: fetched.rate, message })
    return { ok: false, message }
  }

  const snapshot: FxSnapshot = { marketRate: fetched.rate, source: fetched.source, rateDate: fetched.rateDate, fetchedAt: at }
  await store.saveFx(snapshot)
  await store.addFxHistory({ at, ok: true, source: fetched.source, marketRate: fetched.rate })
  return { ok: true, snapshot }
}

const hoursSince = (iso: string) => (Date.now() - Date.parse(iso)) / 3_600_000

export interface RateInUse {
  rate: number
  marketRate: number | null
  markupPercent: number
  source: string
  updatedAt: string | null
  manual: boolean
}

export interface RateStatus {
  inUse: RateInUse | null
  /** Why there is no usable rate, if there is none. */
  problem?: string
  stale: boolean
  snapshot: FxSnapshot | null
}

/**
 * The rate new orders should use, or null when there is no fresh rate
 * (the South Africa payment option is then hidden).
 */
export async function getRateStatus(options: { allowRefresh?: boolean } = {}): Promise<RateStatus> {
  const store = shopStore()
  const settings = await store.getSettings()
  let snapshot = await store.getFx()
  const { refreshAfterHours, staleAfterHours } = shopSettings.exchangeRate

  if (settings.manualOverride && settings.manualOverride > 0) {
    return {
      inUse: {
        rate: settings.manualOverride,
        marketRate: snapshot?.marketRate ?? null,
        markupPercent: 0,
        source: 'Manual override',
        updatedAt: null,
        manual: true,
      },
      stale: false,
      snapshot,
    }
  }

  if (options.allowRefresh !== false && (!snapshot || hoursSince(snapshot.fetchedAt) > refreshAfterHours)) {
    const result = await refreshRate().catch(() => null)
    if (result?.ok) snapshot = result.snapshot
  }

  if (!snapshot) return { inUse: null, problem: 'No exchange rate has been fetched yet.', stale: true, snapshot }

  const stale = hoursSince(snapshot.fetchedAt) > staleAfterHours
  if (stale) {
    return {
      inUse: null,
      problem: `The exchange rate has not updated since ${snapshot.fetchedAt}.`,
      stale: true,
      snapshot,
    }
  }

  return {
    inUse: {
      rate: applyMarkup(snapshot.marketRate, settings.markupPercent),
      marketRate: snapshot.marketRate,
      markupPercent: settings.markupPercent,
      source: snapshot.source,
      updatedAt: snapshot.fetchedAt,
      manual: false,
    },
    stale: false,
    snapshot,
  }
}
