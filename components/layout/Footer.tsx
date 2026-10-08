import Image from 'next/image'
import Link from 'next/link'
import { Facebook, Linkedin, MapPin } from 'lucide-react'
import { serviceAreas } from '@/lib/data/masterBrief'
import { NewsletterForm } from '@/components/forms/NewsletterForm'

const columns = [
  {
    heading: 'Services',
    links: serviceAreas.map((s) => ({ label: s.title, href: `/service-offerings/${s.slug}` })),
  },
  {
    heading: 'About us',
    links: [
      { label: 'Our story', href: '/who-we-are' },
      { label: 'Leadership', href: '/why-team/our-team' },
      { label: 'Partners', href: '/why-team/our-partners' },
      { label: 'Markets & clients', href: '/our-markets-clients' },
      { label: 'Practice notes', href: '/ideas-at-work' },
      { label: 'TEAM tools', href: '/tools' },
      { label: 'Careers', href: '/careers' },
      { label: 'FAQs', href: '/faq' },
      { label: 'Company profile (PDF)', href: '/downloads/TEAM-Consulting-Company-Profile.pdf' },
    ],
  },
]

const socialLinks = [
  { Icon: Linkedin, label: 'TEAM Consulting on LinkedIn', href: 'https://zw.linkedin.com/company/teamadvisory' },
  { Icon: Facebook, label: 'TEAM Consulting on Facebook', href: 'https://www.facebook.com/TEAMConsult/' },
  { Icon: MapPin, label: 'Find TEAM Consulting on Google', href: 'https://share.google/xTt7ttQ2LtjxGdMqB' },
]

export function Footer() {
  return (
    <footer className="bg-primary-deeper text-white">
      <div className="container mx-auto py-16 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <Link href="/" className="inline-block bg-white rounded-sm p-2 mb-6" aria-label="TEAM Consulting home">
            <Image src="/images/TEAM-logo.png" alt="TEAM Consulting" width={365} height={406} className="h-14 w-auto" />
          </Link>
          <p className="text-sm text-white/70 leading-relaxed max-w-[32ch]">
            Helping organisations strengthen performance, stewardship and purpose through practical
            advisory support.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.heading} className="lg:col-span-2">
            <p className="font-semibold mb-4">{col.heading}</p>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  {l.href.endsWith('.pdf') ? (
                    <a href={l.href} download className="text-sm text-white/70 hover:text-white">
                      {l.label}
                    </a>
                  ) : (
                    <Link href={l.href} className="text-sm text-white/70 hover:text-white">
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="lg:col-span-2">
          <p className="font-semibold mb-4">Contact</p>
          <address className="not-italic text-sm text-white/70 space-y-2.5">
            <p>Harare, Zimbabwe</p>
            <p>
              <a href="tel:+263772202290" className="hover:text-white">+263 77 220 2290</a>
            </p>
            <p>
              <a href="mailto:info@team.co.zw" className="hover:text-white">info@team.co.zw</a>
            </p>
            <p>Mon to Fri, 08:00 to 16:30 CAT</p>
          </address>
        </div>

        <div className="lg:col-span-3">
          <p className="font-semibold mb-2">Subscribe to our updates</p>
          <p className="text-sm text-white/70 leading-relaxed mb-4">
            Practice notes, tools and event invitations. No spam, unsubscribe any time.
          </p>
          <NewsletterForm />
          <ul className="mt-8 flex gap-3">
            {socialLinks.map(({ Icon, label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <p>© {new Date().getFullYear()} TEAM Consulting. Rooted in Harare, working across the region.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-white">Terms of service</Link>
            <Link href="/privacy" className="hover:text-white">Privacy policy</Link>
            <Link href="/contact-us#enquiry" className="hover:text-white">Contact us</Link>
            <Link href="/admin" className="hover:text-white" rel="nofollow">Admin login</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
