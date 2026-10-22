// ─── TEAM shop: products, prices and shop settings ──────────────────────────
// This is the one place to change what the shop sells and how orders work.
// The shop pages, cart, checkout, invoice PDF and emails all read from here.
//
// Prices are in US dollars and INCLUDE VAT (see shopSettings.tax).
// Single-item prices come from "Culture Engine Pricing.xlsx".

import type { EnquiryTopic } from './enquiry'

export interface ShopProduct {
  id: string
  kind: 'product'
  name: string
  series: string
  price: number
  shortDescription: string
  description: string[]
  whatsInside: string[]
  modules?: string[]
  bestFor: string
  note?: string
  specs: { label: string; value: string }[]
  pairsWith: string[]
  images: { src: string; alt: string }[]
  alternateImages?: { src: string; alt: string; label: string }[]
}

export interface ShopBundle {
  id: string
  kind: 'bundle'
  name: string
  price: number
  items: string[]
  shortDescription: string
  images: { src: string; alt: string }[]
}

export type ShopItem = ShopProduct | ShopBundle

export const shopProducts: ShopProduct[] = [
  {
    id: 'culture-leadership-playbook',
    kind: 'product',
    name: 'Culture Leadership Playbook',
    series: 'TEAM Culture Engine™',
    price: 75,
    shortDescription: 'A 12-month operating system for executives and managers leading culture transformation.',
    description: [
      'Culture is decided in the leadership room. This playbook gives executives and managers a structured year of work: one module a month, each run in the same four movements — private solo work, a coaching conversation, a 90-minute Leadership Forum with peers, and one behaviour practised visibly in the business.',
      "The twelve modules move through four phases — Self, Team, Organisation and Legacy — starting with 'The Leader as Culture Architect' and ending with the team's own Leadership Culture Charter. Every Forum opens with evidence against last month's commitments, not intentions.",
    ],
    whatsInside: [
      '12 monthly modules, each with solo reflection, an executive exercise, a practice plan and a commitment contract',
      'Coaching conversation guides for each module',
      'Leadership Forum guides for each module',
      'The Leadership Culture Scorecard',
      'Forum Commitment Log and Culture Charter template',
      "The Leader's Quick Tools",
    ],
    modules: [
      'The Leader as Culture Architect',
      'The Shadow You Cast',
      'Creating Safety to Speak',
      'Clarity: Say, Measure, Reward',
      'Values into Executive Behaviour',
      'Systems and Incentives',
      'Distributing Authority',
      'Candour at the Top',
      'Motivation: Autonomy, Mastery, Purpose',
      "The Leader's Reinforcement Routines",
      'Sponsoring the Champion Network',
      'The Leadership Culture Charter',
    ],
    bestFor: 'CEOs, managing directors, executive teams and senior managers.',
    specs: [
      { label: 'Format', value: 'Landscape, spiral-bound' },
      { label: 'Pages', value: '176' },
      { label: 'Edition', value: 'Version 1.0' },
    ],
    pairsWith: ['culture-champions-playbook', 'card-deck'],
    images: [
      { src: '/images/shop/culture-leadership-playbook.webp', alt: 'Culture Leadership Playbook cover' },
      { src: '/images/shop/culture-leadership-playbook_inside-1.webp', alt: 'Contents page of the Culture Leadership Playbook' },
      { src: '/images/shop/culture-leadership-playbook_inside-2.webp', alt: 'The 12-month journey map' },
      { src: '/images/shop/culture-leadership-playbook_inside-3.webp', alt: 'Module 01 opening page: The Leader as Culture Architect' },
      { src: '/images/shop/culture-leadership-playbook_inside-4.webp', alt: 'A practice page from Module 01' },
    ],
  },
  {
    id: 'culture-champions-playbook',
    kind: 'product',
    name: 'Culture Champions Playbook',
    series: 'TEAM Culture Engine™ · Champion Edition 2026',
    price: 50,
    shortDescription: 'The 2-in-1 guidebook and monthly workbook for Culture Champions.',
    description: [
      'Culture Champions carry the culture into daily moments across the organisation. This playbook teaches them how to do the role well — and then gives them everything they need to run one honest team conversation a month, for a year.',
      'Part One is the guidebook: read once during onboarding, then kept as a reference. Part Two is the monthly workbook: open the current month and run it. Every month follows the same eight pages — Overview, Learn, Understand, Facilitate, Cheat Sheet, Capture, Act and Reflect.',
    ],
    whatsInside: [
      'Part One — the Champion Guidebook: the role, how to facilitate, how to listen, how to complete capture forms, what to do when the system resists, facilitation scripts and 11 champion tools',
      'Part Two — the Monthly Workbook: 12 modules, eight pages each',
      'A close-of-year annual reflection',
    ],
    modules: [
      'What Culture Really Is',
      'Psychological Safety',
      'Leadership Behaviour',
      'Clarity & Alignment',
      'Values into Behaviour',
      'Systems Shape Culture',
      'Ownership & Accountability',
      'Feedback, Candour & Respect',
      'Motivation',
      'Habits & Reinforcement',
      'Fearless Culture',
      'The Stinky Fish',
    ],
    bestFor: 'Culture Champions, change agents and team leads who host monthly team conversations.',
    note: 'The monthly cycle refers to submitting insights to the online Culture Engine platform. Platform access is included in our Culture Champions Programme, not with the book on its own.',
    specs: [
      { label: 'Format', value: 'Landscape, spiral-bound' },
      { label: 'Pages', value: '128' },
      { label: 'Edition', value: 'Champion Edition 2026' },
    ],
    pairsWith: ['teambuilding-playbook', 'card-deck'],
    images: [
      { src: '/images/shop/culture-champions-playbook.webp', alt: 'Culture Champions Playbook cover' },
      { src: '/images/shop/culture-champions-playbook_inside-1.webp', alt: 'How to use the playbook: one playbook, two parts' },
      { src: '/images/shop/culture-champions-playbook_inside-2.webp', alt: 'The annual rhythm: twelve months, twelve conversations' },
      { src: '/images/shop/culture-champions-playbook_inside-3.webp', alt: 'A story page from Month 01' },
      { src: '/images/shop/culture-champions-playbook_inside-4.webp', alt: 'The one-page session companion' },
    ],
  },
  {
    id: 'teambuilding-playbook',
    kind: 'product',
    name: 'Teambuilding Activities Playbook',
    series: 'A Practical Facilitation System for Culture Transformation',
    price: 40,
    shortDescription: '36 activities, 9 categories, 4 layers — a facilitation system built for behaviour change.',
    description: [
      'This is not a games manual. Most team sessions fail because nothing around the activity is designed: no diagnosis beforehand, weak facilitation in the room and no follow-through afterwards. This playbook supplies all three.',
      'It runs in four layers — Diagnose, Intervene, Facilitate, Reinforce. Each of the 36 activities is a self-contained two-page spread, built to lie open on the table while you work: objective, when to use it (and when not to), duration, group size, energy level, setting, materials, step-by-step guide, debrief and adaptations.',
    ],
    whatsInside: [
      'Diagnose: a five-stage team maturity model, six pre-session questions and five red flags for when not to run an activity',
      'Intervene: 36 activities in 9 categories — Icebreakers (4), Trust Builders (4), Communication (5), Collaboration (4), Problem-Solving & Execution (5), High-Energy / Outdoor (6), Culture Reinforcement (2), Alignment (2), Reflection (4)',
      "Facilitate: three protocols — the 60-minute pre-session, reading and moving the room's energy, and the four-question debrief",
      'Reinforce: a 7-day follow-up loop, three manager scripts and three measures read at day 7, 30 and 90',
      'Four session templates: 60 minutes, half day, full day and quarterly',
      'A quick-reference activity picker',
    ],
    bestFor: 'Culture Champions, HR and L&D teams, and managers who run their own team sessions.',
    specs: [
      { label: 'Format', value: 'A5 portrait, spiral-bound' },
      { label: 'Pages', value: '107' },
    ],
    pairsWith: ['culture-champions-playbook', 'card-deck'],
    images: [
      { src: '/images/shop/teambuilding-playbook-illustrated.webp', alt: 'Teambuilding Activities Playbook cover' },
      { src: '/images/shop/teambuilding-playbook_inside-1.webp', alt: 'Contents page of the Teambuilding Activities Playbook' },
      { src: '/images/shop/teambuilding-playbook_inside-2.webp', alt: 'The system: four layers, one outcome' },
      { src: '/images/shop/teambuilding-playbook_inside-3.webp', alt: 'The activity portfolio: nine categories' },
      { src: '/images/shop/teambuilding-playbook_inside-4.webp', alt: 'The team maturity model' },
    ],
    alternateImages: [
      { src: '/images/shop/teambuilding-playbook-plain.webp', alt: 'Teambuilding Activities Playbook, plain cover edition', label: 'Plain cover' },
    ],
  },
  {
    id: 'card-deck',
    kind: 'product',
    name: 'TEAM Culture Engine™ Card Deck',
    series: 'TEAM Culture Engine™',
    price: 25,
    shortDescription: '78 conversation cards that get teams talking honestly about how they really work.',
    description: [
      "Draw a card, read the prompt out loud, and go round the table. Each card asks one question a team usually avoids — 'What problem are we pretending is smaller than it is?' — and the reverse tells the facilitator what the answer reveals and which follow-up question to ask next.",
      'Use it for a 10-minute meeting opener, a 45-minute team session or a leadership forum warm-up. No preparation and no facilitation training needed.',
    ],
    whatsInside: [
      '78 conversation cards in 10 suites: Reality Check, Trust, Alignment, Behaviour, Performance, Reflection, Emotional Culture, Belonging & Inclusion, Courage & Fearlessness, and Soul & Dignity',
      "Each card: the prompt on the front; 'What this reveals' and a facilitator follow-up on the back",
      '6 guide cards: how to use the deck, the ten suites, house rules and three ready-made plays (The Opener · 10 min, The Session · 45 min, The Forum Warm-Up · 15 min)',
    ],
    bestFor: 'Any team, at any level. Ideal for weekly check-ins and meeting openers.',
    specs: [
      { label: 'Card size', value: 'A6 (105 × 148 mm)' },
      { label: 'Cards', value: '78 conversation cards + 6 guide cards' },
    ],
    pairsWith: ['culture-champions-playbook', 'culture-leadership-playbook'],
    images: [
      { src: '/images/shop/card-deck.webp', alt: 'TEAM Culture Engine Card Deck' },
      { src: '/images/shop/card-deck-samples.webp', alt: 'Three sample cards: Reality Check, Alignment and Reflection' },
    ],
  },
  {
    id: 'pocketbook',
    kind: 'product',
    name: "A Leader's Pocketbook to Culture Transformation",
    series: 'TEAM Culture Engine™ · Culture Practice',
    price: 10,
    shortDescription: 'A pocket guide to the daily culture practices of leaders and managers.',
    description: [
      'A small book to keep on the desk or in a bag: the everyday practices that leaders and managers use to build the culture they want, between the big meetings and the formal programmes.',
    ],
    whatsInside: [],
    bestFor: 'Leaders and managers at every level.',
    specs: [{ label: 'Format', value: 'Pocket size, paperback' }],
    pairsWith: ['culture-leadership-playbook', 'card-deck'],
    images: [
      { src: '/images/shop/pocketbook-front.webp', alt: "A Leader's Pocketbook to Culture Transformation, front cover" },
      { src: '/images/shop/pocketbook-back.webp', alt: "A Leader's Pocketbook to Culture Transformation, back cover" },
    ],
  },
]

// Bundle prices are suggestions (about 9% off the items bought separately).
export const shopBundles: ShopBundle[] = [
  {
    id: 'champion-kit',
    kind: 'bundle',
    name: 'Culture Champion Kit',
    price: 105,
    items: ['culture-champions-playbook', 'teambuilding-playbook', 'card-deck'],
    shortDescription: 'Everything a Culture Champion needs to run a year of team conversations and sessions.',
    images: [{ src: '/images/shop/collection-flatlay.webp', alt: 'The Culture Champion Kit playbooks laid out together' }],
  },
  {
    id: 'leader-kit',
    kind: 'bundle',
    name: 'Culture Leader Kit',
    price: 100,
    items: ['culture-leadership-playbook', 'card-deck', 'pocketbook'],
    shortDescription: 'The leadership playbook with the card deck and pocketbook for daily practice.',
    images: [{ src: '/images/shop/culture-leadership-playbook.webp', alt: 'Culture Leadership Playbook cover' }],
  },
]

/** Programmes and services are enquiry-only: they include training, coaching and platform access. */
export const shopProgrammes: { id: string; name: string; summary: string; topic: EnquiryTopic }[] = [
  {
    id: 'champions-programme',
    name: 'Culture Champions Programme',
    summary:
      'Training for all champions, the Champions Playbook, the Teambuilding Activities Playbook and Year 1 access to the online Culture Engine platform (Champions module).',
    topic: 'culture',
  },
  {
    id: 'managers-programme',
    name: "Manager's Culture Programme",
    summary:
      'Orientation training for managers, the manager playbook, the Pocketbook and the Card Deck. The Guided version adds two one-to-one coaching sessions per manager.',
    topic: 'mdp',
  },
  {
    id: 'leadership-programme',
    name: 'Leadership Culture Programme',
    summary:
      "Orientation, the Culture Leadership Playbook, a year's access to the Culture Engine Leadership module, group and individual coaching, and Card Decks for managers.",
    topic: 'ldp',
  },
]

export const shopServices: { id: string; name: string; summary: string; topic: EnquiryTopic }[] = [
  { id: 'culture-diagnostic', name: 'Culture diagnostic', summary: 'A candid read on where your team actually is today.', topic: 'culture' },
  { id: 'leadership-coaching', name: 'Leadership coaching', summary: 'One-to-one support on the conversation you are avoiding.', topic: 'coaching' },
  { id: 'team-workshops', name: 'Team workshops', summary: 'Facilitated sessions on any of the five elements.', topic: 'team-building' },
]

// ─── Shop settings ───────────────────────────────────────────────────────────

export interface DeliveryOption {
  id: string
  label: string
  /** US$ incl. VAT. Set to null to hide the option until a price is agreed. */
  price: number | null
  needsAddress: boolean
  /** Working days from payment confirmation, used for the expected delivery date. */
  workingDays: number
  /** Overrides the default delivery promise for this option. */
  promise?: string
}

export interface BankAccount {
  id: 'zb-usd' | 'fnb-zar'
  label: string
  country: string
  currency: 'USD' | 'ZAR'
  bankName: string
  accountName: string
  accountNumber: string
  branch: string
  branchCode?: string
  swiftCode?: string
}

export const shopSettings = {
  seller: {
    legalName: 'Delview Investments (Pvt) Ltd',
    tradingName: 'TEAM Consulting',
    address: 'P.O. Box MP795, Mount Pleasant, Harare, Zimbabwe',
    email: 'info@team.co.zw',
    phones: ['+263 772 998 591', '+27 83 718 8203'],
    website: 'teamadvisoryservices.com',
    tin: '2000129740',
    vatNumber: '220129224',
  },
  banks: [
    {
      id: 'zb-usd',
      label: 'Pay in Zimbabwe (US$)',
      country: 'Zimbabwe',
      currency: 'USD',
      bankName: 'ZB Bank',
      accountName: 'Delview Investments T/A TEAM Consulting',
      accountNumber: '413000498179405',
      branch: 'Premier',
    },
    {
      id: 'fnb-zar',
      label: 'Pay in South Africa (ZAR)',
      country: 'South Africa',
      currency: 'ZAR',
      bankName: 'First National Bank (FNB)',
      accountName: 'Delview Investments (Pty) Ltd',
      accountNumber: '63230822769',
      branch: 'Remote Account Opening',
      branchCode: '210835',
      swiftCode: 'FIRNZAJJ',
    },
  ] as BankAccount[],
  tax: {
    vatRegistered: true,
    /** Standard Zimbabwe VAT rate from 1 January 2026. */
    vatRatePercent: 15.5,
    pricesIncludeVat: true,
  },
  invoice: {
    documentTitle: 'Pro-forma Invoice',
    numberPrefix: 'TEAM-WEB-',
    validForDays: 7,
    footerNote: 'A tax invoice will be issued once payment has been received.',
  },
  exchangeRate: {
    source: 'https://api.frankfurter.dev/v2/rate/usd/zar',
    backupSource: 'https://open.er-api.com/v6/latest/USD',
    /** Refresh the cached rate when it is older than this (the daily job also refreshes it). */
    refreshAfterHours: 12,
    /** Default cushion on top of the market rate. Editable in /admin. */
    defaultMarkupPercent: 0,
    /** Reject a new rate that moves more than this from the last good one. */
    maxDailyChangePercent: 5,
    /** With no successful update for this long, the South Africa option is hidden. */
    staleAfterHours: 96,
  },
  delivery: {
    promise: 'Delivered within 3 working days of payment confirmation',
    options: [
      { id: 'collect', label: 'Collect from TEAM Consulting, Harare', price: 0, needsAddress: false, workingDays: 3, promise: 'Ready for collection within 3 working days of payment confirmation' },
      // TODO(confirm): Harare delivery is free until a fee is agreed.
      { id: 'harare', label: 'Delivery within Harare', price: 0, needsAddress: true, workingDays: 3 },
      // Set a price to show these options at checkout.
      { id: 'zimbabwe', label: 'Courier to the rest of Zimbabwe', price: null, needsAddress: true, workingDays: 5, promise: 'Delivered by courier within 3–5 working days of payment confirmation' },
      { id: 'south-africa', label: 'Courier to South Africa', price: null, needsAddress: true, workingDays: 7, promise: 'Delivered by courier within 5–7 working days of payment confirmation' },
    ] as DeliveryOption[],
  },
  bulkOrders: {
    threshold: 20,
    message: 'Ordering 20 or more copies for your organisation? Contact us for volume pricing.',
  },
  maxQuantity: 99,
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const shopItems: ShopItem[] = [...shopProducts, ...shopBundles]

export function findShopItem(id: string): ShopItem | undefined {
  return shopItems.find((i) => i.id === id)
}

export function findProduct(id: string): ShopProduct | undefined {
  return shopProducts.find((p) => p.id === id)
}

export function bundleItemsTotal(bundle: ShopBundle): number {
  return bundle.items.reduce((sum, id) => sum + (findProduct(id)?.price ?? 0), 0)
}

export function availableDeliveryOptions(): DeliveryOption[] {
  return shopSettings.delivery.options.filter((o) => typeof o.price === 'number')
}

export function deliveryPromise(option: DeliveryOption | undefined): string {
  return option?.promise ?? shopSettings.delivery.promise
}
