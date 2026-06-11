import Image from 'next/image'
import Link from 'next/link'
import { Twitter, Facebook, Instagram, Linkedin, Phone, Clock } from 'lucide-react'

const footerLinks = {
  company: [
    { label: 'Who We Are', href: '/who-we-are' },
    { label: 'Our Markets & Clients', href: '/our-markets-clients' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Why Team?', href: '/why-team' },
    { label: 'Our Team', href: '/why-team/our-team' },
    { label: 'Our Partners', href: '/why-team/our-partners' },
    { label: 'Success Stories', href: '/why-team/our-success-stories' },
  ],
  services: [
    { label: 'Strategy & Design', href: '/service-offerings/strategy-design' },
    { label: 'Governance & Policy', href: '/service-offerings/governance-policy' },
    { label: 'Operations', href: '/service-offerings/operations' },
    { label: 'Analytics & Research', href: '/service-offerings/analytics-research' },
    { label: 'Wellness & Coaching', href: '/service-offerings/wellness-coaching' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
}

const socialLinks = [
  { Icon: Twitter, label: 'Twitter' },
  { Icon: Facebook, label: 'Facebook' },
  { Icon: Instagram, label: 'Instagram' },
  { Icon: Linkedin, label: 'LinkedIn' },
]

export function Footer() {
  return (
    <footer className="bg-primary-deeper text-white">
      <div className="container mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-6">
              <Image
                src="/images/logo.png"
                alt="TEAM Consulting"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="font-bold font-heading text-xl">TEAM Consulting</span>
            </Link>
            <p className="text-sm text-white/70 leading-relaxed mb-6">
              Transforming ideas into strategic business solutions. Your trusted partner for digital
              growth across Africa and beyond.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold font-heading text-xs uppercase tracking-widest mb-6 text-white/50">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold font-heading text-xs uppercase tracking-widest mb-6 text-white/50">
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold font-heading text-xs uppercase tracking-widest mb-6 text-white/50">
              Contact
            </h4>
            <div className="space-y-4 text-sm text-white/70">
              {/* Phone */}
              <a
                href="tel:+263772202290"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                +263 77 220 2290
              </a>
              {/* Zimbabwe office */}
              <div className="flex items-start gap-2">
                <Image
                  src="https://flagcdn.com/w20/zw.png"
                  alt="Zimbabwe"
                  width={20}
                  height={14}
                  className="mt-0.5 flex-shrink-0 rounded-sm"
                  unoptimized
                />
                <div>
                  <span className="text-white/50 block text-xs mb-1">Harare, Zimbabwe</span>
                  <a href="mailto:ZW@teamadvisoryservices.com" className="hover:text-white transition-colors block">
                    ZW@teamadvisoryservices.com
                  </a>
                  <a href="mailto:info@team.co.zw" className="hover:text-white transition-colors block">
                    info@team.co.zw
                  </a>
                </div>
              </div>
              {/* Zambia office */}
              <div className="flex items-start gap-2">
                <Image
                  src="https://flagcdn.com/w20/zm.png"
                  alt="Zambia"
                  width={20}
                  height={14}
                  className="mt-0.5 flex-shrink-0 rounded-sm"
                  unoptimized
                />
                <div>
                  <span className="text-white/50 block text-xs mb-1">Lusaka, Zambia</span>
                  <a href="mailto:ZM@teamadvisoryservices.com" className="hover:text-white transition-colors block">
                    ZM@teamadvisoryservices.com
                  </a>
                </div>
              </div>
              {/* Business Hours */}
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-white/50 block text-xs mb-1">Business Hours</span>
                  <span>Monday - Friday, 08:00 - 16:30 CAT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>&copy; {new Date().getFullYear()} TEAM Consulting. All rights reserved.</p>
          <div className="flex gap-4">
            {footerLinks.legal.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

