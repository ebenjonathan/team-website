import { Metadata } from 'next'
import Link from 'next/link'
import { PageHero, Section, SectionIntro, EnquiryBand } from '@/components/editorial'

export const metadata: Metadata = {
  title: 'Why TEAM Consulting',
  description: 'Discover what makes TEAM Consulting a trusted advisory partner for growth, governance and performance.',
  alternates: { canonical: '/why-team' },
}

const reasons = [
  { title: 'Focused on results', body: 'We scope work against measurable outcomes and stay for the follow-through, so change lasts beyond the engagement.' },
  { title: 'Senior people on your work', body: 'Principal consultants with decades of experience across leadership, operations, governance and people development.' },
  { title: 'Steady execution', body: 'We balance pace with discipline, so change is implemented thoughtfully and with clear accountability.' },
  { title: 'A partner, not a vendor', body: 'We work closely with leadership teams and stay engaged through the moments that matter most.' },
  { title: 'Practical insight', body: 'A fresh perspective on complex issues, without losing sight of what is workable in your context.' },
  { title: 'A long track record', body: 'Two decades of engagements, with more than 80% of our work coming from repeat and referral clients.' },
]

const more = [
  { href: '/why-team/our-team', title: 'Our leadership', body: 'Meet the principal consultants who lead every engagement.' },
  { href: '/why-team/our-clients', title: 'Our clients', body: 'The banks, insurers, ministries and development partners we have worked with.' },
  { href: '/why-team/our-success-stories', title: 'Case stories', body: 'What we did, and what changed, in recent engagements.' },
  { href: '/why-team/our-partners', title: 'Our partners', body: 'Specialist firms we work alongside to extend what we offer.' },
]

export default function WhyTeamPage() {
  return (
    <>
      <PageHero
        eyebrow="Why TEAM"
        title="Why organisations choose to work with us, and keep coming back."
        lead="Organisations across twelve countries trust us with their strategy, governance and people. Here is what they tell us makes the difference."
      />

      <Section>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 border-t border-gray-300">
          {reasons.map((r) => (
            <article key={r.title} className="py-8 border-b border-gray-300">
              <h2 className="font-heading font-bold text-xl text-primary-deeper">{r.title}</h2>
              <p className="mt-3 text-body leading-relaxed">{r.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="tint">
        <SectionIntro eyebrow="Learn more" title="See the people and the work behind the practice." />
        <div className="mt-12 grid md:grid-cols-2 gap-x-12">
          {more.map((m) => (
            <Link key={m.href} href={m.href} className="group border-t-2 border-primary-deeper py-6">
              <h3 className="font-heading font-bold text-2xl text-primary-deeper group-hover:text-primary">
                {m.title} <span aria-hidden className="text-primary">→</span>
              </h3>
              <p className="mt-2 text-body">{m.body}</p>
            </Link>
          ))}
        </div>
      </Section>

      <EnquiryBand />
    </>
  )
}
