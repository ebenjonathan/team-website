// ─── Team and people development programmes ─────────────────────────────────
// Shown under "Lead your teams" in the menu and at /programmes/<slug>.
// Wording is drawn from the company profile where it exists. Lines marked
// REVIEW are reasonable descriptions that TEAM should check before going live.

import type { EnquiryTopic } from './enquiry'

export interface Programme {
  slug: string
  name: string
  shortName: string
  topic: EnquiryTopic
  summary: string
  intro: string
  forWho: string[]
  outcomes: string[]
  formats: { label: string; value: string }[]
  modules: { title: string; body: string }[]
  evidence?: string[]
}

export const programmes: Programme[] = [
  {
    slug: 'team-building',
    name: 'Team building and facilitation',
    shortName: 'Team building',
    topic: 'team-building',
    summary:
      'Facilitated sessions that help teams, and boards with their management, trust each other, disagree well and commit to shared goals.',
    intro:
      'Most teams do not fail for lack of talent. They stall because of unspoken tension, unclear roles and decisions nobody owns. Our team building is practical facilitation built around your real work, not games for their own sake.',
    forWho: [
      'Executive and management teams that need to work as one',
      'Boards and management teams building a stronger working relationship',
      'Newly formed or merged teams',
      'Teams going through change, restructuring or a difficult period',
    ],
    outcomes: [
      'A shared, honest picture of how the team works today',
      'Agreed ways of working, roles and decision rights',
      'Better trust, healthier conflict and clearer commitment',
      'A short action plan the team owns after the session',
    ],
    formats: [
      { label: 'Format', value: 'Facilitated, in person or online' },
      { label: 'Length', value: 'Half-day to multi-day' }, // REVIEW
      { label: 'Led by', value: 'TEAM principal consultants' },
    ],
    modules: [
      {
        title: 'How dysfunctional is your team?',
        body: 'A short diagnostic of trust, conflict, commitment, accountability and focus on results, so the session starts from evidence.',
      },
      {
        title: 'Understanding and overcoming team dysfunctions',
        body: 'Facilitated work on the patterns holding the team back, using our team dynamics toolkit.',
      },
      {
        title: 'Board and management team building',
        body: 'Structured sessions that clarify roles between the board and management and build a working relationship based on trust.',
      },
      {
        title: 'Follow-through',
        body: 'Agreed commitments, check-ins and coaching so the gains last beyond the day.',
      },
    ],
    evidence: [
      'Board and management team building for state-owned enterprises and private companies.',
      'Team building and facilitation across the public and private sectors.',
    ],
  },
  {
    slug: 'leadership-development-programmes',
    name: 'Leadership Development Programmes (LDPs)',
    shortName: 'Leadership Development Programmes',
    topic: 'ldp',
    summary:
      'Programmes for senior and emerging leaders that combine structured learning, coaching and real work, so new habits survive Monday morning.',
    intro:
      'Our leadership development programmes are built for leaders who are already busy, not for those who have time for a classroom. We combine structured learning with embedded coaching and real-work application, developing the judgement, communication and execution discipline that distinguishes high-performing leaders.',
    forWho: [
      'Executives and senior managers',
      'High-potential and emerging leaders',
      'Leadership teams preparing for growth or transformation',
      'Organisations building a leadership pipeline and succession',
    ],
    outcomes: [
      'Leaders who set direction and align their teams around it',
      'Stronger judgement, communication and execution discipline',
      'Leadership behaviours linked to your strategy and values',
      'A pipeline of leaders ready for bigger roles',
    ],
    formats: [
      { label: 'Format', value: 'Cohort programme with coaching' },
      { label: 'Length', value: 'Typically 3 to 9 months' }, // REVIEW
      { label: 'Tailored to', value: 'Your strategy and culture' },
    ],
    modules: [
      { title: 'Leading self', body: 'Purpose, values, resilience and personal effectiveness under pressure.' },
      { title: 'Leading others', body: 'Coaching conversations, feedback, delegation and building high-performing teams.' },
      { title: 'Leading the organisation', body: 'Strategic thinking, alignment, governance and leading change.' },
      { title: 'Applied leadership project', body: 'A real business challenge each leader works on, with coaching, so learning shows up in results.' },
    ],
    evidence: [
      'Facilitation of leadership development programmes for key players in financial services, health and mining.',
    ],
  },
  {
    slug: 'management-development-programmes',
    name: 'Management Development Programmes (MDPs)',
    shortName: 'Management Development Programmes',
    topic: 'mdp',
    summary:
      'Practical programmes for new and middle managers on planning, performance, people and execution, the everyday craft of running a team well.',
    intro:
      'Many managers are promoted for being good at their job, then left to work out management on their own. Our management development programmes give them the practical tools to plan, run, measure and improve the work of a team, and the confidence to lead people through it.', // REVIEW
    forWho: [
      'First-time and newly promoted managers',
      'Supervisors and middle managers',
      'Technical specialists moving into management',
      'Organisations standardising how managers plan and measure performance',
    ],
    outcomes: [
      'Managers who turn strategy into team plans and priorities',
      'Consistent performance management, including scorecards and KPIs',
      'Better one-to-ones, feedback and delegation',
      'Teams that deliver more predictably',
    ],
    formats: [
      { label: 'Format', value: 'Workshops with on-the-job assignments' },
      { label: 'Length', value: 'Typically 6 to 12 weeks' }, // REVIEW
      { label: 'Tailored to', value: 'Your systems and policies' },
    ],
    modules: [
      { title: 'From specialist to manager', body: 'The role of a manager, priorities, time and personal effectiveness.' },
      { title: 'Planning and execution', body: 'Translating strategy into team plans, operational targets and project discipline.' },
      { title: 'Performance management', body: 'Balanced scorecards, KPIs, reviews and fair, useful feedback.' },
      { title: 'Managing people', body: 'Coaching, delegation, motivation and handling difficult conversations.' },
    ],
  },
]

export const programmeBySlug = (slug: string) => programmes.find((p) => p.slug === slug)
