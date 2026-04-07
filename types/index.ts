export interface Service {
  id: string
  slug: string
  title: string
  description: string
  icon: string
  features: string[]
  price?: string
  image?: string
  fullDescription?: string
  benefits?: string[]
  deliverables?: string[]
  notableAssignments?: string[]
  downloadableProfile?: string
  businessUnit?: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  image: string
  yearsConsulting?: number
  overallExperience?: number
  qualifications?: string[]
  socialLinks: {
    twitter?: string
    linkedin?: string
    instagram?: string
  }
}

export interface CaseStudy {
  id: string
  slug: string
  title: string
  category: string
  client: string
  duration: string
  image: string
  summary: string
  tags: string[]
  metrics?: { label: string; value: string }[]
  services?: string[]
  challenge?: string
  approach?: string
  technologies?: {
    frontend?: string[]
    backend?: string[]
    infrastructure?: string[]
  }
}

export interface Event {
  id: string
  slug: string
  title: string
  date: string
  time: string
  location: string
  description: string
  category: string
  isFeatured?: boolean
  image?: string
  fullDescription?: string
  agenda?: {
    time: string
    title: string
  }[]
  speakers?: {
    name: string
    title: string
    company: string
  }[]
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  quote: string
  image: string
  rating?: number
}

export interface PricingPlan {
  id: string
  name: string
  monthlyPrice: number
  yearlyPrice: number
  description: string
  features: string[]
  isFeatured?: boolean
  ctaLabel: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  keywords?: string[]
}

export interface ClientLogo {
  id: string
  name: string
  logo: string
  website?: string
}

export interface Partner {
  id: string
  name: string
  logo: string
  description: string
  type: 'technology' | 'strategic' | 'community'
  website?: string
}

export interface BusinessUnit {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  services: string[]
  head?: string
  image?: string
}

export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

export interface Stat {
  label: string
  target?: number
  prefix?: string
  suffix?: string
  display?: string
}
