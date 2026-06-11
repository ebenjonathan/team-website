import { Metadata } from 'next'
import { TeamCard } from '@/components/cards/TeamCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getTeamMembers } from '@/lib/sanity/content'

export const metadata: Metadata = {
  title: 'Our Team',
  description: 'Meet the talented team who drive innovation at TEAM Consulting.',
}

export default async function OurTeamPage() {
  const team = await getTeamMembers()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary-deeper text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Team</h1>
          <p className="text-xl text-slate-200 max-w-2xl">
            Talented individuals passionate about digital transformation and driving business impact.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Meet Our Team"
            subtitle="The talented people behind TEAM Consulting"
            centered
          />

          <div className="grid gap-8 mt-16">
            {team.map((member) => (
              <article key={member.id} className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
                  <TeamCard member={member} />
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{member.name}</h3>
                    <p className="text-primary font-semibold mt-1">{member.role}</p>
                    <p className="mt-3 text-slate-700">{member.bio}</p>
                    <div className="mt-4 text-sm text-slate-600">
                      <p>Years Consulting: {member.yearsConsulting ?? 'N/A'}</p>
                      <p>Overall Experience: {member.overallExperience ?? 'N/A'}</p>
                    </div>
                    {!!member.qualifications?.length && (
                      <ul className="mt-4 list-disc pl-5 text-sm text-slate-600">
                        {member.qualifications.map((qualification) => (
                          <li key={qualification}>{qualification}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Culture */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Our Culture</h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Collaboration</h3>
              <p className="text-slate-600 leading-relaxed">
                We work together as one team, breaking down silos and leveraging diverse perspectives
                to deliver exceptional results.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Continuous Learning</h3>
              <p className="text-slate-600 leading-relaxed">
                We invest in our people&apos;s growth through training, mentorship, and exposure to cutting-edge
                technologies.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Impact-Driven</h3>
              <p className="text-slate-600 leading-relaxed">
                Everything we do is measured by its impact on our clients&apos; business objectives and the
                communities we serve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Join Our Team</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            We&apos;re always looking for talented individuals passionate about digital transformation.
          </p>
          <a href="/careers" className="inline-block bg-white text-primary hover:bg-slate-100 font-bold py-3 px-8 rounded-lg transition-colors">
            View Career Opportunities
          </a>
        </div>
      </section>
    </div>
  )
}

