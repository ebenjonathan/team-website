import Link from 'next/link'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { companyProfile, ideasAtWorkArticles, services } from '@/lib/data'
import { getBlogPosts, getGlobalSettings, getServiceOfferings } from '@/lib/sanity/content'

export default async function HomePage() {
  const [settings, blogPosts, serviceItems] = await Promise.all([
    getGlobalSettings(),
    getBlogPosts(),
    getServiceOfferings(),
  ])

  const stats = settings?.stats ?? companyProfile.stats
  const title = settings?.name ?? companyProfile.name
  const tagline = settings?.tagline ?? companyProfile.tagline
  const overview = settings?.overview?.[0] ?? companyProfile.overview[0]

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-24 text-white">
        <div className="container mx-auto px-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-light">{title}</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-bold leading-tight md:text-6xl">We Are Greater Than Me</h1>
          <p className="mt-6 max-w-3xl text-lg text-slate-200">
            {tagline}. {overview}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact-us" className="rounded-md bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark">
              Contact Us
            </Link>
            <Link href="/service-offerings" className="rounded-md border border-white/30 px-6 py-3 font-semibold text-white hover:border-white">
              Explore Our Services
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((stat: any) => (
            <article key={stat.id} className="rounded-lg border border-slate-200 p-5 text-center">
              <p className="text-3xl font-bold text-primary">{stat.display}</p>
              <p className="mt-2 text-sm text-slate-700">{stat.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900">Core Service Areas</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {serviceItems.slice(0, 6).map((service) => (
              <article key={service.id} className="rounded-lg bg-white p-5">
                <h3 className="text-xl font-semibold text-slate-900">{service.title}</h3>
                <p className="mt-2 text-slate-600">{service.description}</p>
                <Link href={`/service-offerings/${service.slug}`} className="mt-3 inline-block text-sm font-semibold text-primary">
                  View Details
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-slate-900">Latest Ideas @ Work</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {(Array.isArray(blogPosts) && blogPosts.length ? blogPosts : ideasAtWorkArticles).map((article: any) => (
            <article key={article.id} className="rounded-lg border border-slate-200 p-5">
              <h3 className="text-xl font-semibold text-slate-900">{article.title}</h3>
              <p className="mt-2 text-slate-600">{article.excerpt}</p>
              <Link href="/ideas-at-work" className="mt-3 inline-block text-sm font-semibold text-primary">
                Read More
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 py-16 text-white">
        <div className="container mx-auto grid gap-8 px-4 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl font-bold">Stay Updated</h2>
            <p className="mt-3 text-slate-300">
              Subscribe for new Ideas @ Work articles, event announcements, and insight updates.
            </p>
          </div>
          <div className="rounded-xl bg-white p-4">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  )
}
