import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ideasAtWorkArticles } from '@/lib/data'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return ideasAtWorkArticles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = ideasAtWorkArticles.find((a) => a.slug === slug)
  if (!article) return {}
  return { title: article.title, description: article.excerpt }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = ideasAtWorkArticles.find((a) => a.slug === slug) as any

  if (!article) notFound()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-primary-deeper text-white py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-4">
            {(article.tags ?? []).join(' • ')}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{article.title}</h1>
          <p className="text-lg text-slate-200 max-w-3xl">{article.excerpt}</p>
        </div>
      </section>

      {/* Article Body */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          {Array.isArray(article.body) && article.body.length > 0 ? (
            <div className="prose prose-slate prose-lg max-w-none">
              {article.body.map((section: { heading?: string; content: string }, i: number) => (
                <div key={i} className="mb-10">
                  {section.heading && (
                    <h2 className="text-sm font-bold text-primary mb-4 uppercase tracking-wide">
                      {section.heading}
                    </h2>
                  )}
                  <p className="text-slate-700 leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-600">{article.excerpt}</p>
          )}

          {/* Download CTA */}
          {article.downloadUrl && (
            <div className="mt-12 p-6 bg-slate-50 rounded-xl border border-slate-200">
              <p className="font-bold text-slate-900 mb-2">Download Full Article</p>
              <a
                href={article.downloadUrl}
                download
                className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-dark transition-colors"
              >
                Download PDF →
              </a>
            </div>
          )}

          {/* Back / CTA */}
          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href="/ideas-at-work"
              className="text-primary font-semibold hover:text-primary-dark transition-colors"
            >
              ← Back to Ideas at Work
            </Link>
            <Link
              href="/contact-us"
              className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Work With TEAM
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
