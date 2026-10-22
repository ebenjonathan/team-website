'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { findShopItem, shopSettings, type ShopItem } from '@/lib/data/shop'

export interface CartLine {
  id: string
  quantity: number
}

interface CartContextValue {
  lines: CartLine[]
  detailed: { item: ShopItem; quantity: number; lineTotal: number }[]
  count: number
  subtotal: number
  ready: boolean
  isOpen: boolean
  open: () => void
  close: () => void
  add: (id: string, quantity?: number) => void
  setQuantity: (id: string, quantity: number) => void
  remove: (id: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = 'team-shop-cart-v1'

function readStored(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? (JSON.parse(raw) as CartLine[]) : []
    return Array.isArray(parsed)
      ? parsed.filter((l) => findShopItem(l.id) && Number.isInteger(l.quantity) && l.quantity > 0)
      : []
  } catch {
    return []
  }
}

const clamp = (n: number) => Math.max(1, Math.min(shopSettings.maxQuantity, Math.round(n) || 1))

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [ready, setReady] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setLines(readStored())
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      /* private mode or storage blocked: the cart still works for this visit */
    }
  }, [lines, ready])

  const add = useCallback((id: string, quantity = 1) => {
    if (!findShopItem(id)) return
    setLines((prev) => {
      const existing = prev.find((l) => l.id === id)
      return existing
        ? prev.map((l) => (l.id === id ? { ...l, quantity: clamp(l.quantity + quantity) } : l))
        : [...prev, { id, quantity: clamp(quantity) }]
    })
    setIsOpen(true)
  }, [])

  const setQuantity = useCallback((id: string, quantity: number) => {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, quantity: clamp(quantity) } : l)))
  }, [])

  const remove = useCallback((id: string) => setLines((prev) => prev.filter((l) => l.id !== id)), [])
  const clear = useCallback(() => setLines([]), [])

  const value = useMemo<CartContextValue>(() => {
    const detailed = lines
      .map((l) => {
        const item = findShopItem(l.id)
        return item ? { item, quantity: l.quantity, lineTotal: item.price * l.quantity } : null
      })
      .filter((x): x is NonNullable<typeof x> => !!x)
    return {
      lines,
      detailed,
      count: detailed.reduce((s, d) => s + d.quantity, 0),
      subtotal: detailed.reduce((s, d) => s + d.lineTotal, 0),
      ready,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add,
      setQuantity,
      remove,
      clear,
    }
  }, [lines, ready, isOpen, add, setQuantity, remove, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
