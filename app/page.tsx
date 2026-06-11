import dynamic from 'next/dynamic'
import { HeroSection } from '@/components/sections/home/HeroSection'
import { StatsSection } from '@/components/sections/home/StatsSection'
import { FadeInSection } from '@/components/ui/FadeInSection'

// Below-fold sections — lazy-loaded to reduce the initial JS bundle
const CountryPresenceSection = dynamic(
  () => import('@/components/sections/home/CountryPresenceSection').then((m) => m.CountryPresenceSection),
  { ssr: true },
)
const AfricanPresenceSection = dynamic(
  () =>
    import('@/components/sections/home/AfricanPresenceSection').then(
      (m) => m.AfricanPresenceSection,
    ),
  { ssr: true },
)
const AboutSection = dynamic(
  () => import('@/components/sections/home/AboutSection').then((m) => m.AboutSection),
  { ssr: true },
)
const FeaturedServicesSection = dynamic(
  () => import('@/components/sections/home/FeaturedServicesSection').then((m) => m.FeaturedServicesSection),
  { ssr: true },
)
const TeamToolsSection = dynamic(
  () => import('@/components/sections/home/TeamToolsSection').then((m) => m.TeamToolsSection),
  { ssr: true },
)
const ClientsByCategorySection = dynamic(
  () => import('@/components/sections/home/ClientsByCategorySection').then((m) => m.ClientsByCategorySection),
  { ssr: true },
)
const TestimonialsSection = dynamic(
  () => import('@/components/sections/home/TestimonialsSection').then((m) => m.TestimonialsSection),
  { ssr: true },
)
const FAQSection = dynamic(
  () => import('@/components/sections/home/FAQSection').then((m) => m.FAQSection),
  { ssr: true },
)
const NewsletterSection = dynamic(
  () => import('@/components/sections/home/NewsletterSection').then((m) => m.NewsletterSection),
  { ssr: true },
)

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero — priority, not lazy */}
      <HeroSection />

      {/* Stats counters — dark green band, above fold on most screens */}
      <FadeInSection>
        <StatsSection />
      </FadeInSection>

      {/* Country flags infinite scroll */}
      <FadeInSection delay={50}>
        <CountryPresenceSection />
      </FadeInSection>

      {/* African corporate presence mosaic */}
      <FadeInSection delay={60}>
        <AfricanPresenceSection />
      </FadeInSection>

      {/* About / Who we are */}
      <FadeInSection delay={80}>
        <AboutSection />
      </FadeInSection>

      {/* Core service areas */}
      <FadeInSection delay={80}>
        <FeaturedServicesSection />
      </FadeInSection>

      {/* TEAM Tools suite */}
      <FadeInSection delay={80}>
        <TeamToolsSection />
      </FadeInSection>

      {/* Clients by category — horizontal scroll */}
      <FadeInSection delay={80}>
        <ClientsByCategorySection />
      </FadeInSection>

      {/* Testimonials */}
      <FadeInSection delay={80}>
        <TestimonialsSection />
      </FadeInSection>

      {/* FAQ */}
      <FadeInSection delay={80}>
        <FAQSection />
      </FadeInSection>

      {/* Newsletter / Stay Updated */}
      <FadeInSection delay={80}>
        <NewsletterSection />
      </FadeInSection>
    </div>
  )
}
