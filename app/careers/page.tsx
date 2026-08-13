import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join TEAM Consulting Services and build a meaningful consulting career across dynamic international markets.',
  alternates: { canonical: '/careers' },
}

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-primary-deeper text-white py-20">
        <div className="container mx-auto px-4">
          <p className="text-primary-light text-sm font-semibold uppercase tracking-widest mb-4">Careers</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Join Our Team</h1>
          <p className="text-xl text-slate-200 max-w-3xl">
            We&apos;re always looking for talented individuals passionate about consultancy.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-slate-700 leading-relaxed mb-6">
            We truly believe that our employees are our key assets, and as a seasoned consultancy firm, while we continue
            to expand our regional footprint, we offer challenging and rewarding career opportunities, encouraging our
            employees to progress and develop alongside teams with diverse skills, in a fast-paced and exciting
            environment. Our employees are one of our core competitive advantages and talent management is thus one of
            our key priorities.
          </p>
          <p className="text-slate-700 leading-relaxed">
            We look for people who are ambitious and want to develop their career while making a strong contribution to
            TEAM&apos;s long-term, sustainable growth. For young graduates who join us we nurture their talent through a
            well-structured Graduate Trainee Programme. For experienced professionals we offer a fulfilling career where they
            can clearly see their efforts culminating in our team&apos;s success and grow with the group. If you are looking for an
            exciting career with a grounded advisory practice operating across international markets, come and speak with us.
          </p>
        </div>
      </section>

      {/* How To Apply */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="rounded-2xl bg-primary-deeper text-white p-10">
            <h2 className="text-3xl font-bold mb-6 uppercase tracking-wide">How To Apply</h2>
            <div className="space-y-4 text-slate-100">
              <p>
                <span className="font-semibold">Please submit the following to </span>
                <a href="mailto:hr@team.co.zw" className="underline hover:text-primary-light">
                  hr@team.co.zw
                </a>
                <span className="font-semibold">:</span>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Application letter stating the nature of the position applied for</li>
                <li>Copy of your detailed curriculum vitae</li>
                <li>A link to your LinkedIn profile</li>
              </ul>
              <p className="text-slate-200">
                If not on LinkedIn, please join{' '}
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary-light"
                >
                  here
                </a>{' '}
                and complete your profile.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

