import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ideasAtWorkArticles } from '@/lib/data'
import { publicFileExists } from '@/lib/server/publicFile'
import { PageHero, Section, EnquiryBand, ArrowLink } from '@/components/editorial'

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
  const article = ideasAtWorkArticles.find((a) => a.slug === slug)
  if (!article) notFound()
  const body = (article as { body?: { heading?: string; content: string }[] }).body ?? []
  const others = ideasAtWorkArticles.filter((a) => a.slug !== slug)

  return (
    <>
      <PageHero eyebrow={`Practice note · ${article.tags.join(', ')}`} title={article.title} lead={article.excerpt} />

      <Section className="max-w-3xl">
        <article className="space-y-10">
          {body.length ? (
            body.map((section, i) => (
              <div key={i}>
                {section.heading && (
                  <h2 className="font-heading font-bold text-2xl text-primary-deeper mb-4">{section.heading}</h2>
                )}
                <p className="text-lg text-body leading-[1.75]">{section.content}</p>
              </div>
            ))
          ) : (
            <p className="text-lg text-body leading-[1.75]">{article.excerpt}</p>
          )}
        </article>

        {publicFileExists(article.downloadUrl) && (
          <div className="mt-12 border-t border-gray-300 pt-6">
            <ArrowLink href={article.downloadUrl} external>Download this note as a PDF</ArrowLink>
          </div>
        )}

        <div className="mt-12 border-t border-gray-300 pt-8">
          <p className="text-sm font-semibold text-body/70 mb-4">Keep reading</p>
          <ul className="space-y-3">
            {others.map((a) => (
              <li key={a.slug}>
                <ArrowLink href={`/ideas-at-work/articles/${a.slug}`}>{a.title}</ArrowLink>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <EnquiryBand />
    </>
  )
}
