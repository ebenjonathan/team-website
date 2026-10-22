export type OrderStatus =
  | 'awaiting_payment'
  | 'proof_received'
  | 'paid'
  | 'dispatched'
  | 'delivered'
  | 'cancelled'
  | 'expired'

export interface OrderLine {
  id: string
  name: string
  detail?: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

export interface Order {
  invoiceNumber: string
  createdAt: string
  validUntil: string
  status: OrderStatus
  customer: {
    name: string
    company?: string
    email: string
    phone: string
    taxNumber?: string
  }
  delivery: {
    id: string
    label: string
    price: number
    address?: string
    promise: string
    workingDays: number
  }
  notes?: string
  items: OrderLine[]
  subtotal: number
  deliveryFee: number
  total: number
  vat: number
  vatRatePercent: number
  zarPerUsd: number | null
  totalZar: number | null
  uploadToken: string
  proof?: { filename: string; receivedAt: string }
  paidAccount?: 'zb-usd' | 'fnb-zar'
  amountReceived?: number
  paidAt?: string
  expectedDeliveryDate?: string
  dispatchedAt?: string
  trackingNote?: string
  deliveredAt?: string
  cancelledAt?: string
  expiredAt?: string
  reminderSentAt?: string
  adminNotes?: string
  emailErrors: string[]
  history: { at: string; event: string }[]
}

export interface ShopAdminSettings {
  /** Cushion added to the market rate, in percent. */
  markupPercent: number
  /** When set, used instead of the automatic rate. */
  manualOverride: number | null
  /** Public holidays (YYYY-MM-DD) skipped when counting working days. */
  holidays: string[]
}

export interface FxSnapshot {
  marketRate: number
  source: string
  /** The date the provider says the rate applies to. */
  rateDate?: string
  fetchedAt: string
}

export interface FxHistoryEntry {
  at: string
  ok: boolean
  source?: string
  marketRate?: number
  message?: string
}

export const statusLabels: Record<OrderStatus, string> = {
  awaiting_payment: 'Awaiting payment',
  proof_received: 'Proof received – we’re checking',
  paid: 'Paid',
  dispatched: 'On its way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  expired: 'Expired',
}
