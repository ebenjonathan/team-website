import type { BusinessUnit, CaseStudy, ClientLogo, Event, FAQ, Partner, Service, TeamMember } from '@/types'

export const companyProfile = {
  name: 'TEAM Consulting',
  tagline: 'We Are Greater Than Me',
  founded: 2004,
  foundedIn: 'Zimbabwe',
  overview: [
    'TEAM Consulting is a dynamic professional services and management advisory group focused on helping organisations unlock full value in people, processes, and products to realise organisational significance.',
    'What began as TEAM Consulting has evolved into TEAM Advisory Services with registered offices in Zimbabwe and Zambia and partner-based arrangements across other African countries.',
    'The firm runs a cost-effective associate model that combines specialist depth with the responsiveness of a focused boutique practice.',
  ],
  stats: [
    { id: 'years', label: 'Years in Practice', display: '20+' },
    { id: 'consultants', label: 'Consultants & Associates', display: '13+' },
    { id: 'repeat', label: 'Repeat & Referral Clients', display: '80%+' },
    { id: 'sectors', label: 'Sectors Served', display: '6+' },
  ],
  philosophy:
    'Our philosophy is derived from our name TEAM, as we recognise and embrace excellence through collaboration: together, we are greater than me. We focus on significance, not just value creation.',
  fourStrands: [
    {
      title: 'Seek First',
      subtitle: 'Humility and spiritual grounding',
      description:
        'We pursue understanding before prescribing solutions, prioritising truth and significance over mere success.',
      reference: 'Matthew 6:33',
    },
    {
      title: 'Serve Diligently',
      subtitle: 'Excellence with compassion',
      description:
        'We honour the trust of clients, support colleagues, and remain committed to the greater good of our community.',
    },
    {
      title: 'Steward Wisely',
      subtitle: 'Disciplined custodianship',
      description:
        'We practise disciplined management of time, talent, and relationships to deliver transparent results.',
    },
    {
      title: 'Stand Firm',
      subtitle: 'Truth, trust, and transparency',
      description:
        'We choose courage over convenience and uphold what is right in every communication and solution.',
    },
  ],
  greaterFramework: [
    { key: 'G', title: 'Growth', description: 'Expansion of revenue, market share, and strategic reach.' },
    { key: 'R', title: 'Resilience', description: 'Structural and operational fortification against shocks.' },
    { key: 'E', title: 'Efficiency', description: 'Systematic elimination of waste and improved throughput.' },
    { key: 'A', title: 'Agility', description: 'Capacity to pivot decisively as markets and regulations shift.' },
    { key: 'T', title: 'Thrivability', description: 'Long-term organisational health across people and process.' },
    { key: 'E', title: 'Engagement', description: 'A workforce aligned with purpose and reduced attrition.' },
    { key: 'R', title: 'Results', description: 'Quantifiable financial and operational impact.' },
  ],
  approach: [
    {
      title: 'Find the Value',
      phase: 'Discovery & Diagnostics',
      description:
        'Quantify what is at stake, identify root causes of friction, and estimate the size of the prize.',
    },
    {
      title: 'Get the Value',
      phase: 'Execution & Implementation',
      description:
        'Redesign processes, deploy technology, and bridge strategy to operational reality.',
    },
    {
      title: 'Keep the Value',
      phase: 'Sustainability & Governance',
      description:
        'Embed new ways of working with training, KPIs, and governance for sustained outcomes.',
    },
  ],
}

export const serviceAreas: Service[] = [
  {
    id: 'strategy-design',
    slug: 'strategy-design',
    title: 'Strategy & Design',
    description: 'Strategic and operational planning, business model design, and monitoring mechanisms.',
    icon: 'Briefcase',
    features: [
      'Short- and long-term strategic plans',
      'Business model design and refresh',
      'End-of-term strategy evaluations',
      'Strategy monitoring mechanisms',
    ],
    fullDescription:
      'We help organisations define strategic direction, design practical operating models, and sustain disciplined execution through robust performance mechanisms.',
    benefits: [
      'Sharper strategic direction and prioritisation',
      'Faster execution with clearer accountability',
      'Measurable strategy outcomes',
    ],
    deliverables: ['Strategy blueprint', 'Operating model', 'Execution plan', 'Monitoring dashboard'],
    notableAssignments: [
      'Development of Government strategic plans for ministries and local authorities in Zimbabwe and Namibia.',
      'Business model design for a women’s microfinance bank as part of start-up and licensing.',
    ],
    downloadableProfile: '/downloads/service-profile-strategy-design.pdf',
    businessUnit: 'TEAM Consulting',
  },
  {
    id: 'governance-policy',
    slug: 'governance-policy',
    title: 'Governance & Policy',
    description: 'Board effectiveness, governance mechanisms, and policy architecture.',
    icon: 'Shield',
    features: [
      'Board inductions and governance training',
      'Strategic direction and accountability mechanisms',
      'Board performance evaluations',
      'Board-management team building',
    ],
    notableAssignments: [
      'Board inductions for state-owned enterprises and private sector institutions.',
      'Development of board performance contracts for state-owned enterprises.',
    ],
    downloadableProfile: '/downloads/service-profile-governance-policy.pdf',
    businessUnit: 'TEAM Consulting',
  },
  {
    id: 'operations',
    slug: 'operations',
    title: 'Operations',
    description: 'Operational redesign, process re-engineering, and cost transformation.',
    icon: 'Monitor',
    features: [
      'Supply chain optimisation',
      'Business process management and reengineering',
      'Cost transformation initiatives',
      'Operating policies and procedures',
    ],
    notableAssignments: [
      'Procurement model redesign for mining operations with USD 4M savings.',
      'Business process re-engineering across manufacturing, IT, education, and financial services.',
    ],
    downloadableProfile: '/downloads/service-profile-operations.pdf',
    businessUnit: 'TEAM Consulting',
  },
  {
    id: 'sales-marketing-crm',
    slug: 'sales-marketing-crm',
    title: 'Sales, Marketing & CRM',
    description: 'Customer strategy, product design facilitation, and customer engagement analytics.',
    icon: 'TrendingUp',
    features: [
      'Customer strategy and CRM programme development',
      'New product design facilitation',
      'Customer engagement analysis',
    ],
    notableAssignments: [
      'CRM programme design for retail institutions.',
      'New product design processes in manufacturing and agriculture.',
    ],
    downloadableProfile: '/downloads/service-profile-sales-marketing-crm.pdf',
    businessUnit: 'TEAM Consulting',
  },
  {
    id: 'implementation',
    slug: 'implementation',
    title: 'Implementation',
    description: 'Implementation planning, monitoring, coaching, and project management.',
    icon: 'Briefcase',
    features: [
      'Implementation planning',
      'Monitoring and evaluation',
      'Coaching and project management',
    ],
    notableAssignments: [
      'Project management and coaching for implementation reforms across Government of Zimbabwe ministries.',
      'Implementation support for ease-of-doing-business reforms in Zimbabwe.',
    ],
    downloadableProfile: '/downloads/service-profile-implementation.pdf',
    businessUnit: 'TEAM Consulting',
  },
  {
    id: 'analytics-research',
    slug: 'analytics-research',
    title: 'Analytics & Research',
    description: 'Surveys, benchmarking, and diagnostics that drive better decisions.',
    icon: 'Monitor',
    features: [
      'Organisation-wide surveys and culture assessments',
      'Benchmarking analysis',
      'Market and community engagement surveys',
    ],
    notableAssignments: [
      'Large-scale culture and employee engagement surveys across sectors.',
      'Benchmarking surveys and analysis for the education sector.',
    ],
    downloadableProfile: '/downloads/service-profile-analytics-research.pdf',
    businessUnit: 'TEAM Insights',
  },
  {
    id: 'organisation-culture',
    slug: 'organisation-culture',
    title: 'Organisation & Culture',
    description: 'Leadership development, culture transformation, and change management.',
    icon: 'Briefcase',
    features: [
      'Leadership development and coaching',
      'Culture transformation',
      'Change management',
      'Team building and facilitation',
      'Staff development and capacity building',
    ],
    downloadableProfile: '/downloads/service-profile-organisation-culture.pdf',
    businessUnit: 'TEAM Human Capital',
  },
  {
    id: 'technology-digital',
    slug: 'technology-digital',
    title: 'Technology & Digital',
    description: 'Technology strategies, digital transformation programmes, and custom software.',
    icon: 'Smartphone',
    features: [
      'Technology strategy and roadmaps',
      'Digital transformation programmes',
      'Custom software for performance tracking',
    ],
    notableAssignments: [
      'IT strategy development for mining and financial services institutions.',
      'Development of Balanced Scorecard and rapid-results tracking software.',
    ],
    downloadableProfile: '/downloads/service-profile-technology-digital.pdf',
    businessUnit: 'TEAM Human Capital',
  },
  {
    id: 'wellness-coaching',
    slug: 'wellness-coaching',
    title: 'Wellness & Coaching',
    description: 'Workplace wellness policy, counselling, and coaching for leaders and teams.',
    icon: 'Shield',
    features: [
      'Staff wellness policy and intervention models',
      'Health culture baseline assessments',
      'Counselling and staff support',
      'Leadership and implementation coaching',
    ],
    notableAssignments: [
      'Workplace wellness programmes in financial services and manufacturing sectors.',
      'Counselling and end-of-life support during organisation restructuring.',
    ],
    downloadableProfile: '/downloads/service-profile-wellness-coaching.pdf',
    businessUnit: 'TEAM Wellness',
  },
]

export const businessUnits: BusinessUnit[] = [
  {
    id: 'team-consulting',
    slug: 'team-consulting',
    name: 'TEAM Consulting',
    tagline: 'Advisory Excellence in Strategy, Governance and Execution',
    description:
      'Management consulting support across business insights, human capital, and operations to deliver GREATER outcomes.',
    services: serviceAreas.filter((s) => s.businessUnit === 'TEAM Consulting').map((s) => s.title),
    head: 'Eric D Zinyengere',
  },
  {
    id: 'team-insights',
    slug: 'team-insights',
    name: 'TEAM Insights',
    tagline: 'Evidence-Led Decisions Through Research and Analytics',
    description:
      'Benchmarking, surveys, diagnostics, and data-led insight to improve organisational and market performance.',
    services: serviceAreas.filter((s) => s.businessUnit === 'TEAM Insights').map((s) => s.title),
    head: 'Teddy Tatenda Chikondo',
  },
  {
    id: 'team-human-capital',
    slug: 'team-human-capital',
    name: 'TEAM Human Capital',
    tagline: 'Building Leadership, Culture and Capability',
    description:
      'Leadership development, culture transformation, change management, and digital capability support.',
    services: serviceAreas.filter((s) => s.businessUnit === 'TEAM Human Capital').map((s) => s.title),
    head: 'Abigail C Zinyengere',
  },
  {
    id: 'team-wellness',
    slug: 'team-wellness',
    name: 'TEAM Wellness',
    tagline: 'Head, Heart and Hands at Work',
    description:
      'Workplace wellness interventions, counselling services, and coaching across life, leadership, and implementation.',
    services: serviceAreas.filter((s) => s.businessUnit === 'TEAM Wellness').map((s) => s.title),
    head: 'Dr Leonard Makoni',
  },
]

export const teamMembers: TeamMember[] = [
  {
    id: 'eric-zinyengere',
    name: 'Eric D Zinyengere',
    role: 'Managing Consultant',
    bio: 'Focus Areas: Strategy, Business Design, Processes, Coaching, Implementation, and Analytics. Sectors: Public Sector, Mining, Development, Financial Services, Professional Services, Manufacturing, Oil & Gas.',
    image: '/images/person/person-m-2.webp',
    socialLinks: { linkedin: '#' },
    yearsConsulting: 23,
    overallExperience: 25,
    qualifications: [
      'MSc Strategic Management',
      'BSc (Hons) Applied Mathematics',
      'Certified Management Consultant (SA)',
      'Certified KPI Professional (UAE)',
    ],
  },
  {
    id: 'abigail-zinyengere',
    name: 'Abigail C Zinyengere',
    role: 'Operating Consultant',
    bio: 'Focus Areas: Organisational Development, Process Re-engineering, Performance Management, and Coaching. Sectors: Public Sector, Manufacturing, Health & Insurance.',
    image: '/images/person/person-f-1.webp',
    socialLinks: { linkedin: '#' },
    yearsConsulting: 19,
    overallExperience: 24,
    qualifications: [
      'MSc Strategic Management',
      'BCom (Hons) Management',
      'Associate Certified Coach (ICF)',
      'Certified End of Life Coach',
    ],
  },
  {
    id: 'dr-leonard-makoni',
    name: 'Dr Leonard Makoni',
    role: 'Principal Consultant (Workplace Wellness)',
    bio: 'Focus Areas: Workplace Wellness, Counselling, Culture Transformation, Change Management, and Coaching.',
    image: '/images/person/person-m-4.webp',
    socialLinks: { linkedin: '#' },
    yearsConsulting: 7,
    overallExperience: 28,
    qualifications: [
      'Master of Philosophy in Veterinary Medicine',
      'Advanced Certificate in Counselling',
      'Certified Grief & End of Life Coach',
      'Diploma in General Management',
    ],
  },
  {
    id: 'teddy-chikondo',
    name: 'Teddy Tatenda Chikondo',
    role: 'Principal Consultant (Training & Strategy)',
    bio: 'Focus Areas: Strategy, Performance Management, Training, Customer Engagement, Organisational Development, and Coaching.',
    image: '/images/person/person-f-3.webp',
    socialLinks: { linkedin: '#' },
    yearsConsulting: 15,
    overallExperience: 17,
    qualifications: [
      'BSc Tourism and Hospitality Management',
      'MSc Governance and Leadership',
      'Certified Management Consultant (SA)',
    ],
  },
  {
    id: 'munya-takawira',
    name: 'Munya Takawira',
    role: 'Senior Consultant (Engagement)',
    bio: 'Focus Areas: Organisational Development, Teambuilding, Implementation, and Coaching.',
    image: '/images/person/person-m-8.webp',
    socialLinks: { linkedin: '#' },
    yearsConsulting: 6,
    overallExperience: 20,
    qualifications: [
      'BSc Development Studies',
      'Diploma in Systemic Therapy',
      'Certified Life Coach',
      'Certified Counsellor',
    ],
  },
  {
    id: 'taurai-nyatsanza',
    name: 'Taurai F Nyatsanza',
    role: 'Senior Consultant (Business Development & Projects)',
    bio: 'Focus Areas: Project Management, Strategy, Performance Management, Implementation, and Coaching.',
    image: '/images/person/person-f-6.webp',
    socialLinks: { linkedin: '#' },
    yearsConsulting: 7,
    overallExperience: 20,
    qualifications: ['MBA Banking & Finance Management', 'BComm (Hons) Finance', 'Diploma in Banking'],
  },
]

export const partners: Partner[] = [
  {
    id: 'kippy-kpi',
    name: 'Kippy KPI Management Ltd',
    logo: '/images/clients/clients-1.webp',
    description: 'Advanced cloud-based KPI and performance management systems.',
    type: 'technology',
    website: 'https://www.kippy.cloud',
  },
  {
    id: 'elearning-solutions',
    name: 'eLearning Solutions',
    logo: '/images/clients/clients-2.webp',
    description: 'Training and development through 21st-century learning mainstreaming.',
    type: 'strategic',
    website: 'https://www.elearning.co.zw',
  },
]

export const sectors = [
  'Financial Services (Banking, Insurance, Microfinance, and Asset Management)',
  'Public Sector and Local Government',
  'Manufacturing (Consumer Goods and Industrial Products)',
  'Mining, Energy, Oil, and Gas',
  'Health and Pharmaceuticals',
  'Development Agencies and NGOs',
  'Retail',
  'Tourism and Hospitality',
  'Education and Training',
  'Information, Communications, and Technology',
  'Automotive and Logistics',
  'Construction and Real Estate',
  'Agriculture',
  'Sports, Media, and Entertainment',
  'Professional Services and Independent Representative Bodies',
]

export const footprintCountries = [
  'Zimbabwe',
  'Zambia',
  'Namibia',
  'Botswana',
  'Mozambique',
  'Uganda',
  'Tanzania',
  'Malawi',
  'South Africa',
  'Lesotho',
]

export const clientHallOfFame: Record<string, string[]> = {
  Government: [
    'Ministry of Economic Planning & Investment Promotion (ZW)',
    'Ministry of Public Service, Labour and Social Welfare (ZW)',
    'Office of the President and Cabinet (ZW)',
    'Zimbabwe Investment Development Authority (ZIDA)',
  ],
  'Financial Services': [
    'Nedbank Namibia',
    'NMB Bank',
    'BancABC',
    'First Capital Bank',
    'Old Mutual Life Assurance Zimbabwe',
    'Sanlam Insurance (Tanzania)',
  ],
  Manufacturing: ['Proplastics', 'Zimplow', 'Beta Holdings', 'African Distillers', 'Schweppes Zimbabwe'],
  'Mining & Energy': ['Zimasco', 'Mimosa', 'RioZim (Renco)', 'Zuva Petroleum', 'Zimbabwe Power Company'],
  'Health & Pharma': ['Parirenyatwa Group of Hospitals', 'Lancet Clinical Laboratories', 'NatPharm (ZW)'],
  'Development Agencies': ['USAID', 'UNDP', 'World Bank', 'IFC', 'FAO', 'WHO'],
}

export const clients: ClientLogo[] = Object.entries(clientHallOfFame).flatMap(([category, names], index) =>
  names.slice(0, 6).map((name, i) => ({
    id: `${category}-${i}`,
    name,
    logo: `/images/clients/clients-${(index + i) % 6 + 1}.webp`,
  })),
)

export const caseStudies: CaseStudy[] = [
  {
    id: 'case-gov-strategy',
    slug: 'government-strategy-and-reforms',
    title: 'Government Strategy Reform Programme',
    category: 'Implementation',
    client: 'Government of Zimbabwe',
    duration: 'Multi-year',
    image: '/images/portfolio/portfolio-3.webp',
    summary: 'Implementation coaching and PM support for strategic reforms across ministries.',
    tags: ['Implementation', 'Public Sector', 'Governance'],
    metrics: [
      { label: 'Ministries Supported', value: 'All ministries' },
      { label: 'Programme Duration', value: 'Multi-year' },
      { label: 'Reform Velocity', value: 'Accelerated' },
    ],
    challenge:
      'A broad reform agenda required aligned execution, governance discipline, and ministry-level coordination.',
    approach:
      'TEAM delivered implementation coaching, PMO support, and structured monitoring to keep reforms on track.',
    services: ['Implementation', 'Governance & Policy', 'Strategy & Design'],
  },
  {
    id: 'case-mining-procurement',
    slug: 'mining-procurement-optimisation',
    title: 'Mining Procurement Optimisation',
    category: 'Operations',
    client: 'Large Mining Operation',
    duration: '12 months',
    image: '/images/portfolio/portfolio-4.webp',
    summary: 'Redesign of procurement model with significant cost savings.',
    tags: ['Operations', 'Mining', 'Cost Transformation'],
    metrics: [
      { label: 'Savings', value: 'USD 4M' },
      { label: 'Cycle Time', value: 'Reduced' },
      { label: 'Control Quality', value: 'Improved' },
    ],
    challenge:
      'Procurement leakages and inefficient policy controls were constraining throughput and cost competitiveness.',
    approach:
      'TEAM redesigned procurement workflows, controls, and policy architecture with measurable financial outcomes.',
    services: ['Operations', 'Governance & Policy'],
  },
  {
    id: 'case-microfinance-model',
    slug: 'womens-microfinance-bank-model',
    title: 'Women’s Microfinance Bank Business Model',
    category: 'Strategy & Design',
    client: 'Women’s Microfinance Bank (start-up)',
    duration: 'Licensing phase',
    image: '/images/portfolio/portfolio-5.webp',
    summary: 'Business model design and strategic framework during start-up and licensing.',
    tags: ['Strategy', 'Banking', 'Financial Services'],
    services: ['Strategy & Design', 'Implementation'],
  },
  {
    id: 'case-culture-survey',
    slug: 'enterprise-culture-and-engagement-survey',
    title: 'Enterprise Culture & Engagement Survey',
    category: 'Analytics & Research',
    client: 'Multi-sector Enterprises',
    duration: 'Quarterly cycles',
    image: '/images/portfolio/portfolio-6.webp',
    summary: 'Large-scale culture diagnostics used to guide transformation actions.',
    tags: ['Insights', 'Culture', 'Benchmarking'],
    services: ['Analytics & Research', 'Organisation & Culture'],
  },
]

export const ideasAtWorkArticles = [
  {
    id: 'article-1',
    slug: 'from-value-to-significance',
    title: 'From Value to Significance: Why Outcomes Matter More',
    excerpt:
      'TEAM’s strategic evolution from Quantum Leap Value to We Are Greater Than Me reframes advisory around enduring organisational significance.',
    tags: ['Strategy & Design', 'Implementation'],
    downloadUrl: '/downloads/ideas-at-work-value-to-significance.pdf',
  },
  {
    id: 'article-2',
    slug: 'building-resilient-organisations-in-volatile-markets',
    title: 'Building Resilience in Volatile Markets',
    excerpt:
      'A practical perspective on designing resilient operating models in dynamic African markets.',
    tags: ['Governance & Policy', 'Operations'],
    downloadUrl: '/downloads/ideas-at-work-resilience.pdf',
  },
  {
    id: 'article-3',
    slug: 'wellness-as-a-performance-driver',
    title: 'Wellness as a Performance Driver',
    excerpt:
      'How wellness interventions improve engagement, retention, and execution quality across teams.',
    tags: ['Wellness & Coaching', 'Organisation & Culture'],
    downloadUrl: '/downloads/ideas-at-work-wellness.pdf',
  },
]

export const events: Event[] = [
  {
    id: 'event-1',
    slug: 'greater-diagnostic-webinar',
    title: 'GREATER Diagnostic Webinar',
    date: '2026-06-12',
    time: '10:00 - 11:30 CAT',
    location: 'Online',
    category: 'Webinar',
    description: 'Learn how to use the GREATER diagnostic to identify gaps and quick wins.',
    isFeatured: true,
    fullDescription:
      'An introduction to the GREATER framework with practical guidance on evaluating growth, resilience, efficiency, agility, thrivability, engagement, and results.',
    agenda: [
      { time: '10:00', title: 'Opening and context' },
      { time: '10:20', title: 'GREATER framework deep dive' },
      { time: '10:55', title: 'Live diagnostic walkthrough' },
      { time: '11:20', title: 'Q&A' },
    ],
    speakers: [{ name: 'Eric D Zinyengere', title: 'Managing Consultant', company: 'TEAM Consulting' }],
  },
  {
    id: 'event-2',
    slug: 'strategy-execution-masterclass',
    title: 'Strategy to Execution Masterclass',
    date: '2026-07-08',
    time: '09:00 - 13:00 CAT',
    location: 'Harare, Zimbabwe',
    category: 'Masterclass',
    description: 'Execution discipline for leadership teams moving strategy into operations.',
  },
]

export const faqBotQuestions: FAQ[] = [
  {
    id: 'faq-1',
    question: 'How much is a strategy workshop?',
    answer:
      'Pricing depends on scope, participant size, and diagnostics depth. We usually provide a scoped proposal after a short discovery call.',
    keywords: ['price', 'cost', 'strategy workshop', 'how much'],
  },
  {
    id: 'faq-2',
    question: 'How long is a counselling session?',
    answer:
      'Typical counselling sessions run 45 to 60 minutes, with programmes tailored to individual and organisational needs.',
    keywords: ['counselling', 'session', 'duration', 'wellness'],
  },
  {
    id: 'faq-3',
    question: 'Do you work outside Zimbabwe?',
    answer:
      'Yes. TEAM has worked across Sub-Saharan Africa including Zambia, Namibia, Botswana, Mozambique, Uganda, Tanzania, Malawi, South Africa, and Lesotho.',
    keywords: ['countries', 'outside zimbabwe', 'zambia', 'africa'],
  },
]

export const downloads = [
  { id: 'company-profile', label: 'Company Profile (Full)', href: '/downloads/company-profile.pdf' },
  { id: 'training-overview', label: 'Training Programme Overview', href: '/downloads/training-programme-overview.pdf' },
  { id: 'service-profiles', label: 'Service Area Profiles (Bundle)', href: '/downloads/service-area-profiles.pdf' },
  { id: 'diagnostic-form', label: 'Online Diagnostic Questionnaire', href: '/downloads/greater-diagnostic-questionnaire.pdf' },
]

export const contacts = {
  headquarters: 'Harare, Zimbabwe',
  phone: '+263 77 220 2290',
  generalEmail: 'info@team.co.zw',
  zimbabweEmail: 'ZW@teamadvisoryservices.com',
  zambiaEmail: 'ZM@teamadvisoryservices.com',
}
