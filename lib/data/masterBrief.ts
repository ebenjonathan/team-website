import type { BusinessUnit, CaseStudy, ClientLogo, Event, FAQ, Partner, Service, TeamMember } from '@/types'

export const companyProfile = {
  name: 'TEAM Consulting',
  tagline: 'We Are Greater Than Me',
  founded: 2004,
  foundedIn: 'Zimbabwe',
  overview: [
    'TEAM Consulting is a dynamic professional services and management advisory group focused on helping organisations unlock full value in people, processes, and products to realise organisational significance.',
    'What began as TEAM Consulting has evolved into TEAM Consulting Services with registered offices in Zimbabwe and Zambia and partner-based arrangements across other international markets.',
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
    title: 'Strategy',
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
    narrative: [
      'Most organisations know what they want to achieve. The challenge is closing the gap between a compelling strategy and disciplined, day-to-day execution. TEAM Consulting exists precisely for that gap. We work alongside leadership teams to identify where value is being left on the table — whether through weak governance structures, misaligned strategy, inefficient operations, or disconnected sales and delivery functions.',
      'Our approach is built on radical transparency. Before we recommend a single intervention, we invest time in understanding your real situation — not the version that looks good in reports, but the one your teams live every day. We call this "entering the danger": asking the questions others avoid, surfacing the friction no-one wants to name, and working with you to quantify the size of the prize if things were running as they should.',
      'In the execution phase, our consultants design practical roadmaps, not theoretical frameworks. Whether we are redesigning procurement processes, restructuring governance policy, building a monitoring mechanism, or facilitating a strategy refresh, everything we produce is built to be implemented — not filed away. Our goal is to bridge the strategy-to-execution gap and leave your organisation with the capability and confidence to sustain the gains long after our engagement ends.',
      'Clients who work with TEAM Consulting typically see sharper strategic clarity, faster execution, measurable cost savings, and governance structures that actually hold people accountable. We measure our success by yours — and we are not afraid to give away the blueprint if it means you keep the value.',
    ],
    valueLifecycle: {
      find: 'We run structured diagnostics to identify strategic gaps, governance weaknesses, and operational inefficiencies — quantifying the cost of the current state and the potential upside.',
      get: 'We design and implement practical solutions: strategy blueprints, governance frameworks, process redesigns, and implementation roadmaps tailored to your operating context.',
      keep: 'We embed the gains through monitoring mechanisms, accountability structures, and coaching support that ensure new ways of working become permanent.',
    },
    salesNarrative: [
      {
        heading: 'The Hidden Tax on Your Strategy: Why Execution Fails',
        body: "Every company has a brilliant plan. Spreadsheets are locked, PowerPoints are polished, and the leadership team nods in agreement. Yet six months later, the results are flat. The culprit is rarely a lack of ideas — it is almost always a gap in disciplined execution. This is where the modern enterprise loses millions: not in dramatic collapses, but in the slow erosion of what could have been. TEAM Consulting was built to close that gap. We don't just hand you a report and walk away. We embed ourselves in the messy middle between your ambition and your reality, ensuring that Strategy, Governance, and Execution are no longer three separate battles, but one seamless machine.",
      },
      {
        heading: 'Beyond the Consultant Cliché: Practical Diagnostics That Bite',
        body: "You have likely met the typical consultant: heavy on theory, light on grease. TEAM Consulting flips that model. Our unit is structured around four non-negotiable focus areas — Strategy, Governance & Policy, Operations, and Implementation — but the magic isn't the list; it is the linkage. We do not silo your people problems from your process failures. If your operating model is underperforming, we look at your governance. If your operations are sluggish, we redesign the underlying systems. This is cross-unit collaboration applied as a scalpel, not a sledgehammer. We deliver GREATER outcomes because we refuse to treat insights, human capital, and operations as separate workstreams. To us, they are the same problem viewed from different angles.",
      },
      {
        heading: 'The Governance That Saves You From Yourself',
        body: "Let's speak frankly about governance. Most companies view it as a compliance checkbox — boring, bureaucratic, and best left to the legal department. That perspective is actively destroying your agility. TEAM Consulting views governance as the scaffolding of speed. Without rigorous policy architecture, your best strategies drown in internal friction. With it, decisions take days instead of months. We help you build governance models that protect the enterprise without suffocating the entrepreneur within it. Because we pair this with a strong sustainability focus, your next move won't just be profitable — it will be durable. We design policies that survive the next market shock, not just the next board meeting.",
      },
      {
        heading: 'The Unit Lead Who Has Done It Before',
        body: "A unit is only as good as its principal. Eric D Zinyengere leads this charge — not as a career academic, but as a management practitioner who understands that implementation is where theory goes to die. Under Eric's direction, TEAM Consulting does not chase vanity metrics. We chase transformation. We ask the uncomfortable questions about your operating model, your human capital alignment, and why your last three initiatives stalled. Eric's mandate is simple: ensure that every diagnostic ends in a practical, fundable, executable roadmap. When you discuss a potential engagement with him, you aren't talking to a salesperson — you are talking to the person who will personally ensure your ROI is visible.",
      },
      {
        heading: "The Invitation: Let's Discuss the How",
        body: "This is not a cold pitch — it is a conversation starter. You already know where your company is leaking value: the quarterly miss, the siloed department, the initiative that never launched. TEAM Consulting brings the antidote: advisory excellence that marries the rigour of strategy with the grit of implementation. We are not here to replace your internal team; we are here to make them unstoppable. Ask us the hard questions. Challenge our approach. Because if your current advisory partner isn't talking about governance and implementation in the same breath, you aren't getting advisory — you are getting a lecture.",
      },
    ],
  },
  {
    id: 'team-insights',
    slug: 'team-insights',
    name: 'TEAM Insights',
    tagline: 'Evidence-Led Decisions Through Research and Analytics',
    description:
      'Benchmarking, surveys, diagnostics, and data-led insight to improve organisational and market performance.',
    services: serviceAreas.filter((s) => s.businessUnit === 'TEAM Insights').map((s) => s.title),
    head: 'Fungai Chikwete',
    narrative: [
      'The most dangerous decisions in business are made on assumptions dressed up as data. Leaders act on outdated benchmarks, incomplete surveys, or anecdotal evidence — and wonder why their interventions miss the mark. TEAM Insights exists to replace guesswork with evidence, giving organisations across international markets the reliable, contextualised intelligence they need to act with confidence.',
      'We design and deploy large-scale surveys, culture and engagement diagnostics, benchmarking studies, and market research that go beyond surface-level metrics. Our methodology is built to surface the real story — what employees actually experience, how your organisation compares to peers, where market opportunities are underserved, and which interventions are most likely to move the needle. We have run enterprise-wide diagnostics for mining operations, benchmarking studies for the education sector, and community engagement surveys for development agencies.',
      'The insights we generate are not produced for reports that gather dust. Every engagement is designed to produce decision-ready outputs: clear findings, prioritised recommendations, and a line of sight to action. We work closely with leadership teams to interpret the data, challenge comfortable assumptions, and translate evidence into a practical improvement agenda.',
      'In markets where quality data is scarce and context matters enormously, TEAM Insights brings market intelligence combined with world-class research rigour. When you know your true baseline, you can set meaningful targets, invest in the right places, and demonstrate impact to boards, funders, and regulators.',
    ],
    valueLifecycle: {
      find: 'We baseline the current state through surveys, assessments, and benchmarking — establishing a clear, evidence-based picture of where your organisation or market stands.',
      get: 'We analyse, interpret, and present findings in formats that drive decisions — from executive dashboards to facilitated sense-making workshops with leadership teams.',
      keep: 'We build tracking mechanisms and repeat measurement cycles that allow organisations to monitor progress, demonstrate impact, and course-correct in real time.',
    },
    salesNarrative: [
      {
        heading: 'The Decisions You Are Making on Bad Data',
        body: "Here is an uncomfortable truth: most strategic decisions in organisations are made on assumptions dressed up as data. A survey from three years ago. Benchmarks borrowed from a different market. An engagement score that nobody interrogated. The result? Interventions that miss the real problem, investments that miss the real opportunity, and boards that receive reports full of numbers that explain nothing. TEAM Insights exists to replace guesswork with evidence — giving your leadership team the reliable, contextualised intelligence it needs to act with genuine confidence.",
      },
      {
        heading: 'Surveys That Actually Mean Something',
        body: "Not all research is created equal. The difference between a survey that produces a slide deck and a survey that changes how an organisation operates lies entirely in the methodology, the questions, and the interpretive courage of the analyst. Our team designs large-scale diagnostic tools — culture and engagement surveys, benchmarking studies, market intelligence instruments — that are built to surface the real story, not the comfortable one. We have run enterprise-wide diagnostics for mining operations with thousands of employees, sector-wide benchmarking studies that shifted government education policy, and community engagement surveys for some of the world's largest development agencies. We know how to ask the question behind the question.",
      },
      {
        heading: 'Intelligence That Is Designed for Context',
        body: "Generic research frameworks produce generic insights. The dynamics of an organisation operating in Harare, Lusaka, or Nairobi are not the same as one operating in London or New York — and yet most research tools are built on assumptions that do not travel. TEAM Insights brings market intelligence combined with world-class research rigour. We understand the cultural dynamics that skew survey responses. We know which benchmarks are locally meaningful and which are borrowed vanity metrics. We design instruments that produce data your leadership team can actually use — and we interpret that data with the contextual depth that offshore providers simply cannot match.",
      },
      {
        heading: 'The Unit Lead Driving Evidence-Led Change',
        body: "Teddy Tatenda Chikondo leads TEAM Insights with a rare combination of research discipline and strategic instinct. Teddy understands that the purpose of analytics is not to describe the past — it is to illuminate the path forward. Under her leadership, every research engagement is designed with one question at its centre: what decision does this data need to support? That orientation changes everything about how surveys are designed, how findings are presented, and how recommendations are prioritised. When you commission research through TEAM Insights, you are not buying a report — you are buying clarity.",
      },
      {
        heading: "The Invitation: Let's Map Your Blind Spots",
        body: "You cannot fix what you cannot see. And you cannot see clearly when your data is incomplete, outdated, or built on the wrong questions. TEAM Insights offers a structured way in: a diagnostic conversation that identifies the information gaps most likely to be costing you right now. From there, we design a research programme that fits your timeline, your budget, and your decision-making calendar — not ours. The organisations that consistently outperform their peers are not smarter. They are better informed. Let TEAM Insights give you that edge.",
      },
    ],
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
    narrative: [
      'Strategy is only as strong as the people executing it. When organisations invest in rigorous planning but neglect the human architecture — the culture, leadership capability, and change readiness of their teams — even the best strategies stall. TEAM Human Capital works at the intersection of people and performance, helping organisations build the leadership depth, cultural coherence, and digital capability required to operate at their full potential.',
      'Culture transformation is one of the most misunderstood disciplines in management consulting. Too often it is reduced to a values poster and an annual survey. Our work goes deeper. We use evidence-based diagnostics to map the current culture, identify the specific behaviours and structures driving dysfunction, and co-design a transformation roadmap with your leadership team. Change management is not a communication plan — it is an organisational design challenge, and we treat it as such.',
      'Our leadership development programmes are built for leaders who are already busy, not for those who have time for a classroom. We combine structured learning with embedded coaching and real-work application, developing the judgment, communication, and execution discipline that distinguishes high-performing leaders from the rest. We have worked with executives across financial services, mining, manufacturing, government, and development sectors — and we understand that leadership challenges are rarely generic.',
      'On the digital side, we help organisations develop technology strategies, design digital transformation programmes, and build the internal capability to sustain them. From performance tracking software to digital upskilling programmes, we ensure that technology investment translates into human performance improvement — not just infrastructure cost.',
    ],
    valueLifecycle: {
      find: 'We assess leadership effectiveness, culture health, change readiness, and digital maturity — identifying the human capital gaps that are limiting organisational performance.',
      get: 'We design and deliver leadership development programmes, culture transformation initiatives, change management frameworks, and digital capability-building tailored to your organisation.',
      keep: 'We embed capability through ongoing coaching, internal champion development, and governance structures that sustain cultural and behavioural change beyond the formal engagement.',
    },
    salesNarrative: [
      {
        heading: "When Your Strategy Outlives Your People's Willingness to Execute It",
        body: "There is a pattern that repeats itself across industries, across sectors, across borders. An organisation spends months crafting a compelling strategy. External consultants validate it. The board approves it. And then nothing happens — or at least, not at the pace or quality that was promised. The diagnosis is almost never the strategy itself. It is the human architecture underneath it: a leadership team that doesn't trust each other, a culture that quietly resists change, a workforce that never understood what was being asked of them in the first place. TEAM Human Capital was built to address this pattern at the root, not at the symptom.",
      },
      {
        heading: 'Leadership Development That Survives Monday Morning',
        body: "Most leadership programmes look impressive in a brochure and disappear by the time participants return to their desks. The problem is not the content — it is the design. Learning that is disconnected from real work, real decisions, and real accountability produces competent seminar-goers, not stronger leaders. Our programmes are built differently. We combine structured learning with embedded coaching and live-work application, developing the judgment, communication discipline, and execution courage that actually distinguish high-performing leaders from the rest. We have worked with executives across financial services, mining, manufacturing, government, and development — and we know that leadership challenges are almost never generic.",
      },
      {
        heading: 'Culture Transformation: More Than a Values Poster',
        body: "Culture transformation is one of the most misunderstood disciplines in management consulting. Too often it is reduced to a values exercise, an annual survey, and a wall mural. Our work goes significantly deeper. We use evidence-based diagnostics to map the current culture — identifying the specific behaviours, leadership norms, and structural incentives that are driving dysfunction — and we co-design a transformation roadmap with your leadership team. Change management, done properly, is not a communication plan. It is an organisational design challenge that requires courage, precision, and sustained commitment. We bring all three.",
      },
      {
        heading: 'The Unit Lead Who Built It From the Inside',
        body: "Abigail C Zinyengere leads TEAM Human Capital with 19 years of consulting experience and the practical depth of someone who has sat in the room when difficult decisions were made. Abigail's approach is direct: she will tell you what your culture is actually doing to your performance, not what you want to hear about it. Her background spans organisational development, process re-engineering, performance management, and coaching — which means she understands that human capital challenges are almost always entangled with structural and process failures. She will not let you fix one without addressing the other.",
      },
      {
        heading: "The Invitation: Let's Diagnose Your Human Architecture",
        body: "The question is not whether your people are capable. They almost certainly are. The question is whether your organisation's culture, leadership quality, and change infrastructure are giving them the conditions to perform at that capability. TEAM Human Capital can tell you — quickly, precisely, and without flattery. We start with a diagnostic conversation that maps your current state across leadership effectiveness, culture health, and change readiness. From there, we design an intervention that fits your context, your timeline, and your ambition. Because the organisations that win in the next decade will not win on strategy alone — they will win on the quality of the people executing it.",
      },
    ],
  },
  {
    id: 'team-wellness',
    slug: 'team-wellness',
    name: 'TEAM Wellness',
    tagline: 'Head, Heart and Hands at Work',
    description:
      'Workplace wellness interventions, counselling services, and coaching across life, leadership, and implementation.',
    services: serviceAreas.filter((s) => s.businessUnit === 'TEAM Wellness').map((s) => s.title),
    head: 'Abigail C Zinyengere',
    narrative: [
      'For years, workplace wellness was treated as a nice-to-have — a benefit programme bolted onto a performance culture that never changed. The evidence is now unambiguous: organisations that invest in the holistic wellbeing of their people outperform those that do not, across every measurable dimension. TEAM Wellness was built on this conviction. We help organisations move from reactive, compliance-driven wellness policies to proactive, culture-embedded wellbeing strategies that improve performance, reduce attrition, and build organisational resilience.',
      'Our team brings together clinical expertise, coaching depth, and organisational understanding that very few wellness providers in the region can match. We understand that wellness challenges in diverse workplaces are specific — they involve financial stress, family system pressures, grief, loss, organisational restructuring trauma, and cultural dynamics that generic wellness programmes overlook entirely. We design interventions that are contextually appropriate, clinically sound, and practically sustainable.',
      'We work across three dimensions of workplace wellness. At the individual level, we provide counselling, coaching, and end-of-life support for employees facing personal and professional crises. At the team level, we design psychological safety interventions, facilitate grief and change processing workshops, and build the relational health that enables high performance. At the organisational level, we develop wellness policies, health culture baselines, and Employee Assistance Programme frameworks that give organisations a structured, measurable approach to employee wellbeing.',
      'Wellness is also an ESG imperative. Investors, funders, and regulators increasingly scrutinise how organisations treat their people. A comprehensive wellness strategy is not just the right thing to do — it is a governance requirement, a talent retention strategy, and a competitive differentiator. TEAM Wellness helps you build both the human case and the business case for a thriving workforce.',
    ],
    valueLifecycle: {
      find: 'We conduct health culture baseline assessments, wellness audits, and employee wellbeing surveys to identify the specific stressors, risks, and gaps affecting your workforce.',
      get: 'We deliver counselling, coaching, facilitated wellness workshops, and policy development — practical, evidence-based interventions tailored to your organisation\'s specific context.',
      keep: 'We build internal wellness champions, design Employee Assistance Programmes, and establish governance frameworks that sustain a culture of wellbeing long after the initial engagement.',
    },
    salesNarrative: [
      {
        heading: 'The Invisible Cost Your P&L Does Not Show',
        body: "There is a number missing from most financial reports: the cost of a workforce that is present but not performing. Burnout, unresolved grief, financial anxiety, unspoken workplace conflict — these do not appear as line items, but they show up everywhere else. In the missed deadline. In the brilliant employee who quietly resigned. In the team that produces technically acceptable work but has stopped caring about excellence. The research is unambiguous: organisations that invest meaningfully in employee wellbeing outperform those that do not, across productivity, retention, innovation, and client satisfaction. TEAM Wellness was built to help organisations capture that return — systematically, sustainably, and with clinical rigour.",
      },
      {
        heading: 'Wellness That Understands the Local Context',
        body: "Generic wellness programmes are designed for generic workplaces. But an employee in Harare, Lusaka, or Dar es Salaam is navigating a set of pressures — financial volatility, family system obligations, grief, community trauma, the weight of being the first in one's family to hold a professional position — that most off-the-shelf EAP providers have never encountered. TEAM Wellness brings clinical depth and cultural fluency in equal measure. Our practitioners understand the dynamics that shape employee experience in African organisations, and they design interventions that meet people where they actually are, not where a Western wellness template assumes them to be.",
      },
      {
        heading: 'From Reactive EAP to Proactive Wellbeing Strategy',
        body: "Most organisations think about wellness reactively: something breaks, someone reaches a crisis point, and then support is scrambled. This model is both expensive and ineffective. The organisations that build genuine resilience are those that treat wellbeing as a strategic priority — embedded in leadership behaviour, governance policy, and daily operating norms — not as an HR afterthought. TEAM Wellness works at three levels simultaneously: individual counselling and coaching for those in acute need; team-level interventions that build psychological safety and relational health; and organisational-level policy and governance frameworks that make wellbeing structurally impossible to ignore.",
      },
      {
        heading: 'The Unit Lead Bringing Clinical Depth to the Boardroom',
        body: "Dr Leonard Makoni leads TEAM Wellness with 28 years of experience spanning veterinary medicine, counselling, grief support, and organisational change. That breadth is not incidental — it reflects a practitioner who has learned to sit with complexity, ambiguity, and human pain in contexts far more demanding than a corporate boardroom. Dr Makoni understands that workplace wellness is not a soft topic. It is a leadership imperative, a governance requirement, and an ESG obligation. He brings that conviction — along with clinical precision and organisational acuity — to every engagement TEAM Wellness takes on.",
      },
      {
        heading: "The Invitation: Let's Talk About Your People",
        body: "You likely already know something is wrong. The engagement scores that have been declining. The talented person who left without a real explanation. The team that is technically functional but clearly not thriving. TEAM Wellness offers a structured starting point: a wellbeing diagnostic that maps the current state of your workforce's health culture, identifies the most critical pressure points, and outlines a practical intervention pathway. No jargon. No generic recommendations. Just an honest assessment of where your people are, and a clear plan for helping them — and your organisation — perform at a level that is actually sustainable.",
      },
    ],
  },
]

export const teamMembers: TeamMember[] = [
  {
    id: 'eric-zinyengere',
    name: 'Dr. Eric D Zinyengere',
    role: 'Managing Consultant',
    bio: 'Focus Areas: Strategy, Business Design, Processes, Coaching, Implementation, and Analytics. Sectors: Public Sector, Mining, Development, Financial Services, Professional Services, Manufacturing, Oil & Gas.',
    image: '/images/male-profile.png',
    socialLinks: { linkedin: 'https://www.linkedin.com/in/eric-d-zinyengere-profile' },
    yearsConsulting: 23,
    overallExperience: 25,
    qualifications: [
      'PhD in Business Management',
      'MSc Strategic Management',
      'BSc (Hons) Applied Mathematics',
      'Certified Management Consultant (SA)',
      'Certified KPI Professional (UAE)',
    ],
  },
  {
    id: 'abigail-zinyengere',
    name: 'Abigail C Zinyengere',
    role: 'Wellness & Coaching Lead',
    bio: 'Focus Areas: Wellness, Coaching, Organisational Development, Change Management, and Culture. Sectors: Public Sector, Manufacturing, Health & Insurance.',
    image: '/images/female-profile.png',
    socialLinks: { linkedin: 'https://www.linkedin.com/in/abigail-c-zinyengere-profile' },
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
    id: 'tatenda-chikondo',
    name: 'Tatenda Chikondo',
    role: 'Senior Consultant',
    bio: 'Focus Areas: Strategy, Training, Customer Engagement, Organisational Development, and Coaching.',
    image: '/images/female-profile.png',
    socialLinks: { linkedin: 'https://www.linkedin.com/in/tatenda-chikondo-profile' },
    yearsConsulting: 8,
    overallExperience: 10,
    qualifications: [
      'BSc Governance and Leadership',
      'Certified Management Consultant (SA)',
    ],
  },
  {
    id: 'fungai-chikwete',
    name: 'Fungai Chikwete',
    role: 'Data Analytics & Research Lead',
    bio: 'Focus Areas: Data Analytics, Research, Benchmarking, Market Intelligence, and Evidence-Led Decision Making.',
    image: '/images/male-profile.png',
    socialLinks: { linkedin: 'https://www.linkedin.com/in/fungai-chikwete-profile' },
    yearsConsulting: 11,
    overallExperience: 13,
    qualifications: [
      'MSc Data Analytics',
      'BSc Statistics',
      'Certified Market Research Analyst',
    ],
  },
  {
    id: 'munya-takawira',
    name: 'Munya Takawira',
    role: 'Senior Consultant (Engagement)',
    bio: 'Focus Areas: Organisational Development, Teambuilding, Implementation, and Coaching.',
    image: '/images/male-profile.png',
    socialLinks: { linkedin: 'https://www.linkedin.com/in/munya-takawira-profile' },
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
    image: '/images/male-profile.png',
    socialLinks: { linkedin: 'https://www.linkedin.com/in/taurai-f-nyatsanza-profile' },
    yearsConsulting: 7,
    overallExperience: 20,
    qualifications: ['MBA Banking & Finance Management', 'BComm (Hons) Finance', 'Diploma in Banking'],
  },
]

export const partners: Partner[] = [
  {
    id: 'kippy-kpi',
    name: 'Kippy KPI Management Ltd',
    logo: '/images/partner/kippy.png',
    description: 'Advanced cloud-based KPI and performance management systems.',
    type: 'technology',
    website: 'https://www.kippy.cloud',
  },
  {
    id: 'elearning-solutions',
    name: 'eLearning Solutions',
    logo: '/images/partner/elearning.png',
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
    tags: ['Implementation', 'Public Sector', 'GREATER: Resilience & Agility'],
    metrics: [
      { label: 'Ministries Supported', value: 'All ministries' },
      { label: 'Programme Duration', value: 'Multi-year' },
      { label: 'Reform Velocity', value: 'Accelerated' },
    ],
    challenge:
      'A broad reform agenda required aligned execution, governance discipline, and ministry-level coordination.',
    approach:
      'TEAM delivered implementation coaching, PMO support, and structured monitoring to keep reforms on track.',
    services: ['Implementation', 'Governance & Policy', 'Strategy'],
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
    tags: ['Operations', 'Mining', 'GREATER: Efficiency & Results'],
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
    title: "Women's Microfinance Bank Business Model",
    category: 'Strategy',
    client: "Women's Microfinance Bank (start-up)",
    duration: 'Licensing phase',
    image: '/images/portfolio/portfolio-5.webp',
    summary: 'Business model design and strategic framework during start-up and licensing.',
    tags: ['Strategy', 'Financial Services', 'GREATER: Growth & Engagement'],
    metrics: [
      { label: 'Business Model', value: 'Licensing-ready' },
      { label: 'Strategic Framework', value: 'Completed' },
      { label: 'Regulatory Pack', value: 'Submitted' },
    ],
    challenge:
      'No operational business model, strategic framework, or licensing-ready documentation existed for a government-backed microfinance start-up.',
    approach:
      'TEAM designed a gender-intentional business model and full regulatory documentation enabling launch readiness and strategic clarity.',
    services: ['Strategy', 'Implementation'],
  },
  {
    id: 'case-culture-survey',
    slug: 'enterprise-culture-and-engagement-survey',
    title: 'Enterprise Culture & Engagement Survey',
    category: 'Analytics & Research',
    client: 'Large Mining Operation',
    duration: 'Quarterly cycles',
    image: '/images/portfolio/portfolio-6.webp',
    summary: 'Large-scale culture diagnostics used to guide transformation actions.',
    tags: ['Analytics & Research', 'Culture', 'GREATER: Engagement & Thrivability'],
    metrics: [
      { label: 'Employees Covered', value: 'Enterprise-wide' },
      { label: 'Diagnostic Phases', value: 'Multi-phase' },
      { label: 'Action Plans', value: 'Leadership-led' },
    ],
    challenge:
      'A large mining operation needed to understand why experienced employees were leaving despite competitive compensation and tenure benefits.',
    approach:
      'TEAM deployed a multi-phase, evidence-led diagnostic measuring employee engagement, job satisfaction, and leadership climate to guide targeted interventions.',
    services: ['Analytics & Research', 'Organisation & Culture'],
  },
  {
    id: 'case-ecommerce-boom',
    slug: 'ecommerce-boom-300-sales-growth',
    title: 'E-Commerce Boom: 300% Sales Growth',
    category: 'Strategy',
    client: 'Traditional Retailer',
    duration: '12 months',
    image: '/images/portfolio/portfolio-1.webp',
    summary: 'A traditional retailer struggling with legacy systems achieved 300% online sales growth through a cloud-native e-commerce platform.',
    tags: ['E-Commerce', 'Digital Transformation', 'GREATER: Growth & Efficiency'],
    metrics: [
      { label: 'Sales Growth', value: '300%' },
      { label: 'New Active Customers', value: '50,000+' },
      { label: 'Platform Uptime', value: '99.99%' },
      { label: 'Server Cost Reduction', value: '40%' },
    ],
    challenge:
      'Legacy systems, website crashes, manual order processing, no personalisation, and no inventory integration were preventing the retailer from competing in the digital market.',
    approach:
      'TEAM built a cloud-native platform with click-and-collect, AI personalisation, EcoCash integration, and real-time inventory management, enabling the retailer to handle 10x traffic spikes.',
    services: ['Strategy', 'Operations'],
  },
  {
    id: 'case-digital-banking',
    slug: 'digital-banking-revolution-500k-users',
    title: 'Digital Banking Revolution: 500k+ Users',
    category: 'Strategy',
    client: 'Traditional Bank',
    duration: '18 months',
    image: '/images/portfolio/portfolio-2.webp',
    summary: 'A traditional bank launched a modern mobile banking app that became the most downloaded banking app in the region with 500,000+ active users.',
    tags: ['FinTech', 'Digital Banking', 'GREATER: Engagement & Growth'],
    metrics: [
      { label: 'Active Users', value: '500,000+' },
      { label: 'App Rating', value: '4.8/5' },
      { label: 'Daily Transactions', value: '100,000+' },
      { label: 'User Retention', value: '92%' },
    ],
    challenge:
      'The bank was losing daily financial relevance to fintechs while retaining custody of large client balances, with no mobile-first offering to compete.',
    approach:
      'TEAM built a secure, intuitive, behaviour-shaping mobile app with automated savings, QR payments, biometric authentication, and real-time transaction insights.',
    services: ['Strategy', 'Analytics & Research'],
  },
  {
    id: 'case-manufacturing',
    slug: 'manufacturing-transformation-35-cost-reduction',
    title: 'Manufacturing Transformation: 35% Cost Reduction',
    category: 'Operations',
    client: 'Large Manufacturing Company',
    duration: '24 months',
    image: '/images/portfolio/portfolio-3.webp',
    summary: 'End-to-end digital transformation of a large manufacturer reduced operational costs by 35% and cut unplanned downtime by 60%.',
    tags: ['Manufacturing', 'IoT', 'GREATER: Efficiency & Resilience'],
    metrics: [
      { label: 'Cost Reduction', value: '35%' },
      { label: 'Efficiency Improvement', value: '45%' },
      { label: 'Downtime Reduction', value: '60%' },
      { label: 'ROI', value: '250%' },
    ],
    challenge:
      'Data silos, reactive maintenance, 60% unplanned downtime, low digital literacy, and escalating legacy costs were hindering competitiveness.',
    approach:
      'TEAM deployed IoT sensors, edge computing, AI predictive maintenance, a cloud data lake, and comprehensive digital upskilling programmes.',
    services: ['Operations', 'Strategy', 'Analytics & Research'],
  },
]

export const ideasAtWorkArticles = [
  {
    id: 'article-1',
    slug: 'from-value-to-significance',
    title: 'Unlocking Organisational Significance Through GREATER Outcomes',
    excerpt:
      'Outcomes matter more in business because they measure real-world impact — revenue growth, customer satisfaction, problem-solving — rather than just the effort or inputs invested.',
    tags: ['Strategy', 'Implementation'],
    downloadUrl: '/downloads/ideas-at-work-value-to-significance.pdf',
    body: [
      {
        heading: 'Outcomes Matter More',
        content:
          'Outcomes matter more in business because they measure real-world impact, such as revenue growth, customer satisfaction, or problem-solving, rather than just the effort or inputs invested.',
      },
      {
        heading: 'The Difference Between Outputs and Outcomes',
        content:
          'Outputs are easy to measure. They are tangible, quantifiable, reportable. But outcomes are exponentially more valuable. Outcomes are about impact, the real, lasting change that work creates within an organisation. When we focus solely on outputs, we risk losing sight of the real purpose behind our work.',
      },
      {
        heading: 'Managing for Impact Through Good Governance',
        content:
          'Good governance ensures that we are not just chasing numbers, but staying aligned with our mission and continuously assessing whether we are actually delivering the change we promise.',
      },
      {
        heading: 'The GREATER Framework',
        content:
          'At TEAM, we believe organisational significance is unlocked by focusing on seven measurable outcomes: Growth, expansion of revenue, market share, and strategic reach through disciplined planning and execution. Resilience, structural and operational fortification that allows organisations to withstand shocks and volatility. Efficiency, systematic elimination of waste and measurable improvement in resource utilisation. Agility, the capacity to pivot decisively when markets, regulations, or competitors shift. Thrivability, long-term organisational health, the continuous regeneration of people, processes, and competitive advantage. Engagement, a workforce aligned with purpose, producing discretionary effort and reduced attrition. Results, the quantifiable impact across financial and operational indicators. Every engagement begins with a GREATER Diagnostic: a structured assessment of your organisation\'s position across all seven dimensions.',
      },
      {
        heading: 'Beyond Outputs: Realising Organisational Significance',
        content:
          'We help organisations across diverse markets, from financial services to manufacturing, from government to development agencies, to diagnose where real value is being left on the table and design interventions that stick. TEAM offers four integrated business units: TEAM Consulting, advisory excellence in strategy, governance, and execution. TEAM Insights, evidence-led decisions through research and analytics. TEAM Human Capital, building leadership, culture, and capability. TEAM Wellness, head, heart, and hands at work. The question is not whether your organisation is performing. The question is: what would be possible if you were performing across all seven dimensions of GREATER? Let\'s find out together.',
      },
    ],
  },
  {
    id: 'article-2',
    slug: 'building-resilient-organisations-in-volatile-markets',
    title: "Building Resilience in Volatile Markets: A GREATER Approach to Dynamic Operating Landscapes",
    excerpt:
      "In today's global economy, volatility is no longer an intermittent shock — it is a structural condition. Nowhere is this more evident than in dynamic markets.",
    tags: ['Governance & Policy', 'Operations'],
    downloadUrl: '/downloads/ideas-at-work-resilience.pdf',
    body: [
      {
        heading: 'Beyond Short-Term Growth: Foundations First',
        content:
          'Building resilience requires: maintaining high liquidity to absorb unexpected shocks; adopting flexible strategies that exploit market dispersion; bolstering supply chains through redundancy and real-time risk monitoring; and prioritising risk management over pure speed.',
      },
      {
        heading: 'Geopolitics: Disruption as the New Normal',
        content:
          'The US/Israel-Iran war beginning February 2026 severely affected oil supplies from GCC countries. The blockage of the Strait of Hormuz triggered a 30% increase in oil prices between February and March 2026 (Source: Euromonitor International). Trade restrictions and resource nationalism are also redrawing commodity supply maps.',
      },
      {
        heading: 'Climate Change: Agricultural Volatility Intensifies',
        content:
          'In Q2 2024, cocoa prices rose 183% year-on-year after climate shocks in key producing regions. Coffee prices jumped 88% following droughts in Brazil and Vietnam in early 2025.',
      },
      {
        heading: 'Technology and Energy: The AI Revolution Drives Demand',
        content:
          'China controls 63% of rare earth oxides. The Democratic Republic of Congo supplies 71% of cobalt. Companies must secure baseload power and diversify sourcing.',
      },
      {
        heading: 'Building Resilience: Strategic Actions',
        content:
          'Leaders must integrate: geopolitical risk pricing and hedging; diversified sourcing and circular supply chains; logistics networks with alternative routes and strategic buffers.',
      },
      {
        heading: 'Want to Go Deeper? TEAM Can Help',
        content:
          'TEAM Consulting, from redesigning your operating model to embedding resilience into governance structures, we work alongside your leadership to make volatility a competitive advantage. TEAM Insights, understand your exposure to geopolitical, climate, and supply chain risks before they materialise, with market-specific intelligence. TEAM Human Capital, resilience requires resilient people. We help you build the mindsets and skills to navigate uncertainty at every level. TEAM Wellness, our wellness programmes ensure that your people remain focused, supported, and effective, even in turbulent times.',
      },
    ],
  },
  {
    id: 'article-3',
    slug: 'wellness-as-a-performance-driver',
    title: 'Wellness as a Performance Driver: How GREATER Organisations Put People First',
    excerpt:
      'For years, workplace wellness has been treated as a "nice-to-have." The evidence is now undeniable: wellness is a critical performance driver that boosts productivity by up to 20%.',
    tags: ['Wellness & Coaching', 'Organisation & Culture'],
    downloadUrl: '/downloads/ideas-at-work-wellness.pdf',
    body: [
      {
        heading: 'Beyond Perks: Wellness as Core Business Strategy',
        content:
          'Wellness goes beyond physical health. It is a holistic approach integrating mental, emotional, and social well-being. When employees feel genuinely supported, they are more engaged, motivated, and loyal, driving organisational efficiency, creativity, and profitability.',
      },
      {
        heading: 'The Business Case',
        content:
          'Research consistently shows that physically healthy, mentally resilient, emotionally supported employees drive: higher productivity and job satisfaction; lower healthcare costs; reduced turnover and attrition; stronger organisational culture; and increased creativity and innovation.',
      },
      {
        heading: 'Redefining Wellness',
        content:
          'Wellness is multidimensional: Psychological Safety; Workload Sustainability; Financial Wellbeing; Purpose and Meaning.',
      },
      {
        heading: 'From Reactive to Proactive',
        content:
          'A comprehensive wellness programme includes: physical wellbeing initiatives; mental health support systems; financial wellbeing programmes; career development opportunities; and social and community engagement.',
      },
      {
        heading: 'Breaking Stigmas, Building Open Dialogues',
        content:
          'Mental health challenges are increasing in the workplace. Open dialogues, flexible work policies, and Employee Assistance Programmes (EAPs) are essential.',
      },
      {
        heading: "Leadership's Role",
        content:
          "Wellness cannot be delegated solely to HR. Leaders set the tone through how they communicate under pressure, whether they model work-life balance, and how they respond to mistakes.",
      },
      {
        heading: 'The Link Between Wellness and ESG',
        content:
          'Employee wellness reflects responsible governance, ethical workforce management, and sustainable organisational design. A company that neglects its people cannot credibly claim long-term sustainability.',
      },
      {
        heading: 'The Big Shift: From Perks to Performance',
        content:
          'The brain has finite cognitive capacity. Prevention, Recovery, and Sustainability must be built into how work happens, not bolted on as benefits.',
      },
      {
        heading: 'Want to Go Deeper?',
        content:
          'TEAM Consulting, from designing wellness-aligned operating models to embedding wellbeing into governance structures. TEAM Insights, measure engagement, identify burnout risks, and track wellness ROI with market-specific intelligence. TEAM Human Capital, we help you build the mindsets, behaviours, and frameworks to sustain wellbeing at every level. TEAM Wellness, from Employee Assistance Programmes to resilience coaching and leadership wellbeing, our hands-on support ensures your people thrive, not just survive.',
      },
    ],
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
    speakers: [{ name: 'Dr. Eric D Zinyengere', title: 'Managing Consultant', company: 'TEAM Consulting' }],
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
      'Yes. TEAM has worked across regional markets including Zambia, Namibia, Botswana, Mozambique, Uganda, Tanzania, Malawi, South Africa, and Lesotho.',
    keywords: ['countries', 'outside zimbabwe', 'zambia', 'international'],
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

