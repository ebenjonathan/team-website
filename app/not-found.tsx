import type { Metadata } from 'next'
import { PageHero, ButtonLink, ArrowLink } from '@/components/editorial'

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'The page you are looking for does not exist.',
}

export default function NotFound() {
  return (
    <PageHero
      eyebrow="Page not found"
      title="We could not find that page."
      lead="It may have moved or the address may be mistyped. Try one of these instead."
    >
      <ButtonLink href="/">Go to the homepage</ButtonLink>
      <ArrowLink href="/service-offerings">Browse our services</ArrowLink>
      <ArrowLink href="/contact-us#enquiry">Contact us</ArrowLink>
    </PageHero>
  )
}
