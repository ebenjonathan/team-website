import { serviceAreas } from './masterBrief'

export const services = serviceAreas
export const featuredServices = services

// The three practice areas and their main offerings, as set out in the 2026
// corporate profile. Used to group the services page. Each service slug
// appears in exactly one group.
export const practiceAreas = [
  {
    title: 'Strategy & Governance',
    offerings: [
      'Strategy Development & Facilitation',
      'Business Model Design',
      'Policy and Reform',
      'Governance & Board Advisory',
      'Performance Management',
      'Implementation Support and M&E',
    ],
    slugs: ['strategy-design', 'governance-policy', 'implementation'],
  },
  {
    title: 'Process & Technology',
    offerings: [
      'Analytics, Surveys & Benchmarking',
      'Business Process Reengineering',
      'Supply Chain & Cost Optimisation',
      'Robotic Process Automation (RPA)',
      'Technology-Enabled Transformation',
    ],
    slugs: ['operations', 'analytics-research'],
  },
  {
    title: 'People & Culture',
    offerings: [
      'Culture Transformation',
      'Engagement',
      'Change Management',
      'Organisation Development',
      'Team Building & Facilitation',
      'Training & Capacity Building',
      'Wellness & Executive Coaching',
      'Recruitment & Talent Advisory',
    ],
    slugs: ['organisation-culture', 'wellness-coaching'],
  },
]
