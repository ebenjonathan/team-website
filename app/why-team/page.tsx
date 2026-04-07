import { Metadata } from 'next'
import Link from 'next/link'
import { SectionHeader } from '@/components/ui/SectionHeader'

export const metadata: Metadata = {
  title: 'Why Team Advisory',
  description: 'Discover what makes Team Advisory the trusted partner for digital transformation.',
}

export default function WhyTeamPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Why Team Advisory</h1>
          <p className="text-xl text-slate-200 max-w-2xl">
            Discover what makes us the trusted partner for digital transformation and business growth.
          </p>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="What Clients Say About Us"
            subtitle="Why organizations choose Team Advisory"
            centered
          />

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-slate-50 p-8 rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Results-Driven</h3>
              <p className="text-slate-600">
                We focus on measurable outcomes and business impact, not deliverables. Your success is our success.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Expert Team</h3>
              <p className="text-slate-600">
                Industry veterans with global experience and deep expertise across all disciplines.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Fast Execution</h3>
              <p className="text-slate-600">
                Agile methodologies and proven processes enable rapid delivery without compromising quality.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">True Partnership</h3>
              <p className="text-slate-600">
                We&apos;re invested in your success, working closely with your team as an extension of your organization.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Innovation</h3>
              <p className="text-slate-600">
                We stay ahead of the curve, constantly researching and implementing cutting-edge solutions.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Proven Track Record</h3>
              <p className="text-slate-600">
                200+ successful projects with measurable ROI across diverse industries and markets.
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
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">👨‍💼</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                Our Team
              </h3>
              <p className="text-slate-600">
                Meet the talented individuals driving innovation and transformation at Team Advisory.
              </p>
              <div className="mt-6 text-primary font-bold group-hover:translate-x-2 transition-transform">
                Explore →
              </div>
            </Link>

            <Link
              href="/why-team/our-partners"
              className="group bg-white p-8 rounded-lg hover:shadow-lg transition-shadow hover:border-primary border-2 border-transparent"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🤝</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                Our Partners
              </h3>
              <p className="text-slate-600">
                Strategic partnerships with leading technology providers and consulting firms.
              </p>
              <div className="mt-6 text-primary font-bold group-hover:translate-x-2 transition-transform">
                Learn More →
              </div>
            </Link>

            <Link
              href="/why-team/our-clients"
              className="group bg-white p-8 rounded-lg hover:shadow-lg transition-shadow hover:border-primary border-2 border-transparent"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🏢</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                Our Clients
              </h3>
              <p className="text-slate-600">
                Trusted by Fortune 500 companies and ambitious startups across Africa and beyond.
              </p>
              <div className="mt-6 text-primary font-bold group-hover:translate-x-2 transition-transform">
                See Portfolio →
              </div>
            </Link>

            <Link
              href="/why-team/our-success-stories"
              className="group bg-white p-8 rounded-lg hover:shadow-lg transition-shadow hover:border-primary border-2 border-transparent"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🏆</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                Success Stories
              </h3>
              <p className="text-slate-600">
                Measurable outcomes and real impact stories from our transformational engagements.
              </p>
              <div className="mt-6 text-primary font-bold group-hover:translate-x-2 transition-transform">
                Discover →
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
