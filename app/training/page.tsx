import type { Metadata } from 'next'
import Link from 'next/link'
import { courseGroups, otherCourses, trainingFormats, trainingProfilePdf } from '@/lib/data/training'
import { enquiryHref } from '@/lib/data/enquiry'
import { publicFileExists } from '@/lib/server/publicFile'
import { PageHero, Section, SectionIntro, EnquiryBand, ButtonLink } from '@/components/editorial'

export const metadata: Metadata = {
  title: 'Training Courses',
  description:
    'Training @ Work: TEAM Consulting courses and development programmes in strategy, leadership, teams, operations, finance and personal effectiveness.',
  alternates: { canonical: '/training' },
  openGraph: {
    title: 'Training Courses | TEAM Consulting',
    description: 'Professional development to deliver strategic excellence.',
    url: '/training',
  },
}

export default function TrainingPage() {
  const hasPdf = publicFileExists(trainingProfilePdf)

  return (
    <>
      <PageHero
        eyebrow="Training @ Work"
        title="Professional development to deliver strategic excellence."
        lead="No organisation can succeed while neglecting the development of its people. Our courses and programmes cover strategy, leadership, teams, operations, finance and personal effectiveness, and every one can be tailored to your organisation."
      >
        <ButtonLink href={enquiryHref('training')}>Ask about training</ButtonLink>
        {hasPdf && (
          <a
            href={trainingProfilePdf}
            download
            className="inline-flex items-baseline gap-1 font-semibold text-primary-deeper hover:text-primary underline-offset-4 decoration-2 hover:underline"
          >
            Download the training profile (PDF) <span aria-hidden className="text-primary">↓</span>
          </a>
        )}
      </PageHero>

      <Section className="grid md:grid-cols-3 gap-10">
        {trainingFormats.map((f) => (
          <div key={f.title} className="border-t-2 border-primary-deeper pt-5">
            <h2 className="font-heading font-bold text-xl text-primary-deeper">{f.title}</h2>
            <p className="mt-2 text-body leading-relaxed">{f.body}</p>
          </div>
        ))}
      </Section>

      <Section tone="tint">
        <SectionIntro
          eyebrow="Course catalogue"
          title="Courses and programmes."
          lead="Durations are typical and can be adjusted. Fees are quoted for each organisation, depending on group size, format and tailoring."
        />
        <nav aria-label="Course categories" className="mt-8 flex flex-wrap gap-2">
          {courseGroups.map((g) => (
            <a
              key={g.id}
              href={`#${g.id}`}
              className="px-3 py-1.5 rounded-full border border-primary-deeper/20 bg-white text-sm font-semibold text-primary-deeper hover:border-primary hover:text-primary"
            >
              {g.title}
            </a>
          ))}
          <a
            href="#other-courses"
            className="px-3 py-1.5 rounded-full border border-primary-deeper/20 bg-white text-sm font-semibold text-primary-deeper hover:border-primary hover:text-primary"
          >
            Other courses
          </a>
        </nav>

        <div className="mt-12 space-y-14">
          {courseGroups.map((g) => (
            <div key={g.id} id={g.id} className="scroll-mt-28">
              <h3 className="font-heading font-bold text-2xl text-primary-deeper">{g.title}</h3>
              <ul className="mt-5 divide-y divide-gray-300 border-y border-gray-300">
                {g.courses.map((c) => (
                  <li key={c.name} className="py-5 grid md:grid-cols-12 gap-x-8 gap-y-2">
                    <div className="md:col-span-7">
                      <p className="font-semibold text-lg text-primary-deeper">
                        {c.href ? (
                          <Link href={c.href} className="hover:text-primary">
                            {c.name} <span aria-hidden className="text-primary">→</span>
                          </Link>
                        ) : (
                          c.name
                        )}
                      </p>
                      <p className="mt-1 text-body leading-relaxed">{c.summary}</p>
                    </div>
                    <dl className="md:col-span-5 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <dt className="text-body/70">Duration</dt>
                        <dd className="mt-0.5 font-semibold text-primary-deeper">{c.duration}</dd>
                      </div>
                      <div>
                        <dt className="text-body/70">For</dt>
                        <dd className="mt-0.5 text-body">{c.audience}</dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section id="other-courses" className="scroll-mt-20">
        <SectionIntro
          eyebrow="Other courses"
          title="More courses on request."
          lead="We also run the courses below, and can design training for a need not listed here."
        />
        <ul className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 border-t border-gray-200">
          {otherCourses.map((c) => (
            <li key={c.name} className="py-3 border-b border-gray-200 flex justify-between gap-4">
              <span className="text-body">{c.name}</span>
              <span className="text-sm text-body/70 whitespace-nowrap">{c.duration}</span>
            </li>
          ))}
        </ul>
        {hasPdf && (
          <p className="mt-10 text-body">
            Full course outlines are in the{' '}
            <a href={trainingProfilePdf} download className="font-semibold text-primary-deeper underline underline-offset-4 hover:text-primary">
              training profile (PDF)
            </a>
            .
          </p>
        )}
      </Section>

      <EnquiryBand
        title="Plan training for your people."
        body="Tell us who you want to train, what you want to change and when. We will recommend courses, tailor the content and send a clear quotation."
        topic="training"
        buttonLabel="Ask about training"
      />
    </>
  )
}
