// ─── TEAM tools ──────────────────────────────────────────────────────────────
// This is the one place to add or update your culture tools. Everything else
// (homepage, Tools page, menu) reads from this list.
//
// To add a tool, copy one entry and change it:
//   slug         short id used in the page address, e.g. 'values-cards'
//   name         the tool's name as visitors should see it
//   kicker       a few words on what it helps people do
//   description  one or two sentences, plain language
//   status       'live' (shows the link) or 'coming-soon' (shows an enquiry link)
//   href         the full web address of the tool, when it is live
//   category     'culture' | 'engagement' | 'diagnostic'
//   image        optional: a picture in /public/images/tools/, e.g. '/images/tools/storybook.webp'
//   featured     optional: true to show it on the homepage

export type ToolStatus = 'live' | 'coming-soon'
export type ToolCategory = 'culture' | 'engagement' | 'diagnostic'

export interface TeamTool {
  slug: string
  name: string
  kicker: string
  description: string
  status: ToolStatus
  category: ToolCategory
  href?: string
  image?: string
  featured?: boolean
}

export const toolCategories: Record<ToolCategory, { title: string; body: string }> = {
  culture: {
    title: 'Culture tools',
    body: 'Help your people name, share and live the culture you want.',
  },
  engagement: {
    title: 'Engagement tools',
    body: 'Hear what your people think, and act on it.',
  },
  diagnostic: {
    title: 'Diagnostic tools',
    body: 'See where your organisation stands before you decide what to change.',
  },
}

export const teamTools: TeamTool[] = [
  {
    slug: 'culture-storybook',
    name: 'TEAM Culture Storybook',
    kicker: 'Put your culture into words',
    description:
      'Capture the values, rituals and stories that define who you are, and share them with every new joiner.',
    status: 'live',
    category: 'culture',
    href: 'https://team-storybook.vercel.app/',
    featured: true,
  },
  {
    slug: 'culture-engine',
    name: 'TEAM Culture Engine',
    kicker: 'Turn culture into everyday practice',
    description:
      'An interactive tool that helps teams explore, shape and strengthen the culture they want to build.',
    status: 'live',
    category: 'culture',
    // Replace with the public share link if this one only opens for you.
    href: 'https://claude.ai/artifact/RNZCnJL3Rwp7BDBNFHToDX',
    featured: true,
  },
  {
    slug: 'team-surveys',
    name: 'TEAM Surveys',
    kicker: 'Hear what your people think',
    description:
      'Pulse checks and diagnostic surveys that surface honest insight on engagement, alignment and team health.',
    status: 'coming-soon',
    category: 'engagement',
    featured: true,
  },
  {
    slug: 'greater-diagnosis',
    name: 'GREATER Diagnosis Tool',
    kicker: 'One clear picture of organisational health',
    description:
      'A comprehensive assessment that pinpoints gaps across all seven GREATER outcomes and charts a clear path to high performance.',
    status: 'coming-soon',
    category: 'diagnostic',
  },
]

export const liveTools = teamTools.filter((t) => t.status === 'live')
export const featuredTools = teamTools.filter((t) => t.featured)
