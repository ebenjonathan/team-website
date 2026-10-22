import { mkdir, readFile, rename, writeFile } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import { Redis } from '@upstash/redis'
import type { FxHistoryEntry, FxSnapshot, Order, ShopAdminSettings } from './types'
import { shopSettings } from '@/lib/data/shop'

/*
 * Where shop orders are kept.
 *
 *  - Upstash Redis (the live site): uses the UPSTASH_REDIS_REST_URL and
 *    UPSTASH_REDIS_REST_TOKEN the site already needs for rate limiting.
 *  - Local file (development, or your own server without Redis): data/shop.json.
 *
 * On Vercel without Redis nothing can be saved, so the shop refuses orders
 * rather than lose them.
 */

export interface ShopStore {
  nextSequence(): Promise<number>
  saveOrder(order: Order): Promise<void>
  getOrder(invoiceNumber: string): Promise<Order | null>
  listOrders(): Promise<Order[]>
  getSettings(): Promise<ShopAdminSettings>
  saveSettings(settings: ShopAdminSettings): Promise<void>
  getFx(): Promise<FxSnapshot | null>
  saveFx(snapshot: FxSnapshot): Promise<void>
  addFxHistory(entry: FxHistoryEntry): Promise<void>
  listFxHistory(): Promise<FxHistoryEntry[]>
}

export const defaultAdminSettings = (): ShopAdminSettings => ({
  markupPercent: shopSettings.exchangeRate.defaultMarkupPercent,
  manualOverride: null,
  holidays: [],
})

const HISTORY_LIMIT = 200
const K = {
  seq: 'shop:seq',
  order: (n: string) => `shop:order:${n}`,
  orders: 'shop:orders',
  settings: 'shop:settings',
  fx: 'shop:fx:latest',
  fxHistory: 'shop:fx:history',
}

class RedisShopStore implements ShopStore {
  constructor(private readonly redis: Redis) {}

  nextSequence() {
    return this.redis.incr(K.seq)
  }

  async saveOrder(order: Order) {
    await this.redis.set(K.order(order.invoiceNumber), order)
    await this.redis.zadd(K.orders, { score: Date.parse(order.createdAt), member: order.invoiceNumber })
  }

  async getOrder(invoiceNumber: string) {
    return (await this.redis.get<Order>(K.order(invoiceNumber))) ?? null
  }

  async listOrders() {
    const ids = await this.redis.zrange<string[]>(K.orders, 0, -1, { rev: true })
    if (!ids.length) return []
    const rows = await this.redis.mget<(Order | null)[]>(...ids.map(K.order))
    return rows.filter((o): o is Order => !!o)
  }

  async getSettings() {
    return { ...defaultAdminSettings(), ...((await this.redis.get<ShopAdminSettings>(K.settings)) ?? {}) }
  }

  async saveSettings(settings: ShopAdminSettings) {
    await this.redis.set(K.settings, settings)
  }

  async getFx() {
    return (await this.redis.get<FxSnapshot>(K.fx)) ?? null
  }

  async saveFx(snapshot: FxSnapshot) {
    await this.redis.set(K.fx, snapshot)
  }

  async addFxHistory(entry: FxHistoryEntry) {
    await this.redis.lpush(K.fxHistory, entry)
    await this.redis.ltrim(K.fxHistory, 0, HISTORY_LIMIT - 1)
  }

  async listFxHistory() {
    return this.redis.lrange<FxHistoryEntry>(K.fxHistory, 0, 49)
  }
}

interface FileShape {
  seq: number
  orders: Record<string, Order>
  settings?: ShopAdminSettings
  fx?: FxSnapshot
  fxHistory: FxHistoryEntry[]
}

class FileShopStore implements ShopStore {
  private readonly file = path.join(process.cwd(), 'data', 'shop.json')
  private queue: Promise<unknown> = Promise.resolve()

  private async read(): Promise<FileShape> {
    let raw: string
    try {
      raw = await readFile(this.file, 'utf8')
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return { seq: 0, orders: {}, fxHistory: [] }
      throw error
    }
    // Never treat an unreadable file as empty: the next write would wipe the orders.
    return JSON.parse(raw) as FileShape
  }

  /** Serialises writes so two requests never overwrite each other. */
  private update<T>(fn: (data: FileShape) => T): Promise<T> {
    const run = this.queue.then(async () => {
      const data = await this.read()
      const result = fn(data)
      await mkdir(path.dirname(this.file), { recursive: true })
      const tmp = `${this.file}.${randomUUID()}.tmp`
      await writeFile(tmp, JSON.stringify(data, null, 2), 'utf8')
      await rename(tmp, this.file)
      return result
    })
    this.queue = run.catch(() => undefined)
    return run
  }

  nextSequence() {
    return this.update((d) => (d.seq += 1))
  }

  async saveOrder(order: Order) {
    await this.update((d) => {
      d.orders[order.invoiceNumber] = order
    })
  }

  async getOrder(invoiceNumber: string) {
    return (await this.read()).orders[invoiceNumber] ?? null
  }

  async listOrders() {
    return Object.values((await this.read()).orders).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  async getSettings() {
    return { ...defaultAdminSettings(), ...((await this.read()).settings ?? {}) }
  }

  async saveSettings(settings: ShopAdminSettings) {
    await this.update((d) => {
      d.settings = settings
    })
  }

  async getFx() {
    return (await this.read()).fx ?? null
  }

  async saveFx(snapshot: FxSnapshot) {
    await this.update((d) => {
      d.fx = snapshot
    })
  }

  async addFxHistory(entry: FxHistoryEntry) {
    await this.update((d) => {
      d.fxHistory = [entry, ...d.fxHistory].slice(0, HISTORY_LIMIT)
    })
  }

  async listFxHistory() {
    return (await this.read()).fxHistory.slice(0, 50)
  }
}

export class ShopStorageUnavailableError extends Error {
  constructor() {
    super('Shop storage is not configured: set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.')
  }
}

// One store per server process, even when Next.js bundles routes separately.
const globalStore = globalThis as unknown as { __teamShopStore?: ShopStore }

export function shopStore(): ShopStore {
  if (globalStore.__teamShopStore) return globalStore.__teamShopStore
  let store: ShopStore
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim()
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim()
  if (url && token) {
    store = new RedisShopStore(new Redis({ url, token }))
  } else if (process.env.VERCEL) {
    throw new ShopStorageUnavailableError()
  } else {
    store = new FileShopStore()
  }
  globalStore.__teamShopStore = store
  return store
}
