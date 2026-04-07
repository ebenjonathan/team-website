import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Success Stories',
  description: 'Inspiring transformation stories from our successful engagements.',
}

export default function SuccessStoriesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Success Stories</h1>
          <p className="text-xl text-slate-200 max-w-2xl">
            Inspiring transformation stories from organizations that partnered with Team Advisory.
          </p>
        </div>
      </section>

      {/* Stories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="space-y-20">
            {/* Story 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-primary font-bold mb-2">CASE STUDY</p>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                  E-Commerce Boom: 300% Sales Growth
                </h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  A traditional retailer struggling with legacy systems needed a modern e-commerce platform
                  to compete in the digital age. We built a cloud-native platform that handled 10x traffic
                  spikes and enabled personalized shopping experiences.
                </p>
                <div className="bg-slate-50 p-6 rounded-lg mb-6">
                  <p className="font-bold text-slate-900 mb-3">Results:</p>
                  <ul className="space-y-2 text-slate-600">
                    <li>✓ 300% increase in online sales within 12 months</li>
                    <li>✓ 50,000+ new active customers</li>
                    <li>✓ 99.99% platform uptime</li>
                    <li>✓ Reduced server costs by 40%</li>
                  </ul>
                </div>
                <Link
                  href="/ideas-at-work/ecommerce-platform-launch"
                  className="text-primary hover:text-primary-dark font-bold"
                >
                  Read Full Case Study →
                </Link>
              </div>
              <div className="bg-gradient-to-br from-primary-muted to-primary-light p-12 rounded-lg h-96 flex items-center justify-center">
                <p className="text-center text-slate-400">Project Image</p>
              </div>
            </div>

            {/* Story 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-gradient-to-br from-green-100 to-green-50 p-12 rounded-lg h-96 flex items-center justify-center">
                <p className="text-center text-slate-400">Project Image</p>
              </div>
              <div>
                <p className="text-primary font-bold mb-2">CASE STUDY</p>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                  Digital Banking Revolution: 500k+ Users
                </h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  A traditional bank needed to launch a modern mobile banking app to retain customers in
                  the fintech revolution. We developed a secure, intuitive app that became the most
                  downloaded banking app in the region.
                </p>
                <div className="bg-slate-50 p-6 rounded-lg mb-6">
                  <p className="font-bold text-slate-900 mb-3">Results:</p>
                  <ul className="space-y-2 text-slate-600">
                    <li>✓ 500,000+ active users in year one</li>
                    <li>✓ 4.8/5 star app rating</li>
                    <li>✓ 100,000+ daily transactions</li>
                    <li>✓ 92% user retention rate</li>
                  </ul>
                </div>
                <Link
                  href="/ideas-at-work/mobile-banking-app"
                  className="text-primary hover:text-primary-dark font-bold"
                >
                  Read Full Case Study →
                </Link>
              </div>
            </div>

            {/* Story 3 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-primary font-bold mb-2">CASE STUDY</p>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                  Manufacturing Transformation: 35% Cost Reduction
                </h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  A large manufacturing company was operating with legacy systems and manual processes,
                  struggling to compete with digital-native competitors. We led end-to-end digital
                  transformation with IoT, AI, and cloud technologies.
                </p>
                <div className="bg-slate-50 p-6 rounded-lg mb-6">
                  <p className="font-bold text-slate-900 mb-3">Results:</p>
                  <ul className="space-y-2 text-slate-600">
                    <li>✓ 35% reduction in operational costs</li>
                    <li>✓ 45% improvement in efficiency</li>
                    <li>✓ 60% reduction in unplanned equipment downtime</li>
                    <li>✓ 250% ROI within 18 months</li>
                  </ul>
                </div>
                <Link
                  href="/ideas-at-work/digital-transformation-manufacturing"
                  className="text-primary hover:text-primary-dark font-bold"
                >
                  Read Full Case Study →
                </Link>
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-orange-50 p-12 rounded-lg h-96 flex items-center justify-center">
                <p className="text-center text-slate-400">Project Image</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Stories */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Explore More Success Stories</h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Visit our Ideas at Work section to see our full portfolio of successful engagements.
          </p>
          <Link
            href="/ideas-at-work"
            className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            View All Case Studies
          </Link>
        </div>
      </section>
    </div>
  )
}
