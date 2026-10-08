import { Metadata } from 'next'
import { PageHero, Section, SectionIntro, ArrowLink } from '@/components/editorial'

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join TEAM Consulting Services and build a meaningful consulting career across dynamic international markets.',
  alternates: { canonical: '/careers' },
}

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Build a consulting career that makes a visible difference."
        lead="Our people are our key asset. As we grow our regional footprint, we offer challenging, rewarding work alongside colleagues with diverse skills."
      />

      <Section className="grid lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="lg:col-span-7 space-y-5 text-lg text-body leading-relaxed">
          <p>
            We look for people who are ambitious, want to develop their careers and want to contribute to TEAM’s
            long-term, sustainable growth.
          </p>
          <p>
            <strong className="text-primary-deeper">For graduates</strong>, our structured Graduate Trainee Programme
            nurtures talent from day one.{' '}
            <strong className="text-primary-deeper">For experienced professionals</strong>, we offer a fulfilling career
            where you can clearly see your work shaping our clients’ success, and grow with the group.
          </p>
        </div>

        <aside className="lg:col-span-5 bg-primary-light p-8 rounded-sm">
          <SectionIntro title="How to apply" />
          <p className="mt-4 text-body">
            Email the following to{' '}
            <a href="mailto:hr@team.co.zw" className="font-semibold text-primary-deeper underline">hr@team.co.zw</a>:
          </p>
          <ul className="mt-4 divide-y divide-gray-300 border-y border-gray-300">
            <li className="py-3 text-body">A letter stating the position you are applying for</li>
            <li className="py-3 text-body">Your detailed CV</li>
            <li className="py-3 text-body">A link to your LinkedIn profile</li>
          </ul>
          <div className="mt-6">
            <ArrowLink href="mailto:hr@team.co.zw?subject=Application" external>
              Email your application
            </ArrowLink>
          </div>
        </aside>
      </Section>
    </>
  )
}
