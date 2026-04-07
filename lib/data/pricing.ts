import type { PricingPlan, FAQ } from '@/types'

export const pricingPlans: PricingPlan[] = [
  {
    id: '1',
    name: 'Starter',
    monthlyPrice: 12,
    yearlyPrice: 10,
    description: 'Perfect for small businesses and startups getting their digital footing.',
    features: [
      '5-page website',
      'Basic SEO setup',
      'Monthly analytics report',
      'Email support',
      '1 revision cycle',
    ],
    ctaLabel: 'Get Started',
  },
  {
    id: '2',
    name: 'Pro',
    monthlyPrice: 29,
    yearlyPrice: 24,
    description: 'Ideal for growing businesses ready to scale their digital operations.',
    features: [
      '15-page website',
      'Advanced SEO + content strategy',
      'Weekly analytics dashboard',
      'Priority support (24h response)',
      '3 revision cycles',
      'Social media setup',
      'Basic CRM integration',
    ],
    isFeatured: true,
    ctaLabel: 'Get Started',
  },
  {
    id: '3',
    name: 'Business',
    monthlyPrice: 59,
    yearlyPrice: 49,
    description: 'Comprehensive solutions for established businesses with complex needs.',
    features: [
      'Unlimited pages',
      'Full digital marketing suite',
      'Real-time analytics + reporting',
      'Dedicated account manager',
      'Unlimited revisions',
      'Custom integrations',
      'Monthly strategy sessions',
      'Priority SLA (4h response)',
    ],
    ctaLabel: 'Contact Sales',
  },
]

export const faqs: FAQ[] = [
  {
    id: '1',
    question: 'How do we get started working together?',
    answer:
      "Simply reach out via our Contact Us page or call us directly. We'll schedule a discovery call to understand your goals, then propose a tailored solution and engagement plan. Most engagements kick off within two weeks of the initial conversation.",
  },
  {
    id: '2',
    question: 'What industries do you specialise in?',
    answer:
      "We work across a broad range of industries including finance, healthcare, retail, logistics, education, and professional services. Our team adapts our approach to each sector's unique challenges, regulatory context, and competitive dynamics.",
  },
  {
    id: '3',
    question: 'Do you offer ongoing support after project delivery?',
    answer:
      'Absolutely. We offer retainer-based support packages to ensure your digital solutions remain current, optimised, and aligned with your evolving business needs. Our support tiers range from basic maintenance to dedicated account management.',
  },
  {
    id: '4',
    question: 'Can you work with our existing technology stack?',
    answer:
      'Yes. Our engineers are experienced across diverse technology ecosystems. We conduct a thorough assessment of your current infrastructure and recommend the best integration approach — whether that means augmenting, extending, or replacing components.',
  },
  {
    id: '5',
    question: 'How long does a typical project take?',
    answer:
      'Timelines vary based on scope and complexity. A brand identity project may take 4–6 weeks, while a complex web platform could take 3–6 months. We define clear milestones and maintain transparent communication throughout every phase.',
  },
]
