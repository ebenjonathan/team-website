import { Metadata } from 'next'
import Image from 'next/image'
import { Linkedin } from 'lucide-react'
import { getTeamMembers } from '@/lib/sanity/content'
import { listPublishedAssociates } from '@/lib/server/associatesStore'
import { PageHero, Section, SectionIntro, EnquiryBand, ArrowLink } from '@/components/editorial'

// Refresh at least every minute so associates added in the admin appear quickly.
export const revalidate = 60

export const metadata: Metadata = {
  title: 'TEAM Leadership',
  description: 'Meet the Principal Consultants who lead TEAM Consulting.',
  alternates: { canonical: '/why-team/our-team' },
  openGraph: {
    title: 'TEAM Leadership | TEAM Consulting',
    description: 'Meet the Principal Consultants who lead TEAM Consulting.',
    url: '/why-team/our-team',
  },
}

const isPlaceholder = (image?: string) =>
  !image || image.endsWith('/male-profile.png') || image.endsWith('/female-profile.png')

export default async function OurTeamPage() {
  const [team, associates] = await Promise.all([getTeamMembers(), listPublishedAssociates()])

  return (
    <>
      <PageHero
        eyebrow="Leadership"
        title="The principal consultants who lead every engagement."
        lead="Coaches, catalysts and consultants who understand before they prescribe, supported by a network of specialist associates."
      />

      {team.map((member, i) => (
        <Section key={member.id} tone={i % 2 ? 'tint' : 'white'} className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {!isPlaceholder(member.image) && (
            <div className="lg:col-span-4 relative aspect-[4/5] overflow-hidden rounded-sm max-w-sm">
              <Image src={member.image} alt={member.name} fill sizes="(min-width:1024px) 30vw, 90vw" className="object-cover object-top" />
            </div>
          )}
          <div className="lg:col-span-8">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary-deeper">{member.name}</h2>
            <p className="mt-2 text-lg font-semibold text-primary">{member.role}</p>

            {(member.yearsConsulting || member.overallExperience) && (
              <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4 border-y border-gray-300 py-4">
                {member.yearsConsulting && (
                  <div>
                    <dt className="text-sm text-body/70">Years consulting</dt>
                    <dd className="font-heading font-bold text-2xl text-primary-deeper">{member.yearsConsulting}</dd>
                  </div>
                )}
                {member.overallExperience && (
                  <div>
                    <dt className="text-sm text-body/70">Years of experience</dt>
                    <dd className="font-heading font-bold text-2xl text-primary-deeper">{member.overallExperience}</dd>
                  </div>
                )}
              </dl>
            )}

            <p className="mt-6 text-body leading-relaxed max-w-[70ch]">{member.bio}</p>

            {!!member.qualifications?.length && (
              <div className="mt-8">
                <h3 className="font-semibold text-primary-deeper mb-2">Qualifications</h3>
                <ul className="text-body space-y-1">
                  {member.qualifications.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
              </div>
            )}

            {member.socialLinks?.linkedin && (
              <a
                href={member.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 font-semibold text-primary-deeper hover:text-primary"
              >
                <Linkedin className="w-4 h-4" aria-hidden /> Connect on LinkedIn
              </a>
            )}
          </div>
        </Section>
      ))}

      <Section bordered>
        <SectionIntro
          eyebrow="Associate consultants"
          title="Senior leadership, with specialist depth."
          lead="Our principals lead every engagement and draw on a network of trusted associate consultants, without the overhead of a large firm."
        />

        {associates.length > 0 && (
          <ul className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
            {associates.map((a) => (
              <li key={a.id} className="border-t-2 border-primary-deeper pt-6">
                {a.photo && (
                  <div className="relative aspect-[4/5] w-32 overflow-hidden rounded-sm mb-5 bg-primary-light">
                    <Image src={a.photo} alt={a.name} fill sizes="128px" className="object-cover object-top" unoptimized={a.photo.startsWith('/uploads/')} />
                  </div>
                )}
                <h3 className="font-heading font-bold text-xl text-primary-deeper">{a.name}</h3>
                <p className="mt-1 font-semibold text-primary">{a.role}</p>
                {(a.yearsConsulting || a.overallExperience) && (
                  <p className="mt-3 text-sm text-body/80">
                    {[
                      a.yearsConsulting ? `${a.yearsConsulting} years consulting` : '',
                      a.overallExperience ? `${a.overallExperience} years’ experience` : '',
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                )}
                {a.bio && <p className="mt-3 text-body leading-relaxed">{a.bio}</p>}
                {!!a.focusAreas.length && (
                  <p className="mt-3 text-sm text-body">
                    <strong className="text-primary-deeper">Focus:</strong> {a.focusAreas.join(', ')}
                  </p>
                )}
                {!!a.sectors.length && (
                  <p className="mt-1 text-sm text-body">
                    <strong className="text-primary-deeper">Sectors:</strong> {a.sectors.join(', ')}
                  </p>
                )}
                {!!a.qualifications.length && (
                  <details className="mt-3 text-sm text-body">
                    <summary className="cursor-pointer font-semibold text-primary-deeper">Qualifications</summary>
                    <ul className="mt-2 space-y-1">
                      {a.qualifications.map((q) => (
                        <li key={q}>{q}</li>
                      ))}
                    </ul>
                  </details>
                )}
                {a.linkedin && (
                  <a href={a.linkedin} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-deeper hover:text-primary">
                    <Linkedin className="w-4 h-4" aria-hidden /> LinkedIn
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-12">
          <ArrowLink href="/careers">Interested in joining us? See careers</ArrowLink>
        </div>
      </Section>

      <EnquiryBand />
    </>
  )
}
