import type { Metadata } from 'next'
import Image from 'next/image'
import { teamTools, toolCategories, type ToolCategory } from '@/lib/data/tools'
import { enquiryHref } from '@/lib/data/enquiry'
import { PageHero, Section, SectionIntro, EnquiryBand, ArrowLink } from '@/components/editorial'

export const metadata: Metadata = {
  title: 'TEAM Tools',
  description: 'Practical culture, engagement and diagnostic tools from TEAM Consulting.',
  alternates: { canonical: '/tools' },
}

export default function ToolsPage() {
  const categories = (Object.keys(toolCategories) as ToolCategory[]).filter((c) =>
    teamTools.some((t) => t.category === c)
  )

  return (
    <>
      <PageHero
        eyebrow="TEAM tools"
        title="Practical tools for culture, engagement and organisational health."
        lead="The instruments we use in our engagements, made available so your teams can keep assessing, aligning and improving between projects."
      />

      {categories.map((cat, ci) => (
        <Section key={cat} tone={ci % 2 ? 'tint' : 'white'}>
          <SectionIntro title={toolCategories[cat].title} lead={toolCategories[cat].body} />
          <ul className="mt-12 grid md:grid-cols-2 gap-x-12 gap-y-14">
            {teamTools
              .filter((t) => t.category === cat)
              .map((tool) => (
                <li key={tool.slug} id={tool.slug} className="border-t-2 border-primary-deeper pt-6 scroll-mt-28">
                  {tool.image && (
                    <div className="relative aspect-[3/2] overflow-hidden rounded-sm mb-6">
                      <Image src={tool.image} alt="" fill sizes="(min-width:768px) 45vw, 100vw" className="object-cover" />
                    </div>
                  )}
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-sm font-semibold text-primary">{tool.kicker}</p>
                    <p className="text-sm text-body/70">{tool.status === 'live' ? 'Available now' : 'Coming soon'}</p>
                  </div>
                  <h2 className="mt-2 font-heading font-bold text-2xl text-primary-deeper">{tool.name}</h2>
                  <p className="mt-3 text-body leading-relaxed max-w-[56ch]">{tool.description}</p>
                  <div className="mt-5">
                    {tool.status === 'live' && tool.href ? (
                      <ArrowLink href={tool.href} external>
                        Open {tool.name}
                      </ArrowLink>
                    ) : (
                      <ArrowLink href={enquiryHref('tools')}>Ask to be told when it launches</ArrowLink>
                    )}
                  </div>
                </li>
              ))}
          </ul>
        </Section>
      ))}

      <EnquiryBand
        title="Want these tools rolled out across your organisation?"
        body="We can set them up for your teams, facilitate the sessions and help you act on what you learn."
        topic="tools"
        buttonLabel="Talk to us about the tools"
      />
    </>
  )
}
