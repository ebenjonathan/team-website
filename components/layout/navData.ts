import { liveTools } from '@/lib/data/tools'

// Navigation is organised by who the visitor is leading, not by internal
// service names, so people can find help from the problem they have.

export interface NavLink {
  label: string
  href: string
  external?: boolean
}

export interface NavColumn {
  heading: string
  links: NavLink[]
}

export interface NavGroup {
  label: string
  href: string
  columns?: NavColumn[]
  feature?: { heading: string; body: string; link: NavLink }
  footnote?: { lead: string; link: NavLink }
}

const diagnosticFeature = {
  heading: 'Start with a clear picture',
  body: 'See where your organisation stands on the seven GREATER outcomes before you commit to anything.',
  link: { label: 'Free GREATER Diagnostic', href: '/free-diagnostic' },
}

export const navGroups: NavGroup[] = [
  {
    label: 'Lead your organisation',
    href: '/service-offerings',
    columns: [
      {
        heading: 'Set a clear direction',
        links: [
          { label: 'Strategy', href: '/service-offerings/strategy-design' },
          { label: 'Governance & Policy', href: '/service-offerings/governance-policy' },
          { label: 'Analytics & Research', href: '/service-offerings/analytics-research' },
        ],
      },
      {
        heading: 'Make it work day to day',
        links: [
          { label: 'Operations', href: '/service-offerings/operations' },
          { label: 'Implementation', href: '/service-offerings/implementation' },
        ],
      },
    ],
    feature: diagnosticFeature,
    footnote: {
      lead: 'Planning a big change?',
      link: { label: 'Talk to us about a scoped engagement', href: '/contact-us?topic=strategy#enquiry' },
    },
  },
  {
    label: 'Lead your teams',
    href: '/service-offerings/organisation-culture',
    columns: [
      {
        heading: 'Develop your people',
        links: [
          { label: 'Team building', href: '/programmes/team-building' },
          { label: 'Leadership Development Programmes', href: '/programmes/leadership-development-programmes' },
          { label: 'Management Development Programmes', href: '/programmes/management-development-programmes' },
        ],
      },
      {
        heading: 'Build the culture',
        links: [
          { label: 'Organisation & Culture', href: '/service-offerings/organisation-culture' },
          { label: 'Implementation coaching', href: '/service-offerings/implementation' },
          { label: 'Wellness & Coaching', href: '/service-offerings/wellness-coaching' },
        ],
      },
      {
        heading: 'Tools',
        links: [
          ...liveTools.map((t) => ({ label: t.name, href: t.href ?? '/tools', external: !!t.href })),
          { label: 'All TEAM tools', href: '/tools' },
        ],
      },
    ],
    feature: diagnosticFeature,
    footnote: {
      lead: 'Want your leaders working as one team?',
      link: { label: 'Ask about a facilitated session', href: '/contact-us?topic=culture#enquiry' },
    },
  },
  {
    label: 'Ideas',
    href: '/ideas-at-work',
    columns: [
      {
        heading: 'Sharpen your thinking',
        links: [
          { label: 'Practice notes', href: '/ideas-at-work' },
          { label: 'Case stories', href: '/why-team/our-success-stories' },
          { label: 'TEAM tools', href: '/tools' },
          { label: 'Frequently asked questions', href: '/faq' },
        ],
      },
    ],
  },
  {
    label: 'About',
    href: '/who-we-are',
    columns: [
      {
        heading: 'Who we are',
        links: [
          { label: 'Our story', href: '/who-we-are' },
          { label: 'Why TEAM', href: '/why-team' },
          { label: 'Leadership', href: '/why-team/our-team' },
          { label: 'Partners', href: '/why-team/our-partners' },
          { label: 'Markets & clients', href: '/our-markets-clients' },
          { label: 'Careers', href: '/careers' },
        ],
      },
    ],
  },
  { label: 'Contact', href: '/contact-us#enquiry' },
]

export const navCta: NavLink = { label: 'Free diagnostic', href: '/free-diagnostic' }
