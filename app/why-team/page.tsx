import { Metadata } from 'next'
import Link from 'next/link'
import { Target, Users, Zap, Handshake, Lightbulb, TrendingUp, Briefcase, Building2, Trophy } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'

export const metadata: Metadata = {
  title: 'Why TEAM Consulting',
  description: 'Discover what makes TEAM Consulting a trusted advisory partner for growth, governance and performance.',
}

export default function WhyTeamPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary-deeper text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Why TEAM Consulting</h1>
          <p className="text-xl text-slate-200 max-w-2xl">
            Discover what makes us a trusted partner for organisations navigating change with purpose and discipline.
          </p>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="What Clients Say About Us"
            subtitle="Why organizations choose TEAM Consulting"
            centered
          />

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-slate-50 p-8 rounded-lg hover:shadow-lg transition-shadow">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary"><Target className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Results-Focused</h3>
              <p className="text-slate-600">
                We focus on measurable outcomes and business impact, with practical follow-through that lasts beyond the engagement.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-lg hover:shadow-lg transition-shadow">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary"><Users className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Experienced Team</h3>
              <p className="text-slate-600">
                Senior advisors with deep experience across leadership, operations, governance, and people development.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-lg hover:shadow-lg transition-shadow">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary"><Zap className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Steady Execution</h3>
              <p className="text-slate-600">
                Our approach balances pace with discipline so change is implemented thoughtfully and with accountability.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-lg hover:shadow-lg transition-shadow">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary"><Handshake className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Trusted Partnership</h3>
              <p className="text-slate-600">
                We work closely with leadership teams, staying engaged through the moments that matter most.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-lg hover:shadow-lg transition-shadow">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary"><Lightbulb className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Practical Insight</h3>
              <p className="text-slate-600">
                We bring fresh perspective to complex issues without losing sight of what is workable and sustainable.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-lg hover:shadow-lg transition-shadow">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary"><TrendingUp className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Proven Track Record</h3>
              <p className="text-slate-600">
                Two decades of engagements with repeat clients and a strong record of long-term partnerships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Explore More */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">
            Learn More About Us
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <Link
              href="/why-team/our-team"
              className="group bg-white p-8 rounded-lg hover:shadow-lg transition-shadow hover:border-primary border-2 border-transparent"
            >
              <span className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform"><Briefcase className="w-7 h-7" /></span>
              <span className="block text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                Our Team
              </span>
              <span className="block text-slate-600">
                Meet the talented individuals driving innovation and transformation at TEAM Consulting.
              </span>
              <span className="block mt-6 text-primary font-bold group-hover:translate-x-2 transition-transform">
                Explore →
              </span>
            </Link>

            <Link
              href="/why-team/our-partners"
              className="group bg-white p-8 rounded-lg hover:shadow-lg transition-shadow hover:border-primary border-2 border-transparent"
            >
              <span className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform"><Handshake className="w-7 h-7" /></span>
              <span className="block text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                Our Partners
              </span>
              <span className="block text-slate-600">
                Strategic partnerships with leading technology providers and consulting firms.
              </span>
              <span className="block mt-6 text-primary font-bold group-hover:translate-x-2 transition-transform">
                Learn More →
              </span>
            </Link>

            <Link
              href="/why-team/our-clients"
              className="group bg-white p-8 rounded-lg hover:shadow-lg transition-shadow hover:border-primary border-2 border-transparent"
            >
              <span className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform"><Building2 className="w-7 h-7" /></span>
              <span className="block text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                Our Clients
              </span>
              <span className="block text-slate-600">
                Trusted by Fortune 500 companies and ambitious startups across international markets and beyond.
              </span>
              <span className="block mt-6 text-primary font-bold group-hover:translate-x-2 transition-transform">
                See Portfolio →
              </span>
            </Link>

            <Link
              href="/why-team/our-success-stories"
              className="group bg-white p-8 rounded-lg hover:shadow-lg transition-shadow hover:border-primary border-2 border-transparent"
            >
              <span className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform"><Trophy className="w-7 h-7" /></span>
              <span className="block text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                Success Stories
              </span>
              <span className="block text-slate-600">
                Measurable outcomes and real impact stories from our transformational engagements.
              </span>
              <span className="block mt-6 text-primary font-bold group-hover:translate-x-2 transition-transform">
                Discover →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

