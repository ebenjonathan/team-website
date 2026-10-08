import { cn } from '@/lib/utils'
import { Eyebrow, ButtonLink, ArrowLink } from './primitives'
import { enquiryHref, type EnquiryTopic } from '@/lib/data/enquiry'

type Tone = 'white' | 'tint' | 'dark'

const toneCls: Record<Tone, string> = {
  white: 'bg-white',
  tint: 'bg-primary-light',
  dark: 'bg-primary-deeper text-white',
}

/** Standard page section with consistent vertical rhythm. */
export function Section({
  tone = 'white',
  children,
  className,
  id,
  bordered,
}: {
  tone?: Tone
  children: React.ReactNode
  className?: string
  id?: string
  bordered?: boolean
}) {
  return (
    <section id={id} className={cn(toneCls[tone], bordered && 'border-t border-gray-200')}>
      <div className={cn('container mx-auto py-16 md:py-24', className)}>{children}</div>
    </section>
  )
}

/** Heading block used at the top of a section. */
export function SectionIntro({
  eyebrow,
  title,
  lead,
  light,
  className,
}: {
  eyebrow?: string
  title: string
  lead?: React.ReactNode
  light?: boolean
  className?: string
}) {
  return (
    <div className={cn('max-w-3xl', className)}>
      {eyebrow && <Eyebrow light={light}>{eyebrow}</Eyebrow>}
      <h2
        className={cn(
          'font-heading font-bold text-3xl md:text-[2.5rem] leading-[1.12] tracking-[-0.01em]',
          light ? 'text-white' : 'text-primary-deeper'
        )}
      >
        {title}
      </h2>
      {lead && (
        <div className={cn('mt-5 text-lg leading-relaxed', light ? 'text-white/75' : 'text-body')}>
          {lead}
        </div>
      )}
    </div>
  )
}

/** Large editorial page header. Replaces the old dark hero bands. */
export function PageHero({
  eyebrow,
  title,
  lead,
  children,
  aside,
}: {
  eyebrow?: string
  title: string
  lead?: React.ReactNode
  children?: React.ReactNode
  aside?: React.ReactNode
}) {
  return (
    <section className="bg-white border-b border-gray-200">
      <div className="container mx-auto pt-14 pb-14 md:pt-20 md:pb-20 grid lg:grid-cols-12 gap-10 items-end">
        <div className={aside ? 'lg:col-span-8' : 'lg:col-span-10'}>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="font-heading font-bold text-primary-deeper text-[2.25rem] leading-[1.1] md:text-5xl lg:text-[3.5rem] tracking-[-0.02em] max-w-[22ch]">
            {title}
          </h1>
          {lead && (
            <div className="mt-6 text-lg md:text-xl leading-relaxed text-body max-w-[62ch]">{lead}</div>
          )}
          {children && <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">{children}</div>}
        </div>
        {aside && <div className="lg:col-span-4">{aside}</div>}
      </div>
    </section>
  )
}

/** Closing call to action that opens the enquiry form with a topic pre-selected. */
export function EnquiryBand({
  title = 'Tell us what you are working on.',
  body = 'Share a little about your organisation and the challenge in front of you. A principal consultant will reply within two business days.',
  topic = 'general',
  buttonLabel = 'Make an enquiry',
}: {
  title?: string
  body?: string
  topic?: EnquiryTopic
  buttonLabel?: string
}) {
  return (
    <section className="bg-primary-deeper text-white">
      <div className="container mx-auto py-16 md:py-20 grid lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-8">
          <Eyebrow light>Work with us</Eyebrow>
          <h2 className="font-heading font-bold text-3xl md:text-[2.5rem] leading-[1.12] tracking-[-0.01em] max-w-[24ch]">
            {title}
          </h2>
          <p className="mt-5 text-lg text-white/75 leading-relaxed max-w-[58ch]">{body}</p>
        </div>
        <div className="lg:col-span-4 flex flex-col items-start lg:items-end gap-4">
          <ButtonLink href={enquiryHref(topic)} variant="light">
            {buttonLabel}
          </ButtonLink>
          <ArrowLink href="/free-diagnostic" light>
            Or start with the free diagnostic
          </ArrowLink>
        </div>
      </div>
    </section>
  )
}

/** Simple rule-separated list of short statements. */
export function RuleList({ items, light }: { items: React.ReactNode[]; light?: boolean }) {
  return (
    <ul className={cn('divide-y border-y', light ? 'divide-white/15 border-white/15' : 'divide-gray-200 border-gray-200')}>
      {items.map((item, i) => (
        <li key={i} className="py-4 leading-relaxed">
          {item}
        </li>
      ))}
    </ul>
  )
}
