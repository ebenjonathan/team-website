import { Metadata } from 'next'
import Link from 'next/link'
import { getCaseStudies } from '@/lib/sanity/content'

export const metadata: Metadata = {
  title: 'Success Stories',
  description: 'Inspiring transformation stories from our successful engagements.',
}

export default async function SuccessStoriesPage() {
  const stories = await getCaseStudies()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary-deeper text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Success Stories</h1>
          <p className="text-xl text-slate-200 max-w-2xl">
            Inspiring transformation stories from organizations that partnered with TEAM Consulting.
          </p>
        </div>
      </section>

      {/* Stories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="space-y-14">
            {stories.map((story) => (
              <article key={story.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
                <p className="text-primary font-bold mb-2">CASE STUDY</p>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">{story.title}</h2>
                <p className="text-slate-600 leading-relaxed mb-5">{story.summary}</p>

                {!!story.challenge && (
                  <p className="text-sm text-slate-700 mb-3">
                    <span className="font-semibold">Challenge: </span>
                    {story.challenge}
                  </p>
                )}

                {!!story.approach && (
                  <p className="text-sm text-slate-700 mb-5">
                    <span className="font-semibold">Our Approach: </span>
                    {story.approach}
                  </p>
                )}

                {!!story.metrics?.length && (
                  <div className="bg-white p-5 rounded-lg mb-5 border border-slate-200">
                    <p className="font-bold text-slate-900 mb-3">Results:</p>
                    <ul className="grid gap-2 md:grid-cols-2 text-slate-600 text-sm">
                      {story.metrics.map((metric) => (
                        <li key={`${story.id}-${metric.label}`}>OK: {metric.value} {metric.label}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <Link
                  href={`/ideas-at-work/${story.slug}`}
                  className="text-primary hover:text-primary-dark font-bold"
                >
                  Read Full Case Study →
                </Link>
              </article>
            ))}
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

