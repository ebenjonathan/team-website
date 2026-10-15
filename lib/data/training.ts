// ─── Training @ Work course catalogue ────────────────────────────────────────
// Shown at /training. Drawn from the TEAM Training Profile (2024), with prices
// left out on purpose: training is quoted per organisation.

export const trainingProfilePdf = '/downloads/TEAM-Consulting-Training-Profile.pdf'

export interface Course {
  name: string
  duration: string
  audience: string
  summary: string
  /** Link to a fuller page on this site, where one exists. */
  href?: string
}

export interface CourseGroup {
  id: string
  title: string
  courses: Course[]
}

export const trainingFormats = [
  {
    title: 'In-house training',
    body: 'Courses delivered to your staff at your premises or a venue of your choice, tailored to your context and goals.',
  },
  {
    title: 'Open public courses',
    body: 'Scheduled courses on the issues our research and experience show keep executives awake at night.',
  },
  {
    title: 'Training materials',
    body: 'Participant handouts, trainer guides and presentation slides for organisations running their own programmes, with on-site support if you want it.',
  },
]

export const courseGroups: CourseGroup[] = [
  {
    id: 'strategy',
    title: 'Strategy',
    courses: [
      {
        name: 'Strategy Oriented Business Excellence',
        duration: '3 days',
        audience: 'Management level staff',
        summary: 'How to develop and implement a strategy, from formulation through execution to review, using the tools available today.',
      },
      {
        name: 'Open Secret to Success',
        duration: '1 day',
        audience: 'Executives, managers and entrepreneurs',
        summary: 'The keys to successful strategic planning, built on the TEAM Strategy@Work methodology.',
      },
      {
        name: 'The Balanced Scorecard: Creating the Strategy Focused Business',
        duration: '2 days',
        audience: 'Executives, managers and entrepreneurs',
        summary: 'Using the Kaplan and Norton Balanced Scorecard to keep the business, and everyone in it, focused on strategy.',
      },
    ],
  },
  {
    id: 'leadership',
    title: 'Leadership and management',
    courses: [
      {
        name: 'Leadership Challenge',
        duration: '3 days',
        audience: 'Middle managers',
        summary: 'Seven modules on leadership practices, self-leadership and relational leadership, including a Leadership Practices Inventory.',
      },
      {
        name: 'Leading at the Top',
        duration: '2 days',
        audience: 'Senior managers and executives',
        summary: 'Rigorous self-reflection for senior leaders to sharpen how they lead themselves, their teams and the organisation.',
      },
      {
        name: 'The Mind of the Leader',
        duration: '1 day',
        audience: 'Senior management and executives',
        summary: 'Strategic thinking, critical thinking, innovation and creativity for thought leadership.',
      },
      {
        name: 'Emotional Intelligence',
        duration: '2 days',
        audience: 'Mid-level to senior leaders',
        summary: 'Understanding and growing your EQ, strengths-based leadership and coaching others with emotional intelligence.',
      },
      {
        name: 'The Leader as Coach',
        duration: '1 day',
        audience: 'Managers at all levels',
        summary: 'Increasing the value of people through genuine empowerment and coaching.',
      },
      {
        name: 'Corporate Governance',
        duration: '1 day',
        audience: 'Management',
        summary: 'Governance principles, board oversight, ethics and how to implement a governance framework that suits your business.',
      },
      {
        name: 'Principles of Management',
        duration: '3 days',
        audience: 'Aspiring and existing managers',
        summary: 'The functions and roles of a manager: leading, planning, controlling, organising and dealing with people.',
      },
      {
        name: 'Focusing on Results',
        duration: '1.5 days',
        audience: 'Senior management',
        summary: 'A short course followed by a practical organisational assessment of excellence in results.',
      },
      {
        name: 'Managing Change',
        duration: '2 days',
        audience: 'All staff dealing with change',
        summary: 'The forces and resistance of change, the DISCO model, and changing culture.',
      },
    ],
  },
  {
    id: 'team-building',
    title: 'Team building',
    courses: [
      {
        name: 'Effective Team Leadership',
        duration: '2 days',
        audience: 'Team leaders at all levels',
        summary: 'The essentials of a good team and a good team leader, from stages of team development to empowered teams.',
      },
      {
        name: 'Outdoor Teambuilding',
        duration: 'Half a day to 1 day',
        audience: 'Organisational teams at all levels',
        summary: 'Facilitated outdoor activities, each linked to a team lesson such as trust, planning, communication or handling change.',
        href: '/programmes/team-building',
      },
      {
        name: 'Indoor Teambuilding Programme',
        duration: '1 day',
        audience: 'Organisational teams at all levels',
        summary: 'Indoor exercises on communication, conflict, trust and problem solving, for teams for whom the outdoors does not suit.',
        href: '/programmes/team-building',
      },
      {
        name: 'Overcoming the Five Dysfunctions of a Team',
        duration: 'Generally 2 days',
        audience: 'Organisational teams at all levels (in-house only)',
        summary: 'Based on the work of Patrick Lencioni: trust, conflict, commitment, accountability and results, with a pre-programme team assessment and follow-up report.',
        href: '/programmes/team-building',
      },
    ],
  },
  {
    id: 'supply-chain',
    title: 'Supply chain and operations',
    courses: [
      {
        name: 'Unlocking the Hidden Value in Procurement',
        duration: '3 days',
        audience: 'Management teams and procurement staff',
        summary: 'TEAM’s Value Added Procurement methodology: find, get and keep value through strategic sourcing.',
      },
      {
        name: 'Operations Management',
        duration: '3 days',
        audience: 'Management teams and operations staff',
        summary: 'Productivity, scheduling, total quality management and current practice such as JIT and the Theory of Constraints.',
      },
    ],
  },
  {
    id: 'customers',
    title: 'Markets and customers',
    courses: [
      {
        name: 'Sales and Marketing',
        duration: '2 days',
        audience: 'Sales and marketing professionals',
        summary: 'The sales and marketing process, consumer behaviour and relationship-based selling.',
      },
      {
        name: 'Relating with Stakeholders (Public Relations)',
        duration: '1 day',
        audience: 'All staff who deal with the public',
        summary: 'Understanding your publics and building a PR plan using the RACE model.',
      },
      {
        name: 'Building Successful Relationships',
        duration: '1.5 days',
        audience: 'All staff',
        summary: 'Motivating and coaching others, managing conflict, and giving and receiving feedback.',
      },
    ],
  },
  {
    id: 'finance',
    title: 'Finance and cost management',
    courses: [
      {
        name: 'Cash Flow Management',
        duration: '1 day',
        audience: 'Finance staff, entrepreneurs and small business owners',
        summary: 'Profit versus cash, working capital, short-term credit and the warning signs to watch.',
      },
      {
        name: 'Finance Essentials',
        duration: '2 days',
        audience: 'Managers outside finance, entrepreneurs and small business owners',
        summary: 'Finance for non-financial managers: statements, ratios, budgeting, capital budgeting and planning.',
      },
    ],
  },
  {
    id: 'personal',
    title: 'Personal leadership',
    courses: [
      {
        name: 'Personal Effectiveness',
        duration: '2 days',
        audience: 'Anyone in the organisation',
        summary: 'A balanced life, a personal mission statement, goal setting and time management.',
      },
      {
        name: 'Grooming and Etiquette',
        duration: '1 day',
        audience: 'Anyone in the organisation',
        summary: 'Business etiquette, grooming and deportment, self-esteem and confidence.',
      },
      {
        name: 'Communicating with Impact',
        duration: '2 days',
        audience: 'Anyone who works and communicates with others',
        summary: 'Structuring and delivering your message clearly, listening, and communicating across teams and cultures.',
      },
    ],
  },
  {
    id: 'skills',
    title: 'Skills training',
    courses: [
      {
        name: 'Negotiation Skills',
        duration: '4 days',
        audience: 'Anyone involved in negotiations',
        summary: 'Planning, win-win relationships, managing negotiations and practical tactics.',
      },
      {
        name: 'Effective Presentations',
        duration: '2 days',
        audience: 'Staff and business owners who present',
        summary: 'Building and delivering a presentation, PowerPoint from basic to advanced, and Minto’s Pyramid Principle.',
      },
      {
        name: 'Innovate or Die: Building Innovation in the Individual',
        duration: '1 day',
        audience: 'Anyone who needs innovation in their work',
        summary: 'A rapid-impact course on building and living a culture of innovation, with practical tools.',
      },
      {
        name: 'Performance Management',
        duration: '2 days',
        audience: 'Staff who manage the performance of others',
        summary: 'Goals, measures and targets, cascading performance, and tools such as the Balanced Scorecard.',
      },
      {
        name: 'Business Process Management',
        duration: '2 days',
        audience: 'Staff involved in the day-to-day work of an area',
        summary: 'Understanding, analysing and redesigning business processes, and managing process change.',
      },
      {
        name: 'Project Management',
        duration: '3 days',
        audience: 'Project managers and staff who manage projects',
        summary: 'Planning, initiating, implementing and closing projects with little to no delay or disruption.',
      },
    ],
  },
  {
    id: 'programmes',
    title: 'Development programmes',
    courses: [
      {
        name: 'Leadership Development Programme',
        duration: '7 modules of 1.5 days each',
        audience: 'Leadership teams',
        summary: 'Personal leadership, leadership practices, the mind of the leader, relationships, communication and focusing on results.',
        href: '/programmes/leadership-development-programmes',
      },
      {
        name: 'Leadership@Work',
        duration: '21 one-hour weekly modules',
        audience: 'Managers and leaders',
        summary: 'Weekly sessions with reflection and daily practice across four themes: leadership, mindset, engagement and tools.',
        href: '/programmes/leadership-development-programmes',
      },
      {
        name: 'Management Development Programme',
        duration: '7 modules of 2 days each',
        audience: 'New and established managers',
        summary: 'Management, operations, HR, markets and customers, finance, negotiation and project management.',
        href: '/programmes/management-development-programmes',
      },
      {
        name: 'Basic Business Skills Programme',
        duration: '7 one-day modules',
        audience: 'Staff at all levels',
        summary: 'Self-management, etiquette, communication, writing, presenting and core skills for work.',
      },
      {
        name: 'Graduate Development Programme',
        duration: '9 modules over 9 to 18 months',
        audience: 'Graduates and interns',
        summary: 'Personal effectiveness and business appreciation, with an assignment after each module.',
      },
      {
        name: 'Supervisory Development Programme',
        duration: '6 two-day modules',
        audience: 'Supervisors and future managers',
        summary: 'Strategy and change, supervision, leading people, sales, finance and personal effectiveness.',
      },
      {
        name: 'Excellence Development Programme',
        duration: '1 day a week for 7 weeks',
        audience: 'Organisations on an excellence journey',
        summary: 'The enablers of business excellence, from leadership and strategy to processes and results.',
      },
      {
        name: 'Entrepreneurial Skills Equipping Programme (ESEP)',
        duration: '5 days',
        audience: 'Entrepreneurs and business start-ups',
        summary: 'Starting a business, financial essentials, management basics, personal efficiency and sales.',
      },
    ],
  },
]

export const otherCourses: { name: string; duration: string }[] = [
  { name: 'Account Relationship Management', duration: '2 days' },
  { name: 'Constraints Management (Theory of Constraints)', duration: '2 days' },
  { name: 'Servant Leadership', duration: '1 day' },
  { name: 'Spiritual Intelligence', duration: '1 day' },
  { name: 'Profit Patterns', duration: '2 days' },
  { name: 'Managing Labour Relations', duration: '1 day' },
  { name: 'Business Succession Planning', duration: '2 days' },
  { name: 'Business Ethics', duration: '1 day' },
  { name: 'Lean Six Sigma', duration: '1 day' },
  { name: 'Customer Care', duration: '1 day' },
  { name: 'Call Centre Training', duration: '1 day' },
  { name: 'Anger Management', duration: '1 day' },
  { name: 'Assertiveness and Self Confidence', duration: '1 day' },
  { name: 'Attention Management', duration: '1 day' },
  { name: 'Anti-Money Laundering and Combating the Financing of Terrorism', duration: '1 day' },
  { name: 'Empowering Leadership and Delegation', duration: 'Half a day' },
  { name: 'Employee Engagement', duration: 'Half a day' },
]
