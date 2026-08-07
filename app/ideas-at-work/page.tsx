import { Metadata } from 'next'
import Link from 'next/link'
import { CaseStudyCard } from '@/components/cards/CaseStudyCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ideasAtWorkArticles } from '@/lib/data'
import { getCaseStudies, getBlogPosts } from '@/lib/sanity/content'

export const metadata: Metadata = {
  title: 'Practice Notes',
  description:
    'Explore our case stories, thought leadership, and practical insights from advisory engagements.',
}

export default async function IdeasAtWorkPage() {
  const [caseStudiesData, blogPosts] = await Promise.all([getCaseStudies(), getBlogPosts()])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary-deeper text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Practice Notes</h1>
          <p className="text-xl text-slate-200 max-w-2xl">
            Discover how TEAM Consulting turns insight into practical outcomes for organisations facing change.
          </p>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Selected Case Stories"
            subtitle="Real projects, real outcomes, and the lessons that stayed with us"
            centered
          />

          <div className="grid md:grid-cols-2 gap-8 mt-16">
            {caseStudiesData.map((study) => (
              <CaseStudyCard key={study.id} caseStudy={study} />
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">
            Collective Impact
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">200+</p>
              <p className="text-slate-600">Successful Projects</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">500+</p>
              <p className="text-slate-600">Happy Clients</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">$500M+</p>
              <p className="text-slate-600">Client Business Value</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">1000+</p>
              <p className="text-slate-600">Team Members</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Articles & Excerpts"
            subtitle="Downloadable thought leadership from TEAM Ideas @ Work"
            centered
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {(Array.isArray(blogPosts) && blogPosts.length ? blogPosts : ideasAtWorkArticles).map((article: any) => (
              <article key={article.id} className="rounded-xl border border-slate-200 p-6 flex flex-col">
                <h3 className="text-xl font-bold text-slate-900">{article.title}</h3>
                <p className="mt-3 text-slate-600 flex-1">{article.excerpt}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-primary">
                  {(article.tags ?? []).join(' * ')}
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <Link href={`/ideas-at-work/articles/${article.slug}`} className="text-sm font-semibold text-primary hover:text-primary-dark">
                    Read Article →
                  </Link>
                  {article.downloadUrl && (
                    <a href={article.downloadUrl} download className="text-sm font-semibold text-slate-500 hover:text-slate-700">
                      Download PDF
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

