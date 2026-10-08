// Associate consultants shown on the Leadership page.
// These are managed from the admin dashboard (/admin → Associates).
// The entries below are only the starting drafts, taken from the company
// profile. They are NOT published until someone ticks "Show on website".

export interface Associate {
  id: string
  name: string
  role: string
  bio: string
  photo?: string
  /** Sanity image asset id, when photos are stored in Sanity */
  photoAssetId?: string
  focusAreas: string[]
  sectors: string[]
  qualifications: string[]
  yearsConsulting?: number
  overallExperience?: number
  linkedin?: string
  published: boolean
  order: number
  updatedAt: string
}

export const associateSeed: Associate[] = [
  {
    id: 'leonard-makoni',
    name: 'Dr Leonard Makoni',
    role: 'Principal Consultant (Workplace Wellness)',
    bio: '',
    focusAreas: ['Workplace wellness', 'Counselling', 'Culture transformation', 'Change management', 'Coaching'],
    sectors: ['Manufacturing', 'Financial services', 'Health', 'Professional services'],
    qualifications: [
      'Master of Philosophy in Veterinary Medicine',
      'Advanced Certificate in Counselling',
      'Certified Grief & End of Life Coach',
      'Diploma in General Management',
      'Associate Certified Coach (Life), International Coaching Federation',
    ],
    yearsConsulting: 7,
    overallExperience: 28,
    published: false,
    order: 10,
    updatedAt: '2026-10-07T00:00:00.000Z',
  },
  {
    id: 'teddy-chikondo',
    name: 'Teddy Tatenda Chikondo',
    role: 'Principal Consultant (Training & Strategy)',
    bio: '',
    focusAreas: ['Strategy', 'Performance management', 'Training', 'Customer engagement', 'Organisational development', 'Coaching'],
    sectors: ['Public sector', 'Local government', 'Development sector', 'Health', 'Professional services', 'Manufacturing', 'Insurance'],
    qualifications: ['MSc Governance and Leadership', 'BSc Tourism and Hospitality Management', 'Certified Management Consultant (SA)'],
    yearsConsulting: 15,
    overallExperience: 17,
    published: false,
    order: 20,
    updatedAt: '2026-10-07T00:00:00.000Z',
  },
  {
    id: 'munya-takawira',
    name: 'Munya Takawira',
    role: 'Senior Consultant (Engagement)',
    bio: '',
    focusAreas: ['Organisational development', 'Team building', 'Implementation', 'Coaching'],
    sectors: ['Public sector', 'Development sector', 'Financial services', 'Oil and gas', 'Manufacturing'],
    qualifications: ['BSc Development Studies', 'Diploma in Systemic Therapy', 'Certified Life Coach (Map4Life, SA)', 'Certified Counsellor (Connect)'],
    yearsConsulting: 6,
    overallExperience: 20,
    published: false,
    order: 30,
    updatedAt: '2026-10-07T00:00:00.000Z',
  },
  {
    id: 'taurai-nyatsanza',
    name: 'Taurai F Nyatsanza',
    role: 'Senior Consultant (Business Development & Projects)',
    bio: '',
    focusAreas: ['Project management', 'Strategy', 'Performance management', 'Implementation', 'Coaching'],
    sectors: ['Public sector', 'Financial services', 'Health', 'Manufacturing'],
    qualifications: ['MBA Banking & Finance Management', 'BComm (Hons) Finance', 'Diploma in Banking'],
    yearsConsulting: 7,
    overallExperience: 20,
    published: false,
    order: 40,
    updatedAt: '2026-10-07T00:00:00.000Z',
  },
]
