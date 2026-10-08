import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ideasAtWorkArticles } from '@/lib/data'
import { getCaseStudies, getBlogPosts } from '@/lib/sanity/content'
import { PageHero, Section, SectionIntro, EnquiryBand, ArrowLink } from '@/components/editorial'

export const metadata: Metadata = {
  title: 'Practice Notes',
  description: 'Case stories, thought leadership and practical insight from TEAM Consulting engagements.',
  alternates: { canonical: '/ideas-at-work' },
}

const articleImages = ['/images/portfolio/portfolio-3.webp', '/images/portfolio/portfolio-8.webp', '/images/portfolio/portfolio-11.webp', '/images/portfolio/portfolio-9.webp', '/images/portfolio/portfolio-10.webp']

export default async function IdeasAtWorkPage() {
  const [caseStudiesData, blogPosts] = await Promise.all([getCaseStudies(), getBlogPosts()])
  const articles: { id: string; slug: string; title: string; excerpt: string; tags?: string[] }[] =
    Array.isArray(blogPosts) && blogPosts.length ? blogPosts : ideasAtWorkArticles

  return (
    <>
      <PageHero
        eyebrow="Practice notes"
        title="What we are learning from the work."
        lead="Short, useful reads for leaders, and stories from real engagements. Grounded in what actually happens when organisations try to grow, govern and change."
      />

      <Section>
        <SectionIntro eyebrow="Articles" title="Notes on strategy, governance and people." />
        <ul className="mt-12 grid md:grid-cols-3 gap-10">
          {articles.map((a, i) => (
            <li key={a.id}>
              <Link href={`/ideas-at-work/articles/${a.slug}`} className="group block">
                <div className="relative aspect-[3/2] overflow-hidden rounded-sm">
                  <Image src={articleImages[i % articleImages.length]} alt="" fill sizes="(min-width:768px) 30vw, 100vw" className="object-cover" />
                </div>
                <p className="mt-4 text-sm text-body/70">{(a.tags ?? []).join(', ')}</p>
                <h3 className="mt-1 font-heading font-bold text-xl text-primary-deeper group-hover:text-primary leading-snug">{a.title}</h3>
                <p className="mt-2 text-body leading-relaxed">{a.excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="tint">
        <SectionIntro eyebrow="Case stories" title="Selected engagements." />
        <ul className="mt-10 border-t border-gray-300">
          {caseStudiesData.map((s) => (
            <li key={s.id} className="border-b border-gray-300">
              <Link href={`/ideas-at-work/${s.slug}`} className="group grid md:grid-cols-12 gap-4 py-6 items-baseline">
                <p className="md:col-span-3 text-sm text-body/70">{s.category} · {s.client}</p>
                <h3 className="md:col-span-6 font-heading font-bold text-xl text-primary-deeper group-hover:text-primary">{s.title}</h3>
                <p className="md:col-span-3 md:text-right font-semibold text-primary-deeper group-hover:text-primary">
                  Read <span aria-hidden className="text-primary">→</span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <ArrowLink href="/why-team/our-success-stories">See case stories with results</ArrowLink>
        </div>
      </Section>

      <EnquiryBand />
    </>
  )
}
